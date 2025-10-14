import { useNavigate } from "react-router-dom";
import { parseTime } from "../../utils/helpers";

function RecipeCard({ recipe, onDelete }) {
    const navigate = useNavigate();

    const handleDelete = (e) => {
        e.stopPropagation();
        if (onDelete) {
            onDelete(recipe.id);
        }
    };

    return (
        <div
            className="recipe-card"
            onClick={() => navigate(`/recipe/${recipe.id}`)}
        >
            {/* Delete Button */}
            <button className="delete-button" onClick={handleDelete}>
                ✕
            </button>

            {recipe.image_url && (
                <img src={recipe.image_url} alt={recipe.title} />
            )}
            <h3 className="recipe-title-card">{recipe.title}</h3>

            {/* Footer */}
            <div className="recipe-footer">
                <div>Ingredients: {recipe.ingredients.length}</div>
                <div>⏱️ {parseTime(recipe.prep_time)}</div>
            </div>
        </div>
    );
}

export default RecipeCard;
