import AddRecipeByUrl from "./AddRecipeByUrl";
import SearchBar from "./SearchBar";

import "../css/HomePageHeader.css";

function AddRecipeAndSearchBar({ onRecipeAdded, onSearch }) {
    return (
        <div className="header-controls">
            <AddRecipeByUrl onRecipeAdded={onRecipeAdded} />
            <SearchBar onSearch={onSearch} />
        </div>
    );
}

export default AddRecipeAndSearchBar;
