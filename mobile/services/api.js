import axios from "axios";

const API_BASE_URL = "http://192.168.1.204:5000";

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        "Content-Type": "application/json",
    },
    timeout: 10000,
});

// Add logging
api.interceptors.request.use((config) => {
    console.log("📤 API Request:", config.method.toUpperCase(), config.url);
    return config;
});

api.interceptors.response.use(
    (response) => {
        console.log("✅ API Response:", response.status);
        return response;
    },
    (error) => {
        console.error("❌ API Error:", error.message);
        if (error.response) {
            console.error("Status:", error.response.status);
            console.error("Data:", error.response.data);
        }
        return Promise.reject(error);
    }
);

export const recipeAPI = {
    // Mobile → Flask → PostgreSQL → Flask → Mobile
    getRecipes: async () => {
        try {
            const response = await api.get("/recipes");
            return response.data;
        } catch (error) {
            console.error("Error fetching recipes:", error);
            throw error;
        }
    },

    // Get single recipe
    getRecipe: async (id) => {
        try {
            const response = await api.get(`/recipes/${id}`);
            return response.data;
        } catch (error) {
            console.error(`Error fetching recipe ${id}:`, error);
            throw error;
        }
    },

    // Create recipe
    createRecipe: async (recipeData) => {
        try {
            const response = await api.post("/recipes", recipeData);
            return response.data;
        } catch (error) {
            console.error("Error creating recipe:", error);
            throw error;
        }
    },

    // Update recipe
    updateRecipe: async (id, recipeData) => {
        try {
            const response = await api.put(`/recipes/${id}`, recipeData);
            return response.data;
        } catch (error) {
            console.error(`Error updating recipe ${id}:`, error);
            throw error;
        }
    },

    // Delete recipe
    deleteRecipe: async (id) => {
        try {
            const response = await api.delete(`/recipes/${id}`);
            return response.data;
        } catch (error) {
            console.error(`Error deleting recipe ${id}:`, error);
            throw error;
        }
    },

    // Add recipe by URL (scraping)
    addRecipeByUrl: async (url) => {
        try {
            const response = await api.post("/recipes/parse-and-save", { url });
            return response.data;
        } catch (error) {
            console.error("Error scraping recipe:", error);
            throw error;
        }
    },

    // Upload image
    uploadImage: async (id, imageUri) => {
        try {
            const formData = new FormData();

            const filename = imageUri.split("/").pop();
            const match = /\.(\w+)$/.exec(filename);
            const type = match ? `image/${match[1]}` : "image/jpeg";

            formData.append("image", {
                uri: imageUri,
                name: filename || "recipe-image.jpg",
                type: type,
            });

            const response = await api.post(
                `/recipes/${id}/upload-image`,
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                }
            );

            return response.data;
        } catch (error) {
            console.error(`Error uploading image for recipe ${id}:`, error);
            throw error;
        }
    },

    // Update notes
    updateNotes: async (id, notes) => {
        try {
            const response = await api.put(`/recipes/${id}/notes`, { notes });
            return response.data;
        } catch (error) {
            console.error(`Error updating notes for recipe ${id}:`, error);
            throw error;
        }
    },
};

export default api;
