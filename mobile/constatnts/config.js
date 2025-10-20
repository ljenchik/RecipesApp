// config.js
import { Platform } from "react-native";

// Replace with your local IP if you want to test on real devices
const DEV_IP = "192.168.1.204";

export const API_BASE_URL = __DEV__
    ? Platform.OS === "android"
        ? `http://${DEV_IP}:5000` // Android emulator can't use localhost
        : `http://${DEV_IP}:5000` // iOS simulator or real iOS device
    : "https://your-production-api.com";

console.log("API_BASE_URL:", API_BASE_URL);
