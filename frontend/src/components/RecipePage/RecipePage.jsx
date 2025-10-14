import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";

import LogoAndName from "../Header/LogoAndName";
import Title from "./Title";
import ImageAndMeta from "./ImageAndMeta";

import "../../css/RecipePage.css";

import { formatInstructions } from "../../utils/helpers";
import { convertIngredient } from "../../utils/convertIngredient";

function RecipePage() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [recipe, setRecipe] = useState(null);

    const [editingIngredients, setEditingIngredients] = useState(false);
    const [editingInstructions, setEditingInstructions] = useState(false);
    const [editingNote, setEditingNote] = useState(false);

    const [ingredients, setIngredients] = useState("");
    const [instructions, setInstructions] = useState("");
    const [note, setNote] = useState("");
    const [checkedItems, setCheckedItems] = useState({});

    const [useMetric, setUseMetric] = useState(false);

    useEffect(() => {
        fetchRecipe();
    }, [id]);

    const fetchRecipe = async () => {
        try {
            const res = await fetch(`/recipes/${id}`);
            const data = await res.json();

            setRecipe(data);

            if (Array.isArray(data.ingredients)) {
                setIngredients(data.ingredients.join("\n"));
            } else {
                setIngredients("");
            }

            setInstructions(data.instructions || "");
            setNote(data.notes || "");

            const initialChecks = {};
            if (Array.isArray(data.ingredients)) {
                data.ingredients.forEach((ing) => {
                    initialChecks[ing] = false;
                });
            }
            setCheckedItems(initialChecks);
        } catch (error) {
            console.error("Error fetching recipe:", error);
        }
    };

    const updateField = async (field, value) => {
        try {
            const body = {};
            if (field === "ingredients") body[field] = value.split("\n");
            else body[field] = value;

            const res = await fetch(`/recipes/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body),
            });

            if (res.ok) {
                const updated = await res.json();
                setRecipe(updated);

                if (field === "title") setTitle(updated.title);
                if (field === "ingredients")
                    setIngredients(updated.ingredients.join("\n"));
                if (field === "instructions")
                    setInstructions(updated.instructions);
                if (field === "ingredients") {
                    const initialChecks = {};
                    updated.ingredients.forEach((ing) => {
                        initialChecks[ing] = false;
                    });
                    setCheckedItems(initialChecks);
                }
            } else {
                alert("Failed to update " + field);
            }
        } catch (err) {
            console.error(err);
            alert("Error updating " + field);
        }
    };

    const saveNote = async () => {
        try {
            const res = await fetch(`/recipes/${id}/notes`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ notes: note }),
            });
            if (res.ok) {
                const updated = await res.json();
                setNote(updated.notes);
                setEditingNote(false);
            }
        } catch (err) {
            console.error(err);
            alert("Error saving note");
        }
    };

    const handleCheck = (ing) => {
        setCheckedItems((prev) => ({ ...prev, [ing]: !prev[ing] }));
    };

    const cancelEdit = (field) => {
        switch (field) {
            case "title":
                setTitle(recipe.title);
                setEditingTitle(false);
                break;
            case "ingredients":
                setIngredients(recipe.ingredients.join("\n"));
                setEditingIngredients(false);
                break;
            case "instructions":
                setInstructions(recipe.instructions);
                setEditingInstructions(false);
                break;
            case "note":
                setNote(recipe.notes || "");
                setEditingNote(false);
                break;
        }
    };

    if (!recipe) return <p>Loading...</p>;

    return (
        <div>
            <LogoAndName />
            <div className="recipe-page">
                {/* Title */}
                <Title recipe={recipe} onUpdate={updateField} />
                {/* Image + Ingredients row */}
                <div className="image-ingredients-row">
                    <ImageAndMeta recipe={recipe} onUpdate={updateField} />
                    {/* Right side: Ingredients */}
                    <div className="ingredients-section">
                        <div className="section-header">
                            <div className="header-left">
                                <h3>Ingredients</h3>
                                <button
                                    className="edit-button"
                                    onClick={() => setEditingIngredients(true)}
                                >
                                    <span className="icon">✏️</span>
                                    <span className="label">
                                        Edit ingredients
                                    </span>
                                </button>
                            </div>
                            <div>
                                <button
                                    className={`conversion-toggle ${
                                        useMetric ? "selected" : "unselected"
                                    }`}
                                    onClick={() => setUseMetric(true)}
                                    title="Switch to Metric"
                                >
                                    Metric
                                </button>

                                <button
                                    className={`conversion-toggle ${
                                        !useMetric ? "selected" : "unselected"
                                    }`}
                                    onClick={() => setUseMetric(false)}
                                    title="Switch to UK/Imperial"
                                >
                                    UK
                                </button>
                            </div>
                        </div>

                        {editingIngredients ? (
                            <div className="edit-mode">
                                <textarea
                                    className="edit-textarea"
                                    value={ingredients}
                                    onChange={(e) =>
                                        setIngredients(e.target.value)
                                    }
                                    placeholder="Enter ingredients, one per line..."
                                />
                                <div className="edit-buttons">
                                    <button
                                        className="tick-cross-buttons"
                                        onClick={() => {
                                            updateField(
                                                "ingredients",
                                                ingredients
                                            );
                                            setEditingIngredients(false);
                                        }}
                                    >
                                        ✅
                                    </button>
                                    <button
                                        className="tick-cross-buttons"
                                        onClick={() => {
                                            setIngredients(
                                                recipe.ingredients.join("\n")
                                            );
                                            setEditingIngredients(false);
                                        }}
                                    >
                                        ❌
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <ul className="ingredients-list">
                                {ingredients.split("\n").map(
                                    (ing, idx) =>
                                        ing.trim() && (
                                            <li key={idx}>
                                                <label>
                                                    <input
                                                        type="checkbox"
                                                        checked={
                                                            checkedItems[ing] ||
                                                            false
                                                        }
                                                        onChange={() =>
                                                            handleCheck(ing)
                                                        }
                                                    />
                                                    <span
                                                        className={
                                                            checkedItems[ing]
                                                                ? "checked"
                                                                : ""
                                                        }
                                                    >
                                                        {convertIngredient(
                                                            ing,
                                                            useMetric
                                                        )}
                                                    </span>
                                                </label>
                                            </li>
                                        )
                                )}
                            </ul>
                        )}
                    </div>
                </div>
                {/* Instructions Section */}
                <section className="instructions-section">
                    <div className="section-header">
                        <div className="header-left">
                            <h3>Instructions</h3>
                            <button
                                className="edit-button"
                                onClick={() => setEditingInstructions(true)}
                            >
                                <span className="icon">✏️</span>
                                <span className="label">Edit instructions</span>
                            </button>
                        </div>
                    </div>

                    {editingInstructions ? (
                        <div className="edit-mode">
                            <textarea
                                className="edit-textarea instructions-textarea"
                                value={instructions}
                                onChange={(e) =>
                                    setInstructions(e.target.value)
                                }
                                placeholder="Enter instructions..."
                                autoFocus
                            />
                            <div className="edit-buttons">
                                <button
                                    className="tick-cross-buttons save-btn"
                                    onClick={() => {
                                        updateField(
                                            "instructions",
                                            instructions
                                        );
                                        setEditingInstructions(false);
                                    }}
                                >
                                    ✅
                                </button>
                                <button
                                    className="tick-cross-buttons cancel-btn"
                                    onClick={() => cancelEdit("instructions")}
                                >
                                    ❌
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="instructions-content">
                            {(() => {
                                const steps = formatInstructions(instructions);

                                // Single instruction - display as paragraph without numbering
                                if (steps.length === 1) {
                                    return (
                                        <p className="single-instruction">
                                            {steps[0]}
                                        </p>
                                    );
                                }

                                // Multiple instructions - display with numbering
                                return steps.map(
                                    (step, idx) =>
                                        step.trim() && (
                                            <div
                                                key={idx}
                                                className="instruction-step"
                                            >
                                                <span className="step-number">
                                                    {idx + 1}.
                                                </span>
                                                <div className="step-text">
                                                    {step}
                                                </div>
                                            </div>
                                        )
                                );
                            })()}
                        </div>
                    )}
                </section>
                {/* Notes */}
                <section className="notes-section">
                    <div className="section-header">
                        <div className="header-left">
                            <h3>Notes</h3>
                            {note && !editingNote && (
                                <button
                                    className="edit-button"
                                    onClick={() => setEditingNote(true)}
                                >
                                    <span className="icon">✏️</span>
                                    <span className="label">Edit notes</span>
                                </button>
                            )}
                        </div>
                    </div>

                    {!note && !editingNote && (
                        <button
                            className="add-note-button"
                            onClick={() => setEditingNote(true)}
                        >
                            Add note
                        </button>
                    )}

                    {note && !editingNote && (
                        <div className="notes-content">
                            <p>{note}</p>
                        </div>
                    )}

                    {editingNote && (
                        <div className="edit-mode">
                            <textarea
                                className="edit-textarea notes-textarea"
                                value={note}
                                onChange={(e) => setNote(e.target.value)}
                                placeholder="Add your personal notes here..."
                            />
                            <div className="edit-buttons">
                                <button
                                    className="tick-cross-buttons save-btn"
                                    onClick={saveNote}
                                >
                                    ✅
                                </button>
                                <button
                                    className="tick-cross-buttons cancel-btn"
                                    onClick={() => {
                                        setNote(recipe.notes || "");
                                        setEditingNote(false);
                                    }}
                                >
                                    ❌
                                </button>
                            </div>
                        </div>
                    )}
                </section>
            </div>
        </div>
    );
}

export default RecipePage;
