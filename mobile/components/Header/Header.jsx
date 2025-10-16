import { Link } from "expo-router";

import AddRecipeByUrl from "./AddRecipeByUrl";
import SearchBar from "./SearchBar";

import icon from "../../assets/images/logo.png";

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
