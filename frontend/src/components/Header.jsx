import "../css/HomePage.css";

// Assets
import icon from "../assets/svgs/recipes-app-icon.svg";

function Header() {
    return (
        <div className="home-page-header-title">
            <img
                src={icon}
                alt="Recipes App Icon"
                className="home-page-header-icon"
            />
            <h1>RecipesApp</h1>
        </div>
    );
}

export default Header;
