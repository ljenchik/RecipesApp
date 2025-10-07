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
                    <RecipeCard key={r.id} recipe={r} />
                ))}
            </div>
        </div>
    );
}

export default HomePage;
