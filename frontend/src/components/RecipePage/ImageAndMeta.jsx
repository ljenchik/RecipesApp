import { useState } from "react";
import { parseTime, parseServings } from "../../utils/helpers";
import "../../css/RecipePage.css";

function ImageAndMeta({ recipe, onUpdate }) {
    const [updateImage, setUpdateImage] = useState(false);
    const [newImageUrl, setNewImageUrl] = useState("");
    const [imageFile, setImageFile] = useState(null);
    const [uploadingImage, setUploadingImage] = useState(false);

    const handleImageUpdate = async () => {
        try {
            setUploadingImage(true);
            let finalImageUrl = "";

            // If user uploaded a file, upload it first
            if (imageFile) {
                const formData = new FormData();
                formData.append("image", imageFile);

                const uploadRes = await fetch(
                    `/recipes/${recipe.id}/upload-image`,
                    {
                        method: "POST",
                        body: formData,
                    }
                );

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
            await onUpdate("image_url", finalImageUrl);
            setUpdateImage(false);
            setNewImageUrl("");
            setImageFile(null);
            alert("Image updated successfully!");
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

    return (
        <div>
            {/* Image */}
            {recipe.image_url && (
                <div className="image-container">
                    <img
                        src={recipe.image_url}
                        alt={recipe.title}
                        className="recipe-image"
                    />
                    {!updateImage && (
                        <button
                            className="edit-button"
                            onClick={() => setUpdateImage(true)}
                        >
                            <span className="icon">✏️</span>
                            <span className="label">Update image</span>
                        </button>
                    )}
                </div>
            )}

            {/* Recipe Meta - Hidden during image update */}
            {!updateImage && (
                <div className="recipe-meta">
                    {recipe.prep_time && (
                        <span>⏱️ {parseTime(recipe.prep_time)}</span>
                    )}
                    {recipe.servings && (
                        <span>🍽️ {parseServings(recipe.servings)}</span>
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

            {/* Image Update Mode */}
            {updateImage && (
                <div className="image-update-modal">
                    <div className="modal-content">
                        <h3>Update Recipe Image</h3>

                        {/* Option 1: Image URL */}
                        <div>
                            <label className="option-label">Image URL</label>
                            <input
                                type="url"
                                placeholder="https://example.com/image.jpg"
                                value={newImageUrl}
                                onChange={(e) => {
                                    setNewImageUrl(e.target.value);
                                    setImageFile(null);
                                }}
                                className="url-input"
                                disabled={imageFile !== null}
                            />
                        </div>
                        {/* Option 2: Upload from computer */}
                        <div>
                            <label className="option-label">
                                Upload from computer
                            </label>
                            <label
                                htmlFor="image-upload"
                                className="upload-button"
                            >
                                {imageFile ? (
                                    <>
                                        <span className="icon">✅</span>
                                        <span>{imageFile.name}</span>
                                    </>
                                ) : (
                                    <>
                                        <span className="icon">📁</span>
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
                                            ? URL.createObjectURL(imageFile)
                                            : newImageUrl
                                    }
                                    alt="Preview"
                                    onError={(e) => {
                                        e.target.style.display = "none";
                                    }}
                                    onLoad={(e) => {
                                        e.target.style.display = "block";
                                    }}
                                />
                            </div>
                        )}

                        {/* Action buttons */}
                        <div className="modal-buttons">
                            <button
                                className="save-btn"
                                onClick={handleImageUpdate}
                                disabled={
                                    uploadingImage ||
                                    (!newImageUrl.trim() && !imageFile)
                                }
                                title="Save image"
                            >
                                {uploadingImage ? "⏳ Uploading..." : "✅"}
                            </button>
                            <button
                                className="cancel-btn"
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
    );
}

export default ImageAndMeta;
