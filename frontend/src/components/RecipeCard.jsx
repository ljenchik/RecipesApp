import { useNavigate } from "react-router-dom";

function RecipeCard({ recipe }) {
    const navigate = useNavigate();

    return (
        <div
            className="recipe-card"
            onClick={() => navigate(`/recipe/${recipe.id}`)}
        >
            {recipe.image_url && (
                <img src={recipe.image_url} alt={recipe.title} />
            )}
            <h3 className="recipe-title">{recipe.title}</h3>
            {/* Footer */}
            <div className="recipe-footer">
                <div>Ingredients: {recipe.ingredients.length}</div>
                <div>Cooking time: {recipe.prep_time} minutes</div>
            </div>
        </div>
    );
}

export default RecipeCard;
