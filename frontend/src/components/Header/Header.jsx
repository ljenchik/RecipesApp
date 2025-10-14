import { Link } from "react-router-dom";

import AddRecipeByUrl from "./AddRecipeByUrl";
import SearchBar from "./SearchBar";

import "../../css/Header.css";
import icon from "../../assets/svgs/recipes-app-icon.svg";

function Header({ onRecipeAdded, onSearch }) {
    return (
        <div className="header">
            <Link to="/" className="logo-link">
                <img src={icon} alt="Recipes App Icon" className="logo-icon" />
                <h1>RecipesApp</h1>
            </Link>

            <div className="header-controls">
                <AddRecipeByUrl onRecipeAdded={onRecipeAdded} />
                <SearchBar onSearch={onSearch} />
            </div>
        </div>
    );
}

export default Header;
