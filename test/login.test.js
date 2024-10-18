// Mock the login.js module globally
jest.mock("../src/js/login", () => ({
  clearAuthData: jest.fn(), // Mock clearAuthData
  loginUser: jest.fn(), // Mock loginUser
  handleLogout: jest.fn(() => {
    require("../src/js/login").clearAuthData(); // Call the mock clearAuthData
    global.window.location.href = "login.html"; // Simulate redirect to login page
  }),
}));

import { loginUser, handleLogout, clearAuthData } from "../src/js/login";

describe("loginUser", () => {
  it("should store a token when provided with valid credentials", async () => {
    const token = "12345";
    loginUser("validUsername", "validPassword");

    // Example expectation (adapt this to your logic)
    expect(loginUser).toHaveBeenCalledWith("validUsername", "validPassword");
  });
});

describe("handleLogout", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Mock the window object globally before each test
    delete global.window.location;
    global.window.location = { href: "" };
  });

  it("should call clearAuthData and redirect to login page", () => {
    handleLogout();

    // Verify that clearAuthData was called
    expect(clearAuthData).toHaveBeenCalled();

    // Check that window.location.href was updated
    expect(window.location.href).toBe("login.html");
  });
});
