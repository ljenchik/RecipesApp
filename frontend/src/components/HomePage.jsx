import { useState, useEffect } from "react";

// Components
import RecipeCard from "./RecipeCard";
import HomePageHeader from "./HomePageHeader";

// CSS
import "../css/HomePage.css";
import "../css/RecipeCard.css";

// Assets
import icon from "../assets/svgs/recipes-app-icon.svg";

function HomePage() {
    const [recipes, setRecipes] = useState([]);
    const [filteredRecipes, setFilteredRecipes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch all recipes on mount
    useEffect(() => {
        fetchRecipes();
    }, []);

    const fetchRecipes = async () => {
        try {
            setLoading(true);
            const res = await fetch("/recipes");

            if (!res.ok) {
                throw new Error("Failed to fetch recipes");
            }

            const data = await res.json();
            setRecipes(data);
            setFilteredRecipes(data); // Initialize filtered recipes
        } catch (err) {
            console.error("Error fetching recipes:", err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleRecipeAdded = (newRecipe) => {
        const updated = [...recipes, newRecipe];
        setRecipes(updated);
        setFilteredRecipes(updated);
    };

    const handleDelete = async (id) => {
        try {
            const response = await fetch(`/recipes/${id}`, {
                method: "DELETE",
            });

            if (!response.ok) {
                throw new Error(
                    `Failed to delete recipe (status: ${response.status})`
                );
            }

            // Update both recipes and filtered recipes
            setRecipes((prev) => prev.filter((r) => r.id !== id));
            setFilteredRecipes((prev) => prev.filter((r) => r.id !== id));

            console.log("Recipe deleted successfully");
        } catch (error) {
            console.error("Error deleting recipe:", error);
            alert("Failed to delete recipe. Please try again.");
        }
    };

    const handleSearch = (query) => {
        if (!query.trim()) {
            setFilteredRecipes(recipes);
            return;
        }

        const lowercaseQuery = query.toLowerCase();

        const filtered = recipes.filter((recipe) => {
            // Search in recipe name
            if (recipe.name?.toLowerCase().includes(lowercaseQuery)) {
                return true;
            }

            // Search in ingredients
            if (
                recipe.ingredients?.some((ingredient) =>
                    ingredient.toLowerCase().includes(lowercaseQuery)
                )
            ) {
                return true;
            }

            // Search in instructions
            if (recipe.instructions?.toLowerCase().includes(lowercaseQuery)) {
                return true;
            }

            return false;
        });

        setFilteredRecipes(filtered);
    };

    // Loading state
    if (loading) {
        return (
            <div className="loading-container">
                <p>Loading recipes...</p>
            </div>
        );
    }

    // Error state
    if (error) {
        return (
            <div className="error-container">
                <p>Error: {error}</p>
                <button onClick={fetchRecipes}>Retry</button>
            </div>
        );
    }

    return (
        <div className="home-page">
            <header>
                <div className="title-app">
                    <img
                        src={icon}
                        alt="Recipes App Icon"
                        className="app-icon"
                    />
                    <h1>RecipesApp</h1>
                </div>
                <HomePageHeader
                    onRecipeAdded={handleRecipeAdded}
                    onSearch={handleSearch}
                />
            </header>

            <main className="recipes-wrapper">
                {filteredRecipes.length === 0 ? (
                    <div className="no-recipes">
                        <p>No recipes found</p>
                        {recipes.length > 0 && (
                            <p className="hint">Try a different search term</p>
                        )}
                    </div>
                ) : (
                    <div className="recipes-container">
                        {filteredRecipes.map((recipe) => (
                            <RecipeCard
                                key={recipe.id}
                                recipe={recipe}
                                onDelete={handleDelete}
                            />
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
}

export default HomePage;
