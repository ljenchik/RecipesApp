from flask import Flask, send_from_directory
from flask_cors import CORS
from models.models import db
from db.db_config import DB_CONFIG
import os

# Import blueprints
from routes.test_db import test_db_connection
from routes.recipes import recipes_bp
from routes.users import users_bp

app = Flask(__name__)
CORS(app)

# Database configuration
app.config['SQLALCHEMY_DATABASE_URI'] = f"postgresql://{DB_CONFIG['user']}:{DB_CONFIG['password']}@{DB_CONFIG['host']}:{DB_CONFIG['port']}/{DB_CONFIG['database']}"
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# Initialize database
db.init_app(app)

# Serve uploaded images
@app.route('/uploads/<path:filename>')
def serve_uploaded_file(filename):
    uploads_dir = os.path.join(os.path.dirname(__file__), 'uploads')
    return send_from_directory(uploads_dir, filename)

# Register blueprints
app.register_blueprint(test_db_connection, url_prefix='/test-db')
app.register_blueprint(recipes_bp, url_prefix='/recipes')
app.register_blueprint(users_bp, url_prefix='/users')

if __name__ == '__main__':
    print("🚀 Starting Recipes App on http://localhost:5000")
    app.run(debug=True, port=5000)