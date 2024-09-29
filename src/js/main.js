/**
 * Import user authentication functions from `login.js`.
 *
 * - `loginUser`: Handles user login by validating credentials and fetching a token.
 * - `registerUser`: Handles user registration, creating a new user account.
 * - `handleLogout`: Logs out the user by clearing authentication tokens and redirecting.
 */
import {
  loginUser,
  registerUser,
  handleLogout,
  sendApiRequest,
  storeToken,
  clearAuthData,
} from "./login.js";

import {
  editPost,
  deletePost,
  displayPosts,
  fetchPosts,
  updatePost,
  resetForm,
  createPost,
  fetchSinglePost,
  displaySinglePost,
  updateCharCount,
} from "./post.js";

/**
 * Event listener for forms
 *
 * @param {string} formId - The ID of the form.
 * @param {Function} eventHandler - The eventhandler to attach to the submit.
 *
 * @example
 * setupFormListener("registerForm", registerUser);
 */
function setupFormListener(formId, eventHandler) {
  const form = document.getElementById(formId);
  if (form) {
    form.addEventListener("submit", eventHandler);
  }
}

/**
 * Checks if an element with the given ID exists.
 *
 * @param {string} elementId - The ID of the element to check.
 * @returns {boolean} - Returns true if the element exists, false otherwise.
 *
 * @example
 * const exists = checkForElement("registerForm");
 * if (exists) {
 *   // Element exists, proceed with form setup
 * }
 */ function checkForElement(elementId) {
  const element = document.getElementById(elementId);
  return !!element;
}

/**
 * Gets the query parameters and returns them as an object.
 *
 * @returns {Object} - An object containing query parameters.
 *
 * @example
 * const { postId } = getQueryParams();
 * console.log(postId); // "123"
 */ function getQueryParams() {
  const params = new URLSearchParams(window.location.search);
  return {
    postId: params.get("id"),
  };
}

/**
 * Dynamically inserts a logout button.
 *
 * The function checks if the "Load More" button exists, and if it does, it creates
 * and inserts a logout button after it. The logout button is given an event listener
 * that triggers `handleLogout`.
 *
 * @example
 * insertLogoutButton();
 */
function insertLogoutButton() {
  const loadMoreBtn = document.getElementById("loadMoreBtn");
  if (loadMoreBtn) {
    const logoutButton = document.createElement("button");
    logoutButton.id = "logoutButton";
    logoutButton.textContent = "Logout";
    logoutButton.classList.add("btn", "btn-outline-secondary", "mt-3");

    // Insert the logout button after the Load More button
    loadMoreBtn.insertAdjacentElement("afterend", logoutButton);

    // Attach event listener for the Logout button
    logoutButton.addEventListener("click", handleLogout);
  }
}

/**
 * Initializes the app.
 *
 * This function sets up event listeners for different processes like registration, login, and post creation.
 * It fetches posts if the container exists and handles inserting a logout button.
 * Additionally, it handles fetching a single post if a postId is present in the URL.
 *
 * @example
 * document.addEventListener("DOMContentLoaded", initApp);
 */
let currentPage = 1;

function initApp() {
  if (checkForElement("registerForm")) {
    setupFormListener("registerForm", registerUser);
  }

  if (checkForElement("addPostForm")) {
    setupFormListener("addPostForm", createPost); // Properly calling the createPost method
  }

  if (checkForElement("loginForm")) {
    setupFormListener("loginForm", loginUser);
  }

  // Fetch posts if the container exists
  if (checkForElement("postsContainer")) {
    fetchPosts();
  }

  // Insert "Load More" button
  const loadMoreBtn = document.getElementById("loadMoreBtn");
  if (loadMoreBtn) {
    loadMoreBtn.addEventListener("click", () => {
      currentPage++; // Increment the page number
      fetchPosts(currentPage); // Fetch the next page of posts
    });
  }
  // Insert and handle Logout button
  insertLogoutButton();

  // Single post
  const { postId } = getQueryParams();
  console.log("Post ID:", postId); // Debugging postId

  if (postId) {
    fetchSinglePost(postId);
  }

  /**
   * Updates the character count as the user types.
   *
   * This function will make sure that the user is aware of the number of characters they have typed.
   *
   * @example
   * <textarea id="text"></textarea>
   */
  const textArea = document.getElementById("text");
  if (textArea) {
    textArea.addEventListener("input", updateCharCount);
  }
}

/**
 * Attaches an event listener to run initApp function when the DOM is ready.
 *
 * The `DOMContentLoaded` event ensures that the `initApp` function runs only after all HTML elements have been loaded.
 *
 * @example
 * document.addEventListener("DOMContentLoaded", initApp);
 */
document.addEventListener("DOMContentLoaded", initApp);

/**
 * Exposes the `editPost` and `deletePost` methods globally in the window object.
 *
 * This allows these functions to be used outside the scope of the module, such as in
 * HTML elements (e.g., inline `onclick` attributes).
 *
 * @example
 * <button onclick="editPost(postId)">Edit</button>
 * <button onclick="deletePost(postId)">Delete</button>
 */
window.editPost = editPost;
window.deletePost = deletePost;
