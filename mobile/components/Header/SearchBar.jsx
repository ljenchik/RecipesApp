import { useState } from "react";
import "../../css/Header.css";

function SearchBar({ onSearch }) {
    const [searchQuery, setSearchQuery] = useState("");

    const handleSearchChange = (e) => {
        const query = e.target.value;
        setSearchQuery(query);
        if (onSearch) onSearch(query);
    };

    const handleClear = () => {
        setSearchQuery("");
        if (onSearch) onSearch("");
    };

    return (
        <div className="search-bar">
            <input
                type="text"
                placeholder="Search recipes by name or ingredients..."
                value={searchQuery}
                onChange={handleSearchChange}
            />
            {searchQuery && (
                <button
                    type="button"
                    className="clear-button"
                    onClick={handleClear}
                    aria-label="Clear search"
                >
                    ✕
                </button>
            )}
            <button type="button" className="search-button" aria-label="Search">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path
                        d="M9 17A8 8 0 1 0 9 1a8 8 0 0 0 0 16zM19 19l-4.35-4.35"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                </svg>
            </button>
        </div>
    );
}

export default SearchBar;
