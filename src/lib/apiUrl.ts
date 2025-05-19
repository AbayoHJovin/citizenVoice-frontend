/* eslint-disable no-undef */
export const prod = process.env.NODE_ENV === "production";
export const apiUrl = prod ? "https://citizen-voice-pdca.onrender.com" : "";