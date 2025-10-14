import { useState, useEffect } from "react";

// Components
import Header from "../Header/Header";
import RecipeCard from "./RecipeCard";
import CreateRecipeCard from "./CreateRecipeCard";

// CSS
import "../../css/HomePage.css";
import "../../css/Header.css";
import "../../css/RecipeCard.css";

function HomePage() {
    const [recipes, setRecipes] = useState([]);
    const [filteredRecipes, setFilteredRecipes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

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
            setFilteredRecipes(data);
        } catch (err) {
            console.error("Error fetching recipes:", err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
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

            setRecipes((prev) => prev.filter((r) => r.id !== id));
            setFilteredRecipes((prev) => prev.filter((r) => r.id !== id));

            console.log("Recipe deleted successfully");
        } catch (error) {
            console.error("Error deleting recipe:", error);
            alert("Failed to delete recipe. Please try again.");
        }
    };

    if (loading) {
        return (
            <div className="loading-container">
                <p>Loading recipes...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="error-container">
                <p>Error: {error}</p>
                <button onClick={fetchRecipes}>Retry</button>
            </div>
        );
    }

    return (
        <div className="home-page-container">
            <Header />

            <main className="recipes-wrapper">
                {recipes.length !== filteredRecipes.length && (
                    <div className="search-results-info">
                        Found {filteredRecipes.length} recipe
                        {filteredRecipes.length !== 1 ? "s" : ""}
                    </div>
                )}

                {filteredRecipes.length === 0 ? (
                    <div className="no-recipes">
                        <p>No recipes found</p>
                        {recipes.length > 0 && (
                            <p className="hint">Try a different search term</p>
                        )}
                    </div>
                ) : (
                    <div className="recipes-container">
                        <CreateRecipeCard />

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
