# routes/recipes.py
from flask import Blueprint, request, jsonify
from recipe_scrapers import scrape_html
import requests
from bs4 import BeautifulSoup
from models.models import db, Recipe, User
import json

recipes_bp = Blueprint('recipes', __name__)

def generic_parse(html, url):
    """Fallback parser for unsupported sites"""
    soup = BeautifulSoup(html, 'html.parser')
    
    recipe_data = {
        'title': 'Unknown Recipe',
        'ingredients': [],
        'instructions': '',
        'prepTime': None,
        'servings': None,
        'imageUrl': None,
        'host': requests.utils.urlparse(url).netloc
    }
    
    # Try JSON-LD structured data
    json_ld_scripts = soup.find_all('script', type='application/ld+json')
    
    for script in json_ld_scripts:
        try:
            data = json.loads(script.string)
            
            if isinstance(data, list):
                recipe = next((item for item in data if item.get('@type') == 'Recipe'), None)
            else:
                recipe = data if data.get('@type') == 'Recipe' else None
            
            if recipe:
                recipe_data['title'] = recipe.get('name', 'Unknown Recipe')
                recipe_data['ingredients'] = recipe.get('recipeIngredient', [])
                
                # Handle instructions
                instructions = recipe.get('recipeInstructions', '')
                if isinstance(instructions, list):
                    recipe_data['instructions'] = '\n'.join([
                        step.get('text', str(step)) if isinstance(step, dict) else str(step)
                        for step in instructions
                    ])
                else:
                    recipe_data['instructions'] = str(instructions)
                
                recipe_data['prepTime'] = recipe.get('totalTime') or recipe.get('prepTime')
                recipe_data['servings'] = recipe.get('recipeYield')
                
                # Handle image
                image = recipe.get('image')
                if isinstance(image, dict):
                    recipe_data['imageUrl'] = image.get('url')
                elif isinstance(image, list) and image:
                    recipe_data['imageUrl'] = image[0] if isinstance(image[0], str) else image[0].get('url')
                elif isinstance(image, str):
                    recipe_data['imageUrl'] = image
                
                print(f"✓ Parsed from JSON-LD: {recipe_data['title']}")
                return recipe_data
                
        except Exception as e:
            print(f"⚠ JSON-LD parse error: {e}")
            continue
    
    # Simple HTML fallback
    title = soup.find('h1')
    if title:
        recipe_data['title'] = title.get_text().strip()
    
    print(f"⚠ Limited data from HTML: {recipe_data['title']}")
    return recipe_data

# Parse recipe from URL
@recipes_bp.route('/parse', methods=['POST'])
def parse_recipe():
    try:
        data = request.get_json()
        url = data.get('url')
        
        if not url:
            return jsonify({"error": "URL is required"}), 400
        
        print(f"📖 Parsing recipe from: {url}")
        
        # Fetch HTML
        response = requests.get(url, headers={
            'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36'
        })
        
        try:
            # Try recipe-scrapers first
            scraper = scrape_html(html=response.content, org_url=url)
            
            total_time = str(scraper.total_time()) if scraper.total_time() else None
            
            recipe = {
                'title': scraper.title(),
                'ingredients': scraper.ingredients(),
                'instructions': scraper.instructions(),
                'prepTime': total_time,
                'servings': scraper.yields(),
                'imageUrl': scraper.image(),
                'host': scraper.host()
            }
            
            print(f"✓ Parsed with recipe-scrapers: {recipe['title']}")
            
        except Exception as scraper_error:
            print(f"⚠ recipe-scrapers failed: {str(scraper_error)}")
            print("⚠ Using generic parser...")
            recipe = generic_parse(response.content, url)
        
        return jsonify(recipe), 200
        
    except Exception as e:
        print(f"✗ Error: {str(e)}")
        return jsonify({"error": f"Failed to parse recipe: {str(e)}"}), 500

# Get all recipes
@recipes_bp.route('', methods=['GET'])
@recipes_bp.route('/', methods=['GET'])
def get_recipes():
    try:
        user_id = request.args.get('userId', 1)
        recipes = Recipe.query.filter_by(user_id=user_id).order_by(Recipe.created_at.desc()).all()
        
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

# Parse and save in one call
@recipes_bp.route('/parse-and-save', methods=['POST'])
def parse_and_save():
    try:
        data = request.get_json()
        url = data.get('url')
        user_id = data.get('userId', 1)
        
        if not url:
            return jsonify({"error": "URL is required"}), 400
        
        print(f"📖 Parsing and saving from: {url}")
        
        response = requests.get(url, headers={'User-Agent': 'Mozilla/5.0'})
        
        try:
            scraper = scrape_html(html=response.content, org_url=url)
            
            recipe = Recipe(
                user_id=user_id,
                title=scraper.title(),
                source_url=url,
                ingredients=scraper.ingredients(),
                instructions=scraper.instructions(),
                prep_time=str(scraper.total_time()) if scraper.total_time() else None,
                servings=scraper.yields(),
                image_url=scraper.image(),
                host=scraper.host(),
                notes=data.get('notes', '')
            )
            
        except:
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
        return jsonify({"error": str(e)}), 500