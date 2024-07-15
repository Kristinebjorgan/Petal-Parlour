import { API_KEY } from "./config.js";
import { loginUser } from "./login.js";

//login//
document.getElementById("loginForm").addEventListener("submit", loginUser);
