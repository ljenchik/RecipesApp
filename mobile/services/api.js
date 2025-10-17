import axios from "axios";

<<<<<<< HEAD
<<<<<<< HEAD
const API_BASE_URL = "http://192.168.1.204:5000";
=======
// Use YOUR computer's IP address
const API_BASE_URL = "http://192.168.1.204:5000"; // ← Update this!
>>>>>>> d43d6cb (Added Logo and Name)
=======
// Modify
const API_BASE_URL = "http://192.168.2.59:5000";
>>>>>>> 08a872f (Added search bar, add recipe)

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        "Content-Type": "application/json",
    },
    timeout: 10000,
});

<<<<<<< HEAD
// Add logging
=======
// Add logging to debug
>>>>>>> d43d6cb (Added Logo and Name)
api.interceptors.request.use((config) => {
    console.log("📤 API Request:", config.method.toUpperCase(), config.url);
    return config;
});

api.interceptors.response.use(
    (response) => {
<<<<<<< HEAD
        console.log("✅ API Response:", response.status);
=======
        console.log("✅ API Success:", response.status);
>>>>>>> d43d6cb (Added Logo and Name)
        return response;
    },
    (error) => {
        console.error("❌ API Error:", error.message);
        if (error.response) {
<<<<<<< HEAD
            console.error("Status:", error.response.status);
            console.error("Data:", error.response.data);
=======
            console.error("Error data:", error.response.data);
>>>>>>> d43d6cb (Added Logo and Name)
        }
        return Promise.reject(error);
    }
);

export const recipeAPI = {
<<<<<<< HEAD
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
=======
    getRecipes: async () => {
        const response = await api.get("/recipes");
        return response.data;
    },

    getRecipe: async (id) => {
        const response = await api.get(`/recipes/${id}`);
        return response.data;
    },

    createRecipe: async (recipeData) => {
        const response = await api.post("/recipes", recipeData);
        return response.data;
    },

    updateRecipe: async (id, recipeData) => {
        const response = await api.put(`/recipes/${id}`, recipeData);
        return response.data;
    },

    deleteRecipe: async (id) => {
        const response = await api.delete(`/recipes/${id}`);
        return response.data;
    },

    addRecipeByUrl: async (url) => {
        const response = await api.post("/recipes/parse-and-save", { url });
        return response.data;
    },

    uploadImage: async (id, imageUri) => {
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
    },

    updateNotes: async (id, notes) => {
        const response = await api.put(`/recipes/${id}/notes`, { notes });
        return response.data;
>>>>>>> d43d6cb (Added Logo and Name)
    },
};

export default api;
