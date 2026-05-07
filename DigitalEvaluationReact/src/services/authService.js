import API, { setAccessToken } from "../api/axios";

// Register new user
export const registerUser = async (data) => {
  const res = await API.post("/Auth/register", data);
  // Server sets refreshToken cookie automatically
  setAccessToken(res.data.token); // keep access token in memory only
  return res.data;
};

// Login existing user
export const loginUser = async (data) => {
  const res = await API.post("/Auth/login", data);
  // Server sets refreshToken cookie automatically
  setAccessToken(res.data.token); // keep access token in memory only
  return res.data;
};

// Logout user
export const logoutUser = async () => {
  try {
    await API.post("/Auth/revokeToken", {}, { withCredentials: true });
  } catch (err) {
    console.error("Logout failed:", err);
  } finally {
    // Clear memory only; refresh cookie is revoked server-side
    setAccessToken(null);
    window.location.href = "/login";
  }
};
