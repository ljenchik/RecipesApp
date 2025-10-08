# utils/helpers.py
from urllib.parse import urlparse

def is_valid_url(url):
    """Validate URL format"""
    if not url:
        return False
    try:
        result = urlparse(url)
        return all([result.scheme in ['http', 'https'], result.netloc])
    except:
        return False