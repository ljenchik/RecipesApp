import { useNavigate } from "react-router-dom";
import "../../css/RecipeCard.css";
import icon from "../../assets/svgs/recipes-app-icon.svg";

function CreateRecipeCard() {
    const navigate = useNavigate();

    const handleClick = () => {
        navigate("/create-recipe");
    };

    return (
        <div className="recipe-card" onClick={handleClick}>
            <div>
                <img src={icon} alt="Create Recipe" />
                <h3>Add your own recipe</h3>
                <button className="create-recipe-button">Add new recipe</button>
            </div>
        </div>
    );
}

export default CreateRecipeCard;
