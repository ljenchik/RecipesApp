# utils/helpers.py
from urllib.parse import urlparse
from urllib.parse import urlparse
from bs4 import BeautifulSoup
import json
import chardet

def is_valid_url(url):
    """Validate URL format"""
    if not url:
        return False
    try:
        result = urlparse(url)
        return all([result.scheme in ['http', 'https'], result.netloc])
    except:
        return False
    
def detect_encoding(content):
    """Detect the encoding of the content"""
    result = chardet.detect(content)
    return result.get('encoding') or 'utf-8'

def generic_parse(html, url):
    # --- STEP 1: Handle encoding ---
    if isinstance(html, bytes):
        encoding = detect_encoding(html)
        html = html.decode(encoding, errors='replace')

    soup = BeautifulSoup(html, 'html.parser')

    recipe_data = {
        'title': 'Unknown Recipe',
        'ingredients': [],
        'instructions': '',
        'prepTime': None,
        'cookTime': None,
        'servings': None,
        'imageUrl': None,
        'host': urlparse(url).netloc
    }

    # --- STEP 2: Extract JSON-LD scripts ---
    json_ld_scripts = soup.find_all('script', type='application/ld+json')

    def clean_text(t):
        if not t:
            return ""
        # Don't replace \n here - keep structure
        return unescape(str(t)).strip()

    def extract_instructions(instr):
        """Extract instruction text from JSON-LD structure (str, list, HowToStep, HowToSection)."""
        steps = []

        if not instr:
            return steps

        if isinstance(instr, str):
            steps.append(clean_text(instr))

        elif isinstance(instr, list):
            for step in instr:
                if isinstance(step, dict):
                    if step.get('@type') == 'HowToStep':
                        text = clean_text(step.get('text') or step.get('name'))
                        if text:
                            steps.append(text)
                    elif step.get('@type') == 'HowToSection':
                        # section with name + steps inside
                        section_name = clean_text(step.get('name'))
                        substeps = extract_instructions(step.get('itemListElement', []))
                        if section_name and substeps:
                            # Add section name as header
                            steps.append(section_name + ":")
                            steps.extend(substeps)
                        elif substeps:
                            steps.extend(substeps)
                    else:
                        text = clean_text(step.get('text') or step.get('name') or str(step))
                        if text:
                            steps.append(text)
                else:
                    text = clean_text(str(step))
                    if text:
                        steps.append(text)

        elif isinstance(instr, dict):
            steps.extend(extract_instructions(instr.get('itemListElement')))

        # Filter out empty
        return [s for s in steps if s]

    # --- STEP 3: Try to parse JSON-LD ---
    for script in json_ld_scripts:
        try:
            if not script.string:
                continue

            data = json.loads(script.string)

            # If it's wrapped in a list or graph, drill down
            recipe = None
            if isinstance(data, list):
                recipe = next((item for item in data if item.get('@type') == 'Recipe'), None)
            elif isinstance(data, dict):
                if '@graph' in data:
                    recipe = next((item for item in data['@graph'] if item.get('@type') == 'Recipe'), None)
                elif data.get('@type') == 'Recipe':
                    recipe = data

            if recipe:
                # --- Title ---
                recipe_data['title'] = clean_text(recipe.get('name') or recipe_data['title'])

                # --- Ingredients ---
                ingredients = recipe.get('recipeIngredient', [])
                if isinstance(ingredients, list):
                    recipe_data['ingredients'] = [clean_text(i) for i in ingredients if clean_text(i)]

                # --- Instructions ---
                # CRITICAL CHANGE: Join with double newline to preserve step boundaries
                instr = recipe.get('recipeInstructions')
                instruction_steps = extract_instructions(instr)
                recipe_data['instructions'] = "\n\n".join(instruction_steps)  # Use \n\n instead of space

                # --- Time ---
                recipe_data['prepTime'] = recipe.get('prepTime')
                recipe_data['cookTime'] = recipe.get('cookTime')
                if not recipe_data['prepTime']:
                    recipe_data['prepTime'] = recipe.get('totalTime')

                # --- Servings ---
                servings = recipe.get('recipeYield')
                if isinstance(servings, list):
                    recipe_data['servings'] = clean_text(str(servings[0]) if servings else "")
                else:
                    recipe_data['servings'] = clean_text(str(servings)) if servings else None

                # --- Image ---
                image = recipe.get('image')
                if isinstance(image, dict):
                    recipe_data['imageUrl'] = image.get('url')
                elif isinstance(image, list) and image:
                    recipe_data['imageUrl'] = image[0] if isinstance(image[0], str) else image[0].get('url')
                elif isinstance(image, str):
                    recipe_data['imageUrl'] = image

                print(f"✓ Parsed from JSON-LD: {recipe_data['title']}")
                print(f"   - Steps: {len(instruction_steps)}")
                return recipe_data

        except json.JSONDecodeError as e:
            print(f"⚠ JSON decode error: {e}")
            continue
        except Exception as e:
            print(f"⚠ JSON-LD parse error: {e}")
            import traceback
            traceback.print_exc()
            continue

    # --- STEP 4: Fallback scraping if JSON-LD not found ---
    title_tag = soup.find('h1')
    if title_tag:
        recipe_data['title'] = clean_text(title_tag.get_text())

    # Try grabbing ingredients list
    ingredient_candidates = soup.select('li[class*="ingredient"], .ingredients li')
    if ingredient_candidates:
        recipe_data['ingredients'] = [clean_text(li.get_text()) for li in ingredient_candidates if clean_text(li.get_text())]

    # Try grabbing instructions paragraphs
    instruction_candidates = soup.select('li[class*="instruction"], .instructions li, .method li, .steps li')
    instructions = [clean_text(li.get_text()) for li in instruction_candidates if clean_text(li.get_text())]
    if instructions:
        recipe_data['instructions'] = "\n\n".join(instructions)  # Use \n\n here too

    print(f"⚠ Fallback parse for: {recipe_data['title']}")
    print(f"   - Ingredients: {len(recipe_data.get('ingredients', []))}")
    print(f"   - Instructions: {'Yes' if recipe_data['instructions'] else 'No'}")
    
    return recipe_data