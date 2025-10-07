import { useState, useEffect } from "react";

// Components
import RecipeCard from "./RecipeCard";
import AddRecipeByUrl from "./AddRecipeByUrl";

// CSS
import "../css/HomePage.css";
import "../css/RecipeCard.css";
import "../css/AddRecipeByUrl.css";

// Assets
import icon from "../assets/recipes-app-icon.svg";

function HomePage() {
    const [recipes, setRecipes] = useState([]);

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
                <AddRecipeByUrl onRecipeAdded={fetchRecipes} />
            </header>

            <div className="recipes-container">
                {recipes.map((r) => (
                    <RecipeCard key={r.id} recipe={r} onDelete={handleDelete} />
                ))}
            </div>
        </div>
    );
}

export default HomePage;
