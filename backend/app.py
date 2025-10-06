from flask import Flask, jsonify
from flask_cors import CORS
from models.models import db
from db.db_config import DB_CONFIG

# Import blueprints
from routes.recipes import recipes_bp
from routes.test_db import test_db_connection

app = Flask(__name__)
CORS(app)

# Database configuration
app.config['SQLALCHEMY_DATABASE_URI'] = f"postgresql://{DB_CONFIG['user']}:{DB_CONFIG['password']}@{DB_CONFIG['host']}:{DB_CONFIG['port']}/{DB_CONFIG['database']}"
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# Initialize database
db.init_app(app)

# Register blueprints
app.register_blueprint(test_db_connection, url_prefix='/test-db')
app.register_blueprint(recipes_bp, url_prefix='/recipes')


if __name__ == '__main__':
    print("🚀 Starting Recipes App on http://localhost:5000")
    app.run(debug=True, port=5000)