import axios from "axios";
import { API_BASE_URL } from "./../constatnts/config";

//const API_BASE_URL = "http://192.168.1.204:5000";
//const API_BASE_URL = "http://192.168.2.59:5000";

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        "Content-Type": "application/json",
    },
    timeout: 10000,
});

// Add logging to debug
api.interceptors.request.use((config) => {
    console.log("📤 API Request:", config.method.toUpperCase(), config.url);
    return config;
});

api.interceptors.response.use(
    (response) => {
        console.log("✅ API Success:", response.status);
        return response;
    },
    (error) => {
        console.error("❌ API Error:", error.message);
        if (error.response) {
            console.error("Error data:", error.response.data);
        }
        return Promise.reject(error);
    }
);

export const recipeAPI = {
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
            type,
        });

        const response = await api.post(
            `/recipes/${id}/upload-image`,
            formData,
            {
                headers: { "Content-Type": "multipart/form-data" },
            }
        );

        return response.data;
    },

    updateNotes: async (id, notes) => {
        const response = await api.put(`/recipes/${id}/notes`, { notes });
        return response.data;
    },
};
