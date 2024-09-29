/**
 * Imports utility functions for retrieving the authentication token and API key.
 *
 * `getToken` retrieves the stored JWT token, and `getApiKey` retrieves the API key
 * required for API interactions.
 */
import { getToken, getApiKey } from "./config.js";

/**
 * Pagination for fetchPosts.
 *
 * `currentPage`: Tracks the current page being displayed.
 * `isLastPage`: A flag that indicates whether the last page of posts has been reached.
 *
 * @type {number} currentPage - The current page being fetched or displayed.
 * @type {boolean} isLastPage - True if the last page has been reached.
 */
let currentPage = 1;
let isLastPage = false;


/**
 * Creates a new post and sending a POST request.
 *
 * This function performs the following actions:
 * - Prevents default form submission behavior.
 * - Gets the auth token and API key from localStorage.
 * - Validates the token and API key.
 * - Takes postData from form fields: title, image URL, location, and text content.
 * - Sends the post data to the API via a POST method.
 * - Successful: alerts the user, resets the form, and fetches the updated list of posts.
 * - Error: displays an error message.
 *
 * @param {Event} event - The event object triggered by the form submission.
 * @throws {Error} If the API request fails or returns an error response.
 * @example
 * document.getElementById("createPostForm").addEventListener("submit", createPost);
 */
export function createPost(event) {
  event.preventDefault();
  const token = getToken();
  const apiKey = getApiKey();

  if (!token || !apiKey) {
    alert("You must be logged in to create a post.");
    return;
  }

  const title = document.getElementById("title").value || "Untitled Post";
  const imageUrl =
    document.getElementById("image").value || "/assets/default-post.png";
  const location = document.getElementById("location").value || "Unknown";
  const text = document.getElementById("text").value || "No content";
  const postDate = new Date().toISOString();

  const newPostData = {
    title: title,
    body: text,
    tags: ["petal-parlour", location],
    media: {
      url: imageUrl,
      alt: title,
    },
    created: postDate,
  };

  fetch("https://v2.api.noroff.dev/social/posts", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "x-Noroff-api-key": apiKey,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(newPostData),
  })
    .then((response) => {
      if (!response.ok) {
        return response.json().then((data) => {
          throw new Error(data.message || "Error creating post.");
        });
      }
      return response.json();
    })
    .then(() => {
      alert("Post created successfully!");
      resetForm();
      PostManager.fetchPosts();
    })
    .catch((error) => {
      alert("Post creation failed: " + error.message);
    });
}

/**
 * Resets the form for adding or editing a post.
 *
 * This function performs the following actions:
 * - Clears all input fields by resetting the form element.
 * - Clears the hidden `postId` field to ensure that a new post is created rather than editing an existing one.
 * - Changes the submit button's text back to "Submit" to indicate a new post creation.
 * - Removes any existing `updatePost` event listener from the form to avoid triggering an update.
 * - Reattaches the `createPost` event listener to handle new post submissions.
 *
 * @example
 * resetForm(); // Resets the form and prepares it for new post creation.
 */
function resetForm() {
  const form = document.getElementById("addPostForm");
  form.reset();
  document.getElementById("postId").value = "";
  document.getElementById("submitButton").textContent = "Submit";
  form.removeEventListener("submit", updatePost);
  form.addEventListener("submit", createPost);
}

/**
 * Updates an existing post.
 *
 * This function performs the following actions:
 * - Prevents the default form submission behavior.
 * - Retrieves the API token and post ID.
 * - Inserts the updated post data, including title, image, location, and content.
 * - Sends a PUT request to the API to update the post.
 *
 * @param {Event} event - The form submission event object.
 * @throws {Error} If the response from the API is not successful.
 * @example
 * document.getElementById("updatePostForm").addEventListener("submit", updatePost);
 */
export function updatePost(event) {
  event.preventDefault();

  const token = getToken();
  const apiKey = getApiKey();
  const postId = document.getElementById("postId").value;

  if (!token || !apiKey || !postId) {
    alert(
      "You must be logged in, have an API key, and a valid post to update."
    );
    return;
  }

  const image = document.getElementById("image").value;
  const location = document.getElementById("location").value;
  const text = document.getElementById("text").value;
  const title = document.getElementById("title").value || "Untitled Post";

  const updatedPostData = {
    title: title,
    body: text || "No content provided.",
    tags: ["petal-parlour", location || "Unknown"],
    media: {
      url: image || "/assets/default-post.png",
      alt: title,
    },
  };

  fetch(`https://v2.api.noroff.dev/social/posts/${postId}`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
      "x-Noroff-api-key": apiKey,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(updatedPostData),
  })
    .then((response) => {
      if (!response.ok) {
        return response.json().then((data) => {
          throw new Error(data.message || "Error updating post.");
        });
      }
      return response.json();
    })
    .then(() => {
      alert("Post updated successfully!");
      resetForm();
      PostManager.fetchPosts();
    })
    .catch((error) => {
      alert("Post update failed: " + error.message);
    });
}

/**
 * Fetches posts from the API.
 *
 * This function performs the following actions:
 * - Retrieves the API token and key.
 * - Fetches the posts with a specific tag ("petal-parlour") from the API
 * - Displays the fetched posts using the `displayPosts` function.
 * - Disables the "Load More" button if there are no more pages to fetch.
 *
 * @param {number} [page=1] - The current page number to fetch posts for, defaulting to 1.
 *
 * @example
 * // Fetch the first page of posts
 * fetchPosts(1);
 *
 * @throws Will display an alert if there's an error fetching posts.
 */
export function fetchPosts(page = 1) {
  const token = getToken();
  const apiKey = getApiKey();
  const postsContainer = document.getElementById("postsContainer");

  if (!token || !apiKey || !postsContainer) return;

  fetch(
    `https://v2.api.noroff.dev/social/posts?limit=12&page=${page}&_tag=petal-parlour&_author=true`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "x-Noroff-api-key": apiKey,
      },
    }
  )
    .then((response) =>
      response.ok ? response.json() : Promise.reject(response)
    )
    .then((data) => {
      displayPosts(data.data, page); // Pass current page to display

      // Disable the Load More button if it's the last page
      if (data.meta.isLastPage) {
        document.getElementById("loadMoreBtn").disabled = true;
      }
    })
    .catch((error) => alert("Error fetching posts: " + error));
}

/**
 * Displays the posts.
 *
 * This function handles the following actions:
 * - Clears the posts container if it's the first page of results.
 * - Iterates through each post and generates the HTML structure.
 * - Displays the posts image, title, body, author, location and date
 * - Attaches a click event to each post, redirecting to a detailed post view (`post.html`) using the post's ID.
 *
 * @param {Array<Object>} posts - An array of post objects to display.
 * @param {number} page - The current page of posts being displayed.
 *
 * @example
 * // Display posts for page 1
 * displayPosts(posts, 1);
 */
export function displayPosts(posts, page) {
  const postsContainer = document.getElementById("postsContainer");
  if (!postsContainer) return;

  if (page === 1) postsContainer.innerHTML = "";

  posts.forEach((post) => {
    const location = post.tags?.[1] || "Unknown";
    const reactionsCount = post._count?.reactions || 0;
    const author = post.author?.name || "Anonymous";
    const imageUrl = post.media?.url || "/assets/default-image.png";
    const postDate = new Date(post.created).toLocaleDateString();

    const postElement = document.createElement("div");
    postElement.classList.add("post", "mb-4", "p-3", "border", "rounded");
    postElement.innerHTML = `
      <div class="post-inner">
        <div class="post-content">
          <div class="post-image-container mb-3">
            <img src="${imageUrl}" alt="${post.media?.alt || "Post Image"}"
              class="post-image img-fluid rounded" 
              onerror="this.onerror=null;this.src='/assets/default-image.png';">
          </div>
          <div class="post-meta d-flex justify-content-between text-muted mb-3">
            <span><i class="fas fa-map-marker-alt"></i> ${location}</span>
            <span><i class="fas fa-calendar-alt"></i> Posted on: ${postDate}</span>
            <span><i class="fas fa-heart"></i> ${reactionsCount}</span>
          </div>
          <div class="post-body">
            <h4 class="post-link">${post.title || "Untitled Post"}</h4>
            <p>${post.body || "No content"}</p>
          </div>
          <div class="author-details text-muted"><p>${author}</p></div>
        </div>
      </div>`;

    // Attach click event to postElement
    postElement.addEventListener("click", () => {
      window.location.href = `post.html?id=${post.id}`;
    });

    postsContainer.appendChild(postElement);
  });
}
/**
 * Deletes a post by sending a DELETE.
 *
 * This function performs the following actions:
 * - Retrieves the token and API key.
 * - Sends a DELETE request to the API.
 * - Successful: alerts the user and refreshes the posts list.
 * - Error: displays an error message.
 *
 * @param {string} postId - The ID of the post to be deleted.
 *
 * @example
 * // Delete a post with the ID '12345'
 * deletePost('12345');
 */
export function deletePost(postId) {
  const token = getToken();
  const apiKey = getApiKey();

  fetch(`https://v2.api.noroff.dev/social/posts/${postId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
      "x-Noroff-api-key": apiKey,
    },
  })
    .then((response) => {
      if (response.status === 204) {
        alert("Post deleted successfully!");
        PostManager.fetchPosts();
      } else {
        throw new Error("Failed to delete post");
      }
    })
    .catch((error) => alert("Error deleting post: " + error.message));
}

/**
 * Opportunity to edit post for users.
 *
 * This function performs the following actions:
 * - Retrieves form inputs for title, image URL, location, and text content.
 * - Populates the form fields with the data.
 * - Updates the `postId` hidden input field to associate the form with the correct post.
 * - Changes the submit button text to "Resubmit".
 * - Removes the existing event listener for creating a new post and attaches the `updatePost` listener for updating the post.
 * - Scrolls the form into view smoothly.
 *
 * @param {string} postId - The ID of the post to edit.
 * @param {string} title - The title of the post.
 * @param {string} imageUrl - The URL of the post image.
 * @param {string} body - The body content of the post.
 * @param {string} location - The location where the post content is relevant.
 * @param {string} postDate - The creation date of the post.
 *
 * @example
 * // Example usage: Populate form fields to edit the post
 * editPost('12345', 'New Post Title', 'https://example.com/image.jpg', 'Post content', 'New York', '2024-09-29');
 */
export function editPost(postId, title, imageUrl, body, location, postDate) {
  const titleInput = document.getElementById("title");
  const imageInput = document.getElementById("image");
  const locationInput = document.getElementById("location");
  const textInput = document.getElementById("text");
  const postIdInput = document.getElementById("postId");

  if (titleInput && imageInput && locationInput && textInput && postIdInput) {
    titleInput.value = title;
    imageInput.value = imageUrl || "";
    locationInput.value = location || "Unknown";
    textInput.value = body || "No content";
    postIdInput.value = postId;

    const submitButton = document.getElementById("submitButton");
    if (submitButton) {
      submitButton.textContent = "Resubmit";
    }

    const form = document.getElementById("addPostForm");
    if (form) {
      form.removeEventListener("submit", createPost);
      form.addEventListener("submit", updatePost);
      form.scrollIntoView({ behavior: "smooth" });
    }
  } else {
    console.error("One or more form fields are missing.");
  }
}

/**
 * Fetches and displays a single post by ID
 *
 * This function sends a GET request to the API to retrieve a specific post,
 * It then passes the post data to `PostRenderer.displaySinglePost()` to render the post on the page.
 *
 * @param {string} postId - The ID of the post to fetch.
 *
 * This function performs the following actions:
 * - Validates if the token and API key before the API call.
 * - Makes a GET request to the API to fetch the post data.
 * - Successful: logs and passes the post data to `PostRenderer.displaySinglePost()`.
 * - Errors: alert user.
 *
 * @example
 * // Example usage: Fetch and display a post by its ID
 * fetchSinglePost('12345');
 */
export function fetchSinglePost(postId) {
  const token = getToken();
  const apiKey = getApiKey();

  if (!token || !apiKey) {
    return;
  }
  fetch(
    `https://v2.api.noroff.dev/social/posts/${postId}?_author=true&_comments=true`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "x-Noroff-api-key": apiKey,
      },
    }
  )
    .then((response) => {
      if (!response.ok) {
        console.error("Failed to fetch post:", response);
        return Promise.reject(response);
      }
      return response.json();
    })
    .then((postData) => {
      PostRenderer.displaySinglePost(postData.data);
    })
    .catch((error) => {
      alert("Error fetching post details: " + error.message);
      console.error("Error fetching post details:", error);
    });
}

/**
 * Displays a single post
 *
 * This function updates the DOM to show a specific post,
 * including its image, metadata, title, content, and author.
 *
 * @param {Object} post - The post data object to be displayed.
 * @param {string} post.title - The title of the post.
 * @param {string} post.body - The body content of the post.
 * @param {Object} post.media - Media object containing the image data.
 * @param {string} post.media.url - The URL of the post image.
 * @param {string} post.media.alt - The alt text for the post image.
 * @param {Array} post.tags - An array of tags associated with the post. Index 1 typically holds location information.
 * @param {Object} post.author - The author object containing author information.
 * @param {string} post.author.name - The name of the post author.
 * @param {Date} post.created - The creation date of the post.
 * @param {Object} post._count - The object containing reaction counts.
 * @param {number} post._count.reactions - The number of reactions to the post.
 */

export function displaySinglePost(post) {
  const postDetails = document.getElementById("postDetails");
  if (!postDetails) {
    console.error("Post details container not found!");
    return;
  }

  document.title = `${post.author?.name || "Anonymous"}'s Post`;

  postDetails.innerHTML = `
    <div class="post-content">
      <div class="post-image-container">
        <img src="${post.media?.url || "/assets/default-image.png"}" alt="${
    post.media?.alt || "Post Image"
  }" class="post-image" onerror="this.onerror=null;this.src='/assets/default-image.png';">
      </div>
      <div class="post-meta">
        <span><i class="fas fa-map-marker-alt"></i> ${
          post.tags?.[1] || "Unknown"
        }</span>
        <span><i class="fas fa-calendar-alt"></i> ${new Date(
          post.created
        ).toLocaleDateString()}</span>
        <span><i class="fas fa-heart"></i> ${post._count?.reactions || 0}</span>
      </div>
      <div class="post-body">
        <h2>${post.title || "Untitled Post"}</h2>
        <p>${post.body || "No content"}</p>
      </div>
      <div class="author-details"><p>Author: ${
        post.author?.name || "Anonymous"
      }</p></div>
    </div>`;
}

/**
 * Updates the character count display.
 *
 * This function counts the number of characters users types.
 */

export function updateCharCount() {
  const maxLength = 280;
  const currentLength = document.getElementById("text").value.length;
  document.getElementById(
    "charCount"
  ).textContent = `${currentLength}/${maxLength} characters used`;
}
