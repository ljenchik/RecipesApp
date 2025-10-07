import { useNavigate } from "react-router-dom";

function RecipeCard({ recipe }) {
    const navigate = useNavigate();

    return (
        <div
            className="recipe-card"
            onClick={() => navigate(`/recipe/${recipe.id}`)}
        >
            {recipe.image_url && (
                <img
                    src={recipe.image_url}
                    alt={recipe.title}
                    className="recipe-thumb"
                />
            )}
            <h3 className="recipe-title">{recipe.title}</h3>
        </div>
    );
}

export default RecipeCard;
