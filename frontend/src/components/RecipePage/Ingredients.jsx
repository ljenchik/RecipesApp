import { useState, useEffect } from "react";
import { convertIngredient } from "../../utils/convertIngredient";
import "../../css/RecipePage.css";

function Ingredients({ recipe, onUpdate }) {
    const [editing, setEditing] = useState(false);
    const [ingredients, setIngredients] = useState("");
    const [checkedItems, setCheckedItems] = useState({});
    const [useMetric, setUseMetric] = useState(false);

    // Initialize ingredients from recipe
    useEffect(() => {
        if (recipe && Array.isArray(recipe.ingredients)) {
            setIngredients(recipe.ingredients.join("\n"));

            // Initialize checkbox states
            const initialChecks = {};
            recipe.ingredients.forEach((ing) => {
                initialChecks[ing] = false;
            });
            setCheckedItems(initialChecks);
        }
    }, [recipe]);

    const handleSave = () => {
        onUpdate("ingredients", ingredients);
        setEditing(false);
    };

    const handleCancel = () => {
        setIngredients(recipe.ingredients.join("\n"));
        setEditing(false);
    };

    const handleCheck = (ing) => {
        setCheckedItems((prev) => ({ ...prev, [ing]: !prev[ing] }));
    };

    return (
        <div className="ingredients-section">
            <div className="section-header">
                <div className="header-left">
                    <h3>Ingredients</h3>
                    <button
                        className="edit-button"
                        onClick={() => setEditing(true)}
                    >
                        <span className="icon">✏️</span>
                        <span className="label">Edit ingredients</span>
                    </button>
                </div>

                {/* Conversion Toggle */}
                <div className="conversion-buttons">
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

            {editing ? (
                <div className="edit-mode">
                    <textarea
                        className="edit-textarea"
                        value={ingredients}
                        onChange={(e) => setIngredients(e.target.value)}
                        placeholder="Enter ingredients, one per line..."
                        autoFocus
                    />
                    <div className="edit-buttons">
                        <button
                            className="tick-cross-buttons"
                            onClick={handleSave}
                        >
                            ✅
                        </button>
                        <button
                            className="tick-cross-buttons"
                            onClick={handleCancel}
                        >
                            ❌
                        </button>
                    </div>
                </div>
            ) : (
                <ul className="ingredients-list">
                    {ingredients.split("\n").map((ing, idx) =>
                        ing.trim() ? (
                            <li key={idx}>
                                <label>
                                    <input
                                        type="checkbox"
                                        checked={checkedItems[ing] || false}
                                        onChange={() => handleCheck(ing)}
                                    />
                                    <span
                                        className={
                                            checkedItems[ing] ? "checked" : ""
                                        }
                                    >
                                        {convertIngredient(ing, useMetric)}
                                    </span>
                                </label>
                            </li>
                        ) : null
                    )}
                </ul>
            )}
        </div>
    );
}

export default Ingredients;
