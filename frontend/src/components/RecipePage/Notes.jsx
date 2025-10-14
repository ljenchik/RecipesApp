import { useState, useEffect } from "react";
import "../../css/RecipePage.css";

function Notes({ recipe, onSave }) {
    const [editing, setEditing] = useState(false);
    const [note, setNote] = useState("");

    // Sync with recipe prop
    useEffect(() => {
        if (recipe) {
            setNote(recipe.notes || "");
        }
    }, [recipe]);

    const handleSave = async () => {
        await onSave(note);
        setEditing(false);
    };

    const handleCancel = () => {
        setNote(recipe.notes || "");
        setEditing(false);
    };

    return (
        <section className="notes-section">
            <div className="section-header">
                <div className="header-left">
                    <h3>Notes</h3>
                    {note && !editing && (
                        <button
                            className="edit-button"
                            onClick={() => setEditing(true)}
                        >
                            <span className="icon">✏️</span>
                            <span className="label">Edit notes</span>
                        </button>
                    )}
                </div>
            </div>

            {!note && !editing && (
                <button
                    className="add-note-button"
                    onClick={() => setEditing(true)}
                >
                    Add note
                </button>
            )}

            {note && !editing && (
                <div className="notes-content">
                    <p>{note}</p>
                </div>
            )}

            {editing && (
                <div className="edit-mode">
                    <textarea
                        className="edit-textarea notes-textarea"
                        value={note}
                        onChange={(e) => setNote(e.target.value)}
                        placeholder="Add your personal notes here..."
                        autoFocus
                    />
                    <div className="edit-buttons">
                        <button
                            className="tick-cross-buttons save-btn"
                            onClick={handleSave}
                        >
                            ✅
                        </button>
                        <button
                            className="tick-cross-buttons cancel-btn"
                            onClick={handleCancel}
                        >
                            ❌
                        </button>
                    </div>
                </div>
            )}
        </section>
    );
}

export default Notes;
