import { useState, useEffect } from "react";

// Components
import HomePageHeader from "./HomePageHeader";
import RecipeCard from "./RecipeCard";
import CreateRecipeCard from "./CreateRecipeCard";

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
        const queryWords = lowercaseQuery
            .split(/\s+/)
            .filter((word) => word.length > 0);

        const scoredRecipes = recipes.map((recipe) => {
            const recipeName = (
                recipe.name ||
                recipe.title ||
                ""
            ).toLowerCase();
            const recipeIngredients = (recipe.ingredients || []).map((ing) =>
                ing.toLowerCase()
            );

            let score = 0;

            queryWords.forEach((word) => {
                if (recipeName === word) {
                    score += 100;
                } else if (recipeName.startsWith(word)) {
                    score += 50;
                } else if (recipeName.includes(word)) {
                    score += 25;
                }

                recipeIngredients.forEach((ingredient) => {
                    if (ingredient.startsWith(word)) {
                        score += 10;
                    } else if (ingredient.includes(word)) {
                        score += 5;
                    }
                });
            });

            return { recipe, score };
        });

        const filtered = scoredRecipes
            .filter((item) => item.score > 0)
            .sort((a, b) => b.score - a.score)
            .map((item) => item.recipe);

        setFilteredRecipes(filtered);
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
            <div className="home-page-header">
                <div className="home-page-header-title">
                    <img
                        src={icon}
                        alt="Recipes App Icon"
                        className="home-page-header-icon"
                    />
                    <h1>RecipesApp</h1>
                </div>

                <HomePageHeader
                    onRecipeAdded={handleRecipeAdded}
                    onSearch={handleSearch}
                />
            </div>

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
