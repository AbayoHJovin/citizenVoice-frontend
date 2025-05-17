/* eslint-disable no-undef */
export const prod = process.env.NODE_ENV === "production";

// In development, use relative URLs to leverage the proxy
// In production, use the full URL
export const apiUrl = prod ? "https://homedel.onrender.com" : "";
