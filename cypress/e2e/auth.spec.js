//login
describe("Login and Logout Flow", () => {
  it("should log in with valid credentials", () => {
    cy.visit("/login.html");

    cy.get('input[name="username"]').type("validUsername");
    cy.get('input[name="password"]').type("validPassword");

    cy.get('button[type="submit"]').click();

    cy.url().should("include", "/dashboard");
  });

  //credentials 
  
  it("should show an error with invalid credentials", () => {
    cy.visit("/login.html");

    cy.get('input[name="username"]').type("invalidUsername");
    cy.get('input[name="password"]').type("invalidPassword");

    cy.get('button[type="submit"]').click();

    cy.get(".error-message").should("be.visible");
  });

  it("should log out and clear the token", () => {
    cy.visit("/dashboard");

    cy.get("#logout-button").click();

    cy.url().should("include", "/login");
  });
});

it("should show an error message when logging in with invalid credentials", () => {
  cy.visit("http://localhost:5500/login.html");

  cy.get('input[name="username"]').type("invalidUsername");
  cy.get('input[name="password"]').type("invalidPassword");

  cy.get('button[type="submit"]').click();

  cy.get(".error-message").should("be.visible");
});

//logout
describe("Logout Functionality", () => {
  it("should log out the user and clear the token", () => {
    cy.visit("http://localhost:5500/home.html");

    cy.get("#logout-button").click();

    cy.window().then((window) => {
      expect(window.localStorage.getItem("token")).to.be.null;
    });

    cy.url().should("include", "/login.html");
  });
});
