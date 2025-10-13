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
    const [updateImage, setUpdateImage] = useState(false);
    const [newImageUrl, setNewImageUrl] = useState("");
    const [imageFile, setImageFile] = useState(null);
    const [uploadingImage, setUploadingImage] = useState(false);

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

    const handleImageUpdate = async () => {
        try {
            setUploadingImage(true);
            let finalImageUrl = "";

            // If user uploaded a file, upload it first
            if (imageFile) {
                const formData = new FormData();
                formData.append("image", imageFile);

                const uploadRes = await fetch(`/recipes/${id}/upload-image`, {
                    method: "POST",
                    body: formData,
                });

                if (!uploadRes.ok) {
                    throw new Error("Failed to upload image");
                }

                const { imageUrl: uploadedUrl } = await uploadRes.json();
                finalImageUrl = uploadedUrl;
            }
            // Otherwise use the URL they entered
            else if (newImageUrl.trim()) {
                finalImageUrl = newImageUrl;
            }

            if (!finalImageUrl) {
                alert("Please provide an image URL or upload a file");
                return;
            }

            // Update recipe with the image URL
            const res = await fetch(`/recipes/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ image_url: finalImageUrl }),
            });

            if (res.ok) {
                const updated = await res.json();
                setRecipe(updated);
                setUpdateImage(false);
                setNewImageUrl("");
                setImageFile(null);
                alert("Image updated successfully!");
            } else {
                alert("Failed to update image");
            }
        } catch (err) {
            console.error("Error updating image:", err);
            alert("Error updating image: " + err.message);
        } finally {
            setUploadingImage(false);
        }
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (!file.type.startsWith("image/")) {
                alert("Please select an image file");
                return;
            }
            if (file.size > 5 * 1024 * 1024) {
                alert("Image size must be less than 5MB");
                return;
            }
            setImageFile(file);
            setNewImageUrl("");
        }
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
                                <span className="label">Edit title</span>
                            </button>
                        </>
                    )}
                </h1>
                {/* Image + Ingredients row */}
                <div className="image-ingredients-row">
                    <div className="image-meta-container">
                        {/* Left side: Image */}
                        {recipe.image_url && (
                            <div className="image-container">
                                <img
                                    src={recipe.image_url}
                                    alt={recipe.title}
                                    className="recipe-image"
                                />
                                <button
                                    className="edit-button"
                                    onClick={() => setUpdateImage(true)}
                                >
                                    <span className="icon">✏️</span>
                                    <span className="label">Update image</span>
                                </button>
                            </div>
                        )}

                        {!updateImage && (
                            <div className="recipe-meta">
                                {recipe.prep_time && (
                                    <span>
                                        ⏱️ {parseTime(recipe.prep_time)}
                                    </span>
                                )}
                                {recipe.servings && (
                                    <span>
                                        🍽️ {parseServings(recipe.servings)}
                                    </span>
                                )}
                                {recipe.source_url && (
                                    <span>
                                        🫕{" "}
                                        <a
                                            className="original-link"
                                            href={recipe.source_url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                        >
                                            Original recipe
                                        </a>
                                    </span>
                                )}
                            </div>
                        )}

                        {updateImage && (
                            <div className="image-update-modal">
                                <div className="modal-content">
                                    <h3>Update Recipe Image</h3>

                                    {/* Option 1: Image URL */}
                                    <div className="upload-option">
                                        <label className="option-label">
                                            Image URL
                                        </label>
                                        <input
                                            type="url"
                                            placeholder="https://example.com/image.jpg"
                                            value={newImageUrl}
                                            onChange={(e) => {
                                                setNewImageUrl(e.target.value);
                                                setImageFile(null); // Clear file if URL is entered
                                            }}
                                            className="url-input"
                                            disabled={imageFile !== null}
                                        />
                                    </div>

                                    {/* Option 2: Upload from computer */}
                                    <div className="upload-option">
                                        <label className="option-label">
                                            Upload from computer
                                        </label>
                                        <label
                                            htmlFor="image-upload"
                                            className="upload-button"
                                        >
                                            {imageFile ? (
                                                <>
                                                    <span className="icon">
                                                        ✅
                                                    </span>
                                                    <span>
                                                        {imageFile.name}
                                                    </span>
                                                </>
                                            ) : (
                                                <>
                                                    <span className="icon">
                                                        📁
                                                    </span>
                                                    <span>Choose file</span>
                                                </>
                                            )}
                                        </label>
                                        <input
                                            id="image-upload"
                                            type="file"
                                            accept="image/*"
                                            onChange={handleFileChange}
                                            style={{ display: "none" }}
                                            disabled={newImageUrl.trim() !== ""}
                                        />
                                    </div>

                                    {/* Image Preview */}
                                    {(newImageUrl || imageFile) && (
                                        <div className="image-preview">
                                            <p>Preview:</p>
                                            <img
                                                src={
                                                    imageFile
                                                        ? URL.createObjectURL(
                                                              imageFile
                                                          )
                                                        : newImageUrl
                                                }
                                                alt="Preview"
                                                onError={(e) => {
                                                    e.target.style.display =
                                                        "none";
                                                }}
                                                onLoad={(e) => {
                                                    e.target.style.display =
                                                        "block";
                                                }}
                                            />
                                        </div>
                                    )}

                                    {/* Action buttons */}
                                    <div className="modal-buttons">
                                        <button
                                            className="tick-cross-buttons save-btn"
                                            onClick={handleImageUpdate}
                                            disabled={
                                                uploadingImage ||
                                                (!newImageUrl.trim() &&
                                                    !imageFile)
                                            }
                                            title="Save image"
                                        >
                                            {uploadingImage ? "⏳" : "✅"}
                                        </button>
                                        <button
                                            className="tick-cross-buttons cancel-btn"
                                            onClick={() => {
                                                setUpdateImage(false);
                                                setImageFile(null);
                                                setNewImageUrl("");
                                            }}
                                            disabled={uploadingImage}
                                            title="Cancel"
                                        >
                                            ❌
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
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
                {/* Instructions */}
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
