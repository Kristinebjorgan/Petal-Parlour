// login.js
export function loginUser(event) {
  event.preventDefault(); 

  const email = document.getElementById("loginEmail").value;
  const password = document.getElementById("loginPassword").value;

  const data = {
    email: email,
    password: password,
  };

  fetch("https://api.noroff.dev/v2/auth/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.error) {
        alert(data.message);
      } else {
        localStorage.setItem("token", data.accessToken); // Stores the JWT token in localStorage
        alert("Login successful!");
        window.location.href = "feed.html"; 
      }
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}
