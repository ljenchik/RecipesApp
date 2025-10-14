import { Link } from "react-router-dom";
import icon from "../../assets/svgs/recipes-app-icon.svg";

function CreateRecipePage() {
    return (
        <div>
            <header>
                <Link to="/" className="title-app-link">
                    <div className="title-app">
                        <img
                            src={icon}
                            alt="Recipes App Icon"
                            className="app-icon"
                        />
                        <h1>RecipesApp</h1>
                    </div>
                </Link>
            </header>

            <div className="recipe-page"></div>
        </div>
    );
}

export default CreateRecipePage;
