import { useState } from "react";
import "../css/RecipeCard.css";

function RecipeCard({ recipe }) {
    const [showDetails, setShowDetails] = useState(false);
    const [note, setNote] = useState(recipe.notes || "");
    const [editing, setEditing] = useState(false);

    const handleSaveNote = async () => {
        try {
            const response = await fetch(`/recipes/${recipe.id}/notes`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ notes: note }),
            });

            if (response.ok) {
                setEditing(false);
            } else {
                console.error("Failed to save note");
            }
        } catch (error) {
            console.error("Error saving note:", error);
        }
    };

    return (
        <div className="recipe-card" onClick={() => setShowDetails(true)}>
            {recipe.image_url && (
                <img
                    src={recipe.image_url}
                    alt={recipe.title}
                    className="recipe-thumb"
                />
            )}
            <h3 className="recipe-title">{recipe.title}</h3>

            {showDetails && (
                <div
                    className="modal-overlay"
                    onClick={() => setShowDetails(false)}
                >
                    <div
                        className="recipe-modal"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button
                            className="close-btn"
                            onClick={() => setShowDetails(false)}
                        >
                            ✖
                        </button>
                        <h2>{recipe.title}</h2>

                        <div className="recipe-section">
                            <h4>Notes</h4>
                            {/* --- Conditional rendering based on note state --- */}
                            {!note && !editing && (
                                <button
                                    className="add-note-btn"
                                    onClick={() => setEditing(true)}
                                >
                                    ➕ Add Note
                                </button>
                            )}

                            {note && !editing && (
                                <div className="note-display">
                                    <p>{note}</p>
                                    <button
                                        className="edit-note-btn"
                                        onClick={() => setEditing(true)}
                                    >
                                        ✏️ Edit Note
                                    </button>
                                </div>
                            )}

                            {editing && (
                                <div className="note-edit">
                                    <textarea
                                        value={note}
                                        onChange={(e) =>
                                            setNote(e.target.value)
                                        }
                                        placeholder="Write your note..."
                                    />
                                    <div className="note-buttons">
                                        <button onClick={handleSaveNote}>
                                            💾 Save
                                        </button>
                                        <button
                                            onClick={() => {
                                                setEditing(false);
                                                setNote(recipe.notes || "");
                                            }}
                                        >
                                            ❌ Cancel
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>

                        {recipe.source && (
                            <div className="source-link">
                                <a
                                    href={recipe.source}
                                    target="_blank"
                                    rel="noreferrer"
                                >
                                    View Source
                                </a>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

export default RecipeCard;
