import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

import LogoAndName from "../Header/LogoAndName";
import Title from "./Title";
import ImageAndMeta from "./ImageAndMeta";
import Ingredients from "./Ingredients";
import Instructions from "./Instructions";
import Notes from "./Notes";

import "../../css/RecipePage.css";

function RecipePage() {
    const { id } = useParams();
    const [recipe, setRecipe] = useState(null);

    useEffect(() => {
        fetchRecipe();
    }, [id]);

    const fetchRecipe = async () => {
        try {
            const res = await fetch(`/recipes/${id}`);
            const data = await res.json();
            setRecipe(data);
        } catch (error) {
            console.error("Error fetching recipe:", error);
        }
    };

    const updateField = async (field, value) => {
        try {
            const body = {};
            if (field === "ingredients") {
                body[field] = value.split("\n").filter((line) => line.trim());
            } else {
                body[field] = value;
            }

            const res = await fetch(`/recipes/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body),
            });

            if (res.ok) {
                const updated = await res.json();
                setRecipe(updated);
            } else {
                alert(`Failed to update ${field}`);
            }
        } catch (err) {
            console.error(err);
            alert(`Error updating ${field}`);
        }
    };

    const saveNote = async (note) => {
        try {
            const res = await fetch(`/recipes/${id}/notes`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ notes: note }),
            });

            if (res.ok) {
                const updated = await res.json();
                setRecipe(updated);
            }
        } catch (err) {
            console.error(err);
            alert("Error saving note");
        }
    };

    if (!recipe) {
        return (
            <div>
                <LogoAndName />
                <div className="recipe-page">
                    <p>Loading recipe...</p>
                </div>
            </div>
        );
    }

    return (
        <div>
            <LogoAndName />

            <div className="recipe-page">
                <Title recipe={recipe} onUpdate={updateField} />
                <div className="image-ingredients-row">
                    <ImageAndMeta recipe={recipe} onUpdate={updateField} />
                    <Ingredients recipe={recipe} onUpdate={updateField} />
                </div>
                <Instructions recipe={recipe} onUpdate={updateField} />
                <Notes recipe={recipe} onSave={saveNote} />
            </div>
        </div>
    );
}

export default RecipePage;
