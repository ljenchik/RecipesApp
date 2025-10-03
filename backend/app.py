from flask import Flask, jsonify
from flask_cors import CORS
from models.models import db
from db_config import DB_CONFIG

# Import blueprints
from routes.recipes import recipes_bp

app = Flask(__name__)
CORS(app)

# Database configuration
app.config['SQLALCHEMY_DATABASE_URI'] = f"postgresql://{DB_CONFIG['user']}:{DB_CONFIG['password']}@{DB_CONFIG['host']}:{DB_CONFIG['port']}/{DB_CONFIG['database']}"
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# Initialize database
db.init_app(app)

# Register blueprints
app.register_blueprint(recipes_bp, url_prefix='/api/recipes')

# Home route
@app.route('/')
def home():
    return jsonify({"message": "Recipe API is running!"})

# Test database connection
@app.route('/api/test-db')
def test_db():
    try:
        from models import Recipe
        count = Recipe.query.count()
        return jsonify({
            "message": "Database connected!",
            "recipe_count": count
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    print("🚀 Starting Recipe API on http://localhost:5000")
    app.run(debug=True, port=5000)