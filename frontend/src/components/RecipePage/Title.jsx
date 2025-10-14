import { useState, useEffect } from "react";
import "../../css/RecipePage.css";

function Title({ recipe, onUpdate }) {
    const [editing, setEditing] = useState(false);
    const [title, setTitle] = useState(recipe.title);

    useEffect(() => {
        setTitle(recipe.title);
    }, [recipe.title]);

    const handleSave = () => {
        onUpdate("title", title);
        setEditing(false);
    };

    const handleCancel = () => {
        setTitle(recipe.title);
        setEditing(false);
    };

    return (
        <h1 className="recipe-title">
            {editing ? (
                <>
                    <input
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        autoFocus
                    />
                    <button className="tick-cross-buttons" onClick={handleSave}>
                        ✅
                    </button>
                    <button
                        className="tick-cross-buttons"
                        onClick={handleCancel}
                    >
                        ❌
                    </button>
                </>
            ) : (
                <>
                    {title}
                    <button
                        className="edit-button"
                        onClick={() => setEditing(true)}
                    >
                        <span className="icon">✏️</span>
                        <span className="label">Edit title</span>
                    </button>
                </>
            )}
        </h1>
    );
}

export default Title;
