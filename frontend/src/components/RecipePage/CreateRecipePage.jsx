import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import LogoAndName from "../Header/LogoAndName";

import "../../css/CreateRecipePage.css";

import icon from "../../assets/svgs/recipes-app-icon.svg";

function CreateRecipePage() {
    const navigate = useNavigate();

    const [title, setTitle] = useState("");
    const [ingredients, setIngredients] = useState("");
    const [instructions, setInstructions] = useState("");
    const [prepTime, setPrepTime] = useState("");
    const [servings, setServings] = useState("");
    const [imageUrl, setImageUrl] = useState("");
    const [imageFile, setImageFile] = useState(null);
    const [notes, setNotes] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

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
            setImageUrl("");
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!title.trim()) {
            alert("Please enter a recipe title");
            return;
        }

        setIsSubmitting(true);

        try {
            // Prepare recipe data with camelCase (matches backend)
            const recipeData = {
                userId: 1,
                title: title.trim(),
                ingredients: ingredients
                    .split("\n")
                    .filter((line) => line.trim())
                    .map((line) => line.trim()),
                instructions: instructions.trim(),
                prepTime: prepTime.trim() || null,
                servings: servings.trim() || null,
                notes: notes.trim() || "",
                imageUrl: imageUrl.trim() || icon,
                sourceUrl: null,
                host: null,
            };

            console.log("Sending recipe data:", recipeData);

            // Create recipe
            const createRes = await fetch("/recipes", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(recipeData),
            });

            if (!createRes.ok) {
                const errorData = await createRes.json();
                console.error("❌ Backend error:", errorData);
                throw new Error(errorData.error || "Failed to create recipe");
            }

            const createdRecipe = await createRes.json();
            console.log("✅ Recipe created:", createdRecipe);

            // If user uploaded an image file, upload it
            if (imageFile) {
                console.log("📤 Uploading image file...");
                const formData = new FormData();
                formData.append("image", imageFile);

                const uploadRes = await fetch(
                    `/recipes/${createdRecipe.id}/upload-image`,
                    {
                        method: "POST",
                        body: formData,
                    }
                );

                if (uploadRes.ok) {
                    const { imageUrl: uploadedUrl } = await uploadRes.json();
                    console.log("✅ Image uploaded:", uploadedUrl);

                    // Update recipe with uploaded image (use camelCase)
                    await fetch(`/recipes/${createdRecipe.id}`, {
                        method: "PUT",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ imageUrl: uploadedUrl }),
                    });
                }
            }

            // Navigate to the new recipe page
            alert("Recipe created successfully! 🎉");
            navigate(`/recipe/${createdRecipe.id}`);
        } catch (error) {
            console.error("❌ Error creating recipe:", error);
            alert(`Failed to create recipe: ${error.message}`);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div>
            <LogoAndName />

            <div className="create-recipe-page">
                <h3 className="page-title">Create Your Own Recipe</h3>
                <form onSubmit={handleSubmit} className="create-recipe-form">
                    {/* Image Preview */}
                    <div className="form-section image-section">
                        <label className="section-label">Recipe Image</label>
                        <div className="image-upload-area">
                            <div className="image-preview">
                                <img
                                    src={
                                        imageFile
                                            ? URL.createObjectURL(imageFile)
                                            : imageUrl || icon
                                    }
                                    alt="Recipe preview"
                                    className="preview-image"
                                />
                            </div>

                            <div className="image-options">
                                <div className="input-group">
                                    <label>Image URL</label>
                                    <input
                                        type="url"
                                        placeholder="https://example.com/image.jpg"
                                        value={imageUrl}
                                        onChange={(e) => {
                                            setImageUrl(e.target.value);
                                            setImageFile(null);
                                        }}
                                        disabled={imageFile !== null}
                                    />
                                </div>

                                <div className="input-group">
                                    <label
                                        htmlFor="image-file"
                                        className="file-upload-btn"
                                    >
                                        {imageFile ? (
                                            <>✅ {imageFile.name}</>
                                        ) : (
                                            <>📁 Upload Image</>
                                        )}
                                    </label>
                                    <input
                                        id="image-file"
                                        type="file"
                                        accept="image/*"
                                        onChange={handleFileChange}
                                        style={{ display: "none" }}
                                        disabled={imageUrl.trim() !== ""}
                                    />
                                </div>
                            </div>
                        </div>
                        <p className="help-text">
                            Default icon will be used if no image is provided
                        </p>
                    </div>

                    {/* Title */}
                    <div className="form-section">
                        <label className="section-label required">
                            Recipe Title
                        </label>
                        <input
                            type="text"
                            placeholder="e.g., Chocolate Chip Cookies"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="text-input"
                            required
                        />
                    </div>

                    {/* Prep Time and Servings */}
                    <div className="form-row">
                        <div className="form-section half">
                            <label className="section-label">Prep Time</label>
                            <input
                                type="text"
                                placeholder="e.g., 30 minutes"
                                value={prepTime}
                                onChange={(e) => setPrepTime(e.target.value)}
                                className="text-input"
                            />
                        </div>

                        <div className="form-section half">
                            <label className="section-label">Servings</label>
                            <input
                                type="text"
                                placeholder="e.g., 4 servings"
                                value={servings}
                                onChange={(e) => setServings(e.target.value)}
                                className="text-input"
                            />
                        </div>
                    </div>

                    {/* Ingredients */}
                    <div className="form-section">
                        <label className="section-label">Ingredients</label>
                        <textarea
                            placeholder="Enter ingredients, one per line&#10;e.g.,&#10;2 cups flour&#10;1 cup sugar&#10;3 eggs"
                            value={ingredients}
                            onChange={(e) => setIngredients(e.target.value)}
                            rows={10}
                            className="textarea-input"
                        />
                        <p className="help-text">
                            Enter each ingredient on a new line
                        </p>
                    </div>

                    {/* Instructions */}
                    <div className="form-section">
                        <label className="section-label">Instructions</label>
                        <textarea
                            placeholder="Enter cooking instructions&#10;&#10;You can write step-by-step or as continuous text"
                            value={instructions}
                            onChange={(e) => setInstructions(e.target.value)}
                            rows={10}
                            className="textarea-input"
                        />
                    </div>

                    {/* Notes */}
                    <div className="form-section">
                        <label className="section-label">
                            Personal Notes (optional)
                        </label>
                        <textarea
                            placeholder="Add any personal notes, tips, or variations..."
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            rows={4}
                            className="textarea-input"
                        />
                    </div>

                    {/* Action Buttons */}
                    <div className="form-actions">
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="submit-btn"
                        >
                            {isSubmitting ? "Creating..." : "Create Recipe"}
                        </button>
                        <Link to="/" className="cancel-btn">
                            Cancel
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default CreateRecipePage;
