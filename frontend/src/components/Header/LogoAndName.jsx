import { Link } from "react-router-dom";
import "../../css/HomePage.css";
import icon from "../../assets/svgs/recipes-app-icon.svg";

function LogoAndName() {
    return (
        <div className="header">
            <Link to="/" className="logo-link">
                <img src={icon} alt="Recipes App Icon" className="logo-icon" />
                <h1>RecipesApp</h1>
            </Link>
        </div>
    );
}

export default LogoAndName;
