/**
 * API requests
 * Sends an API request to the URL with the method and body.
 *
 * This function Fetches the API and handles JSON raw material to body, 
 * Error: throws an error if the response is not successful.
 *
 * @async
 * @function sendApiRequest
 * @param {string} url - The URL of the API endpoint to send the request to.
 * @param {string} method - The HTTP method to use for the request.
 * @param {Object} [body={}] - The request body to send as JSON.
 * @returns {Promise<Object>} - A Promise that resolves to the JSON response from the API.
 * @throws {Error} - Throws an error if the response is not ok.
 *
 * @example
 * // Example usage: Sending a POST request with data
 * sendApiRequest('https://api.example.com/data', 'POST', { name: 'John' })
 *   .then(response => console.log(response))
 *   .catch(error => console.error('Error:', error.message));
 */
export async function sendApiRequest(url, method, body = {}) {
  const response = await fetch(url, {
    method,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Something went wrong");
  }
  return response.json();
}

/**
 * Stores the JWT token in localStorage.
 * 
 * This function saves the authentication token for the API.
 * 
 * @param {string} token - The JWT token to store in local storage.
 *
 * @example
 * // Example usage:
 * storeToken("eyJhbGciOiJIUzI1NiIsInR5cCI...");
 */
export function storeToken(token) {
  if (token) {
    localStorage.setItem("jwtToken", token);
  }
}

/**
 * Clears the JWT token (logout help)
 * 
 * This function is used during the logout process to remove stored info.
 *
 * @example
 * // Example usage:
 * clearAuthData();  // This will log out the user by clearing stored tokens.
 */
export function clearAuthData() {
  localStorage.removeItem("jwtToken");
  localStorage.removeItem("apiKey");
}

/**
 * Registers a new user by submitting to the API.
 * 
 * This function is triggered when the user submits the registration form. It validates the users input
 * and sends the data to the Noroff API for registration.
 * Successful: user is redirected to the login page. 
 * Error: error message is shown.
 * 
 * @param {Event} event - The form submission event triggered by the user.
 * 
 * @throws {Error} If the registration API call fails or invalid input is provided.
 *
 * @example
 * // Example usage:
 * document.getElementById("registerForm").addEventListener("submit", registerUser);
 */
export async function registerUser(event) {
  event.preventDefault();

  const name = document.getElementById("registerName").value.trim();
  const email = document.getElementById("registerEmail").value.trim();
  const password = document.getElementById("registerPassword").value.trim();

  if (!name || !email || !password) {
    alert("All required fields must be filled in.");
    return;
  }

  const nameRegex = /^[a-zA-Z0-9_]+$/;
  if (!nameRegex.test(name)) {
    alert("The name must only contain letters, numbers, and underscores.");
    return;
  }

  const emailRegex = /@(stud\.)?noroff\.no$/;
  if (!emailRegex.test(email)) {
    alert("Please use a valid Noroff email address.");
    return;
  }

  if (password.length < 8) {
    alert("Password must be at least 8 characters long.");
    return;
  }

  try {
    const data = { name, email, password };
    const responseData = await sendApiRequest(
      "https://v2.api.noroff.dev/auth/register",
      "POST",
      data
    );

    alert("Registration successful! You can now log in.");
    document.getElementById("registerForm").reset();
    window.location.href = "login.html";
  } catch (error) {
    alert("Registration failed: " + error.message);
}

/**
 * Logs in the user by submitting to the API with noroff requirements.
 * 
 * This function is triggered when the user submits the login form. It validates that the email 
 * and password fields are filled in and fulfilled requirements, sends a request to the Noroff API to log in, and stores 
 * the received access token in localStorage.
 * 
 * @param {Event} event - The form submission event triggered by the user.
 * 
 * @throws {Error} If the login API call fails or no access token is returned.
 * 
 * @example
 * // Example usage:
 * document.getElementById("loginForm").addEventListener("submit", loginUser);
 */
export async function loginUser(event) {
  event.preventDefault();

  const email = document.getElementById("loginEmail").value.trim();
  const password = document.getElementById("loginPassword").value.trim();

  if (!email || !password) {
    alert("Please fill in both email and password.");
    return;
  }

  try {
    const responseData = await sendApiRequest(
      "https://v2.api.noroff.dev/auth/login",
      "POST",
      { email, password }
    );

    const token = responseData.data?.accessToken || responseData.accessToken;

    if (!token) {
      alert("Login failed: No access token returned.");
      return;
    }

    storeToken(token);
    window.location.href = "index.html";
  } catch (error) {
    alert("Login failed: " + error.message);
  }
}

/**
 * Logs out the user by clearing authentication data and redirecting to the login page.
 * 
 * This function is triggered when the user chooses to log out. It clears the token and 
 * other relevant user data from local storage, then redirects the user to the login page.
 * 
 * @example
 * // Example usage:
 * document.getElementById("logoutButton").addEventListener("click", handleLogout);
 */

export function handleLogout() {
  clearAuthData(); // Clear token, API key, or other relevant user data
  window.location.href = "login.html"; // Redirect to login page
}
