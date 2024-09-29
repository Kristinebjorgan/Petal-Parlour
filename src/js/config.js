// API Key
export const API_KEY = "ea24f62e-fd86-47de-90c3-c0874ceb7d9b";

export function getToken() {
  return localStorage.getItem("jwtToken");
}

export function getApiKey() {
  return API_KEY;
}

export function setToken(token) {
  localStorage.setItem("jwtToken", token);
}

export function setApiKey(apiKey) {
  localStorage.setItem("apiKey", apiKey);
}
