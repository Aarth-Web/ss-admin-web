/**
 * Application configuration
 * This file centralizes all the environment variables and configuration settings
 */

// API Configuration
export const API_CONFIG = {
  BASE_URL:
    process.env.REACT_APP_API_URL || "https://ss-backend-uqx4.onrender.com",
  COUNTRY_CODE: process.env.REACT_APP_COUNTRY_CODE || "91",
};

// Authentication Configuration
export const AUTH_CONFIG = {
  TOKEN_KEY: "access_token",
  TOKEN_EXPIRY_DAYS: Number(process.env.REACT_APP_TOKEN_EXPIRY_DAYS || 30),
  STORAGE_KEY: "auth-storage",
};

// Feature Flags
export const FEATURES = {
  DEBUG_LOGGING: process.env.REACT_APP_ENABLE_DEBUG_LOGGING === "true",
};

// Environment Information
export const ENV_INFO = {
  IS_PRODUCTION: process.env.NODE_ENV === "production",
  IS_DEVELOPMENT: process.env.NODE_ENV === "development",
  APP_VERSION: process.env.REACT_APP_VERSION || "1.0.0",
};

export default {
  API: API_CONFIG,
  AUTH: AUTH_CONFIG,
  FEATURES,
  ENV: ENV_INFO,
};
