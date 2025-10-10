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
            console.log("Recipe deleted successfully");
        } catch (error) {
            console.error("Error deleting recipe:", error);
            alert("Failed to delete recipe. Please try again.");
        }
    };

    const handleRecipeAdded = (newRecipe) => {
        const updated = [...recipes, newRecipe];
        setRecipes(updated);
        setFilteredRecipes(updated);
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
                recipe.ingredients?.some((ing) =>
                    ing.toLowerCase().includes(lowercaseQuery)
                )
            ) {
                return true;
            }

            return false;
        });

        setFilteredRecipes(filtered);
    };

    const fetchRecipes = async () => {
        try {
            const res = await fetch("/recipes");
            if (!res.ok) throw new Error("Failed to fetch recipes");
            const data = await res.json();
            setRecipes(data);
        } catch (err) {
            console.error("Error fetching recipes:", err);
        }
    };
    useEffect(() => {
        fetchRecipes();
    }, []);

    return (
        <div>
            <header>
                <div className="title-app">
                    <img
                        src={icon}
                        alt="Recipes App Icon"
                        style={{
                            width: "40px",
                            height: "40px",
                        }}
                    />
                    <h1>RecipesApp</h1>
                </div>
                <HomePageHeader
                    onRecipeAdded={handleRecipeAdded}
                    onSearch={handleSearch}
                />
            </header>

            <div className="recipes-wrapper">
                <div className="recipes-container">
                    {recipes.map((r) => (
                        <RecipeCard
                            key={r.id}
                            recipe={r}
                            onDelete={handleDelete}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}

export default HomePage;
