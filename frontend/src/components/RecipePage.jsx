import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "../css/RecipePage.css";
import { parseTime, parseServings } from "../utils/helpers";
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
            </header>
            <div className="recipe-page">
                {/* <button
                    className="back-button"
                    onClick={() => navigate(-1)}
                    style={{
                        marginBottom: "1rem",
                        padding: "0.5rem 1rem",
                        cursor: "pointer",
                    }}
                >
                    ⬅ Back
                </button> */}

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
                            {title}{" "}
                            <button
                                className="edit-button"
                                onClick={() => setEditingTitle(true)}
                            >
                                <span className="icon">✏️</span>
                                <span className="label">Edit title</span>
                            </button>
                        </>
                    )}
                </h1>

                <div className="recipe-meta">
                    {recipe.prep_time && (
                        <span>⏱️ Prep: {parseTime(recipe.prep_time)}</span>
                    )}
                    {recipe.servings && (
                        <span>🍽️ {parseServings(recipe.servings)}</span>
                    )}
                </div>

                {/* Image +Ingredients row */}
                <div className="image-instructions-ingredients-row">
                    {/* Left side: Image  */}
                    <div className="image-instructions">
                        {recipe.image_url && (
                            <img
                                src={recipe.image_url}
                                alt={recipe.title}
                                className="recipe-image"
                            />
                        )}
                    </div>

                    {/* Right side: Ingredients */}
                    <div className="ingredients-section">
                        <div className="section-header">
                            <h3>Ingredients</h3>
                            <button
                                className="edit-button"
                                onClick={() => setEditingIngredients(true)}
                            >
                                <span className="icon">✏️</span>
                                <span className="label">Edit ingredients</span>
                            </button>
                        </div>

                        {editingIngredients ? (
                            <>
                                <textarea
                                    value={ingredients}
                                    onChange={(e) =>
                                        setIngredients(e.target.value)
                                    }
                                />
                                <button
                                    className="tick-cross-buttons"
                                    onClick={() => {
                                        updateField("ingredients", ingredients);
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
                            </>
                        ) : (
                            <ul className="ingredients-list scrollable">
                                {ingredients.split("\n").map((ing, idx) => (
                                    <li key={idx}>
                                        <label>
                                            <input
                                                type="checkbox"
                                                checked={
                                                    checkedItems[ing] || false
                                                }
                                                onChange={() =>
                                                    handleCheck(ing)
                                                }
                                            />
                                            {ing}
                                        </label>
                                    </li>
                                ))}
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
                            <span className="label">Edit instructions</span>
                        </button>
                    </div>
                    {editingInstructions ? (
                        <>
                            <textarea
                                value={instructions}
                                onChange={(e) =>
                                    setInstructions(e.target.value)
                                }
                            />
                            <button
                                className="tick-cross-buttons"
                                onClick={() => {
                                    updateField("instructions", instructions);
                                    setEditingInstructions(false);
                                }}
                            >
                                ✅
                            </button>
                            <button
                                className="tick-cross-buttons"
                                onClick={() => {
                                    setInstructions(recipe.instructions);
                                    setEditingInstructions(false);
                                }}
                            >
                                ❌
                            </button>
                        </>
                    ) : (
                        <p>{instructions}</p>
                    )}
                </section>

                {/* Notes */}
                <section className="notes-section">
                    <div className="section-header">
                        <h3>Notes</h3>
                        <button
                            className="edit-button"
                            onClick={() => setEditingNote(true)}
                        >
                            <span className="icon">✏️</span>
                            <span className="label">Edit notes</span>
                        </button>
                    </div>
                    {!note && !editingNote && (
                        <button
                            className="tick-cross-buttons"
                            onClick={() => setEditingNote(true)}
                        >
                            ➕ Add Note
                        </button>
                    )}
                    {note && !editingNote && <p>{note}</p>}
                    {editingNote && (
                        <div>
                            <textarea
                                value={note}
                                onChange={(e) => setNote(e.target.value)}
                            />
                            <button onClick={saveNote}>💾 Save</button>
                            <button
                                className="tick-cross-buttons"
                                onClick={() => {
                                    setNote(recipe.notes || "");
                                    setEditingNote(false);
                                }}
                            >
                                ❌
                            </button>
                        </div>
                    )}
                </section>

                {recipe.source && (
                    <p className="source-link">
                        <a
                            href={recipe.source}
                            target="_blank"
                            rel="noreferrer"
                        >
                            Original Recipe
                        </a>
                    </p>
                )}
            </div>
        </div>
    );
}

export default RecipePage;
