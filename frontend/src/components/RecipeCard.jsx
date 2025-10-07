import { useNavigate } from "react-router-dom";

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
            <h3 className="recipe-title">{recipe.title}</h3>
            {/* Footer */}
            <div className="recipe-footer">
                <div>Ingredients: {recipe.ingredients.length}</div>
                <div>
                    Cooking time:{" "}
                    {Math.floor(recipe.prep_time / 60) > 0
                        ? `${Math.floor(recipe.prep_time / 60)}h${
                              recipe.prep_time % 60 !== 0
                                  ? ` ${recipe.prep_time % 60}m`
                                  : ""
                          }`
                        : `${recipe.prep_time}m`}
                </div>
            </div>
        </div>
    );
}

export default RecipeCard;
