import { useState, useEffect } from "react";
import { formatInstructions } from "../../utils/helpers";
import "../../css/RecipePage.css";

function Instructions({ recipe, onUpdate }) {
    const [editing, setEditing] = useState(false);
    const [instructions, setInstructions] = useState("");

    // Sync with recipe prop
    useEffect(() => {
        if (recipe) {
            setInstructions(recipe.instructions || "");
        }
    }, [recipe]);

    const handleSave = () => {
        onUpdate("instructions", instructions);
        setEditing(false);
    };

    const handleCancel = () => {
        setInstructions(recipe.instructions || "");
        setEditing(false);
    };

    const renderInstructions = () => {
        const steps = formatInstructions(instructions);

        // Single instruction - display as paragraph without numbering
        if (steps.length === 1) {
            return <p className="single-instruction">{steps[0]}</p>;
        }

        // Multiple instructions - display with numbering
        return steps.map(
            (step, idx) =>
                step.trim() && (
                    <div key={idx} className="instruction-step">
                        <span className="step-number">{idx + 1}.</span>
                        <div className="step-text">{step}</div>
                    </div>
                )
        );
    };

    return (
        <section className="instructions-section">
            <div className="section-header">
                <div className="header-left">
                    <h3>Instructions</h3>
                    <button
                        className="edit-button"
                        onClick={() => setEditing(true)}
                    >
                        <span className="icon">✏️</span>
                        <span className="label">Edit instructions</span>
                    </button>
                </div>
            </div>

            {editing ? (
                <div className="edit-mode">
                    <textarea
                        className="edit-textarea instructions-textarea"
                        value={instructions}
                        onChange={(e) => setInstructions(e.target.value)}
                        placeholder="Enter instructions..."
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
            ) : (
                <div className="instructions-content">
                    {renderInstructions()}
                </div>
            )}
        </section>
    );
}

export default Instructions;
