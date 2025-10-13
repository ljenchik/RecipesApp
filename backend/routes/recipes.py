from flask import Blueprint, request, jsonify
from recipe_scrapers import scrape_html
import requests
from models.models import db, Recipe
from utils.helpers import is_valid_url, detect_encoding, generic_parse

import os
from werkzeug.utils import secure_filename
import uuid
from datetime import datetime

recipes_bp = Blueprint('recipes', __name__)

# Configure upload settings at the top of your file
UPLOAD_FOLDER = 'uploads/recipe-images'
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif', 'webp'}
MAX_FILE_SIZE = 5 * 1024 * 1024  # 5MB

# Create upload directory if it doesn't exist
os.makedirs(UPLOAD_FOLDER, exist_ok=True)


# Get all recipes
@recipes_bp.route('', methods=['GET'])
@recipes_bp.route('/', methods=['GET'])
def get_recipes():
    try:
        user_id = request.args.get('userId', type=int)
        query = Recipe.query.order_by(Recipe.created_at.desc())
        
        if user_id:
            query = query.filter_by(user_id=user_id)
        
        recipes = query.limit(10).all()

        print(f"✓ Found {len(recipes)} recipes")
        return jsonify([recipe.to_dict() for recipe in recipes]), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Create new recipe
@recipes_bp.route('', methods=['POST'])
@recipes_bp.route('/', methods=['POST'])
def create_recipe():
    try:
        data = request.get_json()
        
        if not data.get('title'):
            return jsonify({"error": "Title is required"}), 400
        
        recipe = Recipe(
            user_id=data.get('userId', 1),
            title=data['title'],
            source_url=data.get('sourceUrl'),
            ingredients=data.get('ingredients', []),
            instructions=data.get('instructions'),
            prep_time=data.get('prepTime'),
            cook_time=data.get('cookTime'),
            servings=data.get('servings'),
            image_url=data.get('imageUrl'),
            host=data.get('host'),
            notes=data.get('notes', '')
        )
        
        db.session.add(recipe)
        db.session.commit()
        
        print(f"✓ Recipe saved: {recipe.title}")
        return jsonify(recipe.to_dict()), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500

# Get single recipe
@recipes_bp.route('/<int:recipe_id>', methods=['GET'])
def get_recipe(recipe_id):
    recipe = Recipe.query.get(recipe_id)
    if recipe:
        return jsonify(recipe.to_dict()), 200
    return jsonify({"error": "Recipe not found"}), 404

@recipes_bp.route('/<int:recipe_id>', methods=['PUT'])
def update_recipe(recipe_id):
    try:
        recipe = Recipe.query.get(recipe_id)
        if not recipe:
            return jsonify({"error": "Recipe not found"}), 404
        
        data = request.get_json()
        
        # Update all possible fields
        if 'title' in data:
            recipe.title = data['title']
        if 'ingredients' in data:
            recipe.ingredients = data['ingredients']
        if 'instructions' in data:
            recipe.instructions = data['instructions']
        if 'image_url' in data:
            recipe.image_url = data['image_url']
        if 'notes' in data:
            recipe.notes = data['notes']
        if 'prep_time' in data:
            recipe.prep_time = data['prep_time']
        if 'servings' in data:
            recipe.servings = data['servings']
        
        db.session.commit()
        
        print(f"✓ Updated recipe: {recipe.title}")
        return jsonify(recipe.to_dict()), 200
        
    except Exception as e:
        db.session.rollback()
        print(f"✗ Update error: {str(e)}")
        import traceback
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500

# Update recipe notes
@recipes_bp.route('/<int:recipe_id>/notes', methods=['PUT'])
def update_notes(recipe_id):
    try:
        data = request.get_json()
        recipe = Recipe.query.get(recipe_id)
        
        if not recipe:
            return jsonify({"error": "Recipe not found"}), 404
        
        recipe.notes = data.get('notes', '')
        db.session.commit()
        
        return jsonify(recipe.to_dict()), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500

# Delete recipe
@recipes_bp.route('/<int:recipe_id>', methods=['DELETE'])
def delete_recipe(recipe_id):
    try:
        recipe = Recipe.query.get(recipe_id)
        if not recipe:
            return jsonify({"error": "Recipe not found"}), 404
        
        db.session.delete(recipe)
        db.session.commit()
        return jsonify({"message": "Recipe deleted"}), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500

# Parse and save recipe
@recipes_bp.route('/parse-and-save', methods=['POST'])
def parse_and_save():
    try:
        data = request.get_json()
        url = data.get('url')
        user_id = data.get('userId', 1)
        
        if not url:
            return jsonify({"error": "URL is required"}), 400
        
        if not is_valid_url(url):
            return jsonify({"error": "Invalid URL format"}), 400
        
        existing = Recipe.query.filter_by(user_id=user_id, source_url=url).first()
        if existing:
            return jsonify({
                "error": "Recipe already saved",
                "recipe": existing.to_dict()
            }), 409
        
        print(f"Parsing and saving from: {url}")
        
        # Improved headers
        headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
            'Accept-Language': 'en-US,en;q=0.9,ru;q=0.8,uk;q=0.7',
            'Accept-Charset': 'utf-8',
        }
        
        response = requests.get(url, headers=headers, timeout=15)
        
        # Detect encoding
        if response.encoding is None or response.encoding == 'ISO-8859-1':
            response.encoding = detect_encoding(response.content)
        
        try:
            scraper = scrape_html(html=response.content, org_url=url)
            
            recipe = Recipe(
                user_id=user_id,
                title=scraper.title(),
                source_url=url,
                ingredients=scraper.ingredients(),
                instructions=scraper.instructions(),
                prep_time=str(scraper.prep_time()) if scraper.prep_time() else None,
                servings=scraper.yields(),
                image_url=scraper.image(),
                host=scraper.host(),
                notes=data.get('notes', '')
            )
            
        except Exception as scraper_error:
            print(f"Scraper failed: {scraper_error}, using generic parser")
            parsed = generic_parse(response.content, url)
            recipe = Recipe(
                user_id=user_id,
                title=parsed['title'],
                source_url=url,
                ingredients=parsed['ingredients'],
                instructions=parsed['instructions'],
                prep_time=parsed['prepTime'],
                servings=parsed['servings'],
                image_url=parsed['imageUrl'],
                host=parsed['host'],
                notes=data.get('notes', '')
            )
        
        db.session.add(recipe)
        db.session.commit()
        
        print(f"✓ Saved: {recipe.title}")
        return jsonify(recipe.to_dict()), 201
        
    except Exception as e:
        db.session.rollback()
        print(f"✗ Error: {str(e)}")
        import traceback
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500
    

def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

# Upload image endpoint
@recipes_bp.route('/<int:recipe_id>/upload-image', methods=['POST'])
def upload_recipe_image(recipe_id):
    try:
        # Check if recipe exists
        recipe = Recipe.query.get(recipe_id)
        if not recipe:
            return jsonify({"error": "Recipe not found"}), 404
        
        # Check if file is in request
        if 'image' not in request.files:
            return jsonify({"error": "No image file provided"}), 400
        
        file = request.files['image']
        
        # Check if file is selected
        if file.filename == '':
            return jsonify({"error": "No file selected"}), 400
        
        # Validate file type
        if not allowed_file(file.filename):
            return jsonify({
                "error": "Invalid file type. Allowed: png, jpg, jpeg, gif, webp"
            }), 400
        
        # Validate file size
        file.seek(0, os.SEEK_END)
        file_size = file.tell()
        file.seek(0)
        
        if file_size > MAX_FILE_SIZE:
            return jsonify({"error": "File size must be less than 5MB"}), 400
        
        # Generate unique filename
        file_extension = secure_filename(file.filename).rsplit('.', 1)[1].lower()
        unique_filename = f"{uuid.uuid4().hex}-{int(datetime.now().timestamp())}.{file_extension}"
        
        # Save file
        file_path = os.path.join(UPLOAD_FOLDER, unique_filename)
        file.save(file_path)
        
        # Return FULL URL
        image_url = f"http://localhost:5000/uploads/recipe-images/{unique_filename}"
        
        print(f"✓ Image uploaded: {image_url}")
        return jsonify({"imageUrl": image_url}), 200
        
    except Exception as e:
        print(f"✗ Upload error: {str(e)}")
        import traceback
        traceback.print_exc()
        return jsonify({"error": "Failed to upload image"}), 500

