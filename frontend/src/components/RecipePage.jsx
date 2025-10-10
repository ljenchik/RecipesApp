import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";

import "../css/RecipePage.css";
import { parseTime, parseServings, formatInstructions } from "../utils/helpers";
import { convertIngredient } from "../utils/convertIngredient";
import icon from "../assets/svgs/recipes-app-icon.svg";

function RecipePage() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [recipe, setRecipe] = useState(null);

    const [editingTitle, setEditingTitle] = useState(false);
    const [editingIngredients, setEditingIngredients] = useState(false);
    const [editingInstructions, setEditingInstructions] = useState(false);
    const [editingNote, setEditingNote] = useState(false);

    const [title, setTitle] = useState("");
    const [ingredients, setIngredients] = useState("");
    const [instructions, setInstructions] = useState("");
    const [note, setNote] = useState("");
    const [checkedItems, setCheckedItems] = useState({});

    const [useMetric, setUseMetric] = useState(false);

    useEffect(() => {
        fetch(`/recipes/${id}`)
            .then((res) => res.json())
            .then((data) => {
                setRecipe(data);
                setTitle(data.title);
                setIngredients(data.ingredients.join("\n"));
                setInstructions(data.instructions);
                setNote(data.notes || "");

                // initialize checkbox states
                const initialChecks = {};
                data.ingredients.forEach((ing) => {
                    initialChecks[ing] = false;
                });
                setCheckedItems(initialChecks);
            });
    }, [id]);

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

    if (!recipe) return <p>Loading...</p>;

    return (
        <div>
            <header>
                <Link to="/" className="title-app-link">
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
                </Link>
            </header>
            <div className="recipe-page">
                {/* Title */}
                <h1 className="recipe-title">
                    {editingTitle ? (
                        <>
                            <input
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                            />
                            <button
                                className="tick-cross-buttons"
                                onClick={() => {
                                    updateField("title", title);
                                    setEditingTitle(false);
                                }}
                            >
                                ✅
                            </button>
                            <button
                                className="tick-cross-buttons"
                                onClick={() => {
                                    setTitle(recipe.title);
                                    setEditingTitle(false);
                                }}
                            >
                                ❌
                            </button>
                        </>
                    ) : (
                        <>
                            {title}
                            <button
                                className="edit-button"
                                onClick={() => setEditingTitle(true)}
                            >
                                <span className="icon">✏️</span>
                                <span className="label">Edit</span>
                            </button>
                        </>
                    )}
                </h1>

                {/* Image + Ingredients row */}
                <div className="image-ingredients-row">
                    <div>
                        {/* Left side: Image */}
                        {recipe.image_url && (
                            <div className="image-container">
                                <img
                                    src={recipe.image_url}
                                    alt={recipe.title}
                                    className="recipe-image"
                                />
                            </div>
                        )}
                        <div className="recipe-meta">
                            {recipe.prep_time && (
                                <span>
                                    ⏱️ Prep: {parseTime(recipe.prep_time)}
                                </span>
                            )}
                            {recipe.servings && (
                                <span>🍽️ {parseServings(recipe.servings)}</span>
                            )}
                        </div>
                    </div>

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
                                    <span className="label">Edit</span>
                                </button>
                            </div>
                            <div className="conversion-toggle-container">
                                <button
                                    className={`conversion-toggle ${
                                        useMetric ? "active" : ""
                                    }`}
                                    onClick={() => setUseMetric(true)}
                                    title="Switch to Metric"
                                >
                                    Metric
                                </button>

                                <button
                                    className={`conversion-toggle ${
                                        !useMetric ? "active" : ""
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

                {/* Instructions */}
                <section className="instructions-section">
                    <div className="section-header">
                        <h3>Instructions</h3>
                        <button
                            className="edit-button"
                            onClick={() => setEditingInstructions(true)}
                        >
                            <span className="icon">✏️</span>
                            <span className="label">Edit</span>
                        </button>
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
                                    onClick={() => {
                                        setInstructions(recipe.instructions);
                                        setEditingInstructions(false);
                                    }}
                                >
                                    ❌
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="instructions-content">
                            {formatInstructions(instructions).map(
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
                            )}
                        </div>
                    )}
                </section>

                {/* Notes */}
                <section className="notes-section">
                    <div className="section-header">
                        <h3>Notes</h3>
                        {note && !editingNote && (
                            <button
                                className="edit-button"
                                onClick={() => setEditingNote(true)}
                            >
                                <span className="icon">✏️</span>
                                <span className="label">Edit</span>
                            </button>
                        )}
                    </div>

                    {!note && !editingNote && (
                        <button
                            className="add-note-button"
                            onClick={() => setEditingNote(true)}
                        >
                            Add Note
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
