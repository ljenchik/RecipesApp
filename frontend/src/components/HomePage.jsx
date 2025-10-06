import { useState, useEffect } from "react";
import RecipeCard from "./RecipeCard";
import "../css/RecipeCard.css";
import AddRecipeByUrl from "./AddRecipeByUrl";

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
                <h1>RecipesApp</h1>
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
