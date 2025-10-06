// src/components/AddRecipeByUrl.jsx
import { useState } from "react";

function AddRecipeByUrl({ onRecipeAdded }) {
    const [url, setUrl] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        if (!url) {
            setError("Please enter a URL.");
            return;
        }

        try {
            setLoading(true);
            const res = await fetch("/recipes/parse-and-save", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ url }),
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || "Failed to add recipe");
            }

            const newRecipe = await res.json();
            setUrl("");
            if (onRecipeAdded) onRecipeAdded(newRecipe); // notify parent to refresh list
        } catch (err) {
            console.error(err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="add-recipe">
            <form onSubmit={handleSubmit}>
                <input
                    type="url"
                    placeholder="Paste recipe URL here..."
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    required
                />
                <button type="submit" disabled={loading}>
                    {loading ? "Adding..." : "Add Recipe"}
                </button>
            </form>
            {error && <p style={{ color: "red" }}>{error}</p>}
        </div>
    );
}

export default AddRecipeByUrl;
