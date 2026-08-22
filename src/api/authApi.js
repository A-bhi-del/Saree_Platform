import API from "./axios";

export const sendOtp = async (data) => {
  const response = await API.post("/auth/send-otp", data);
  return response;
};

export const verifyOtp = async (data) => {
  const response = await API.post("/auth/verify-otp", data);
  return response;
};

export const registerUser = async (data) => {
  const response = await API.post("/auth/register", data);
  return response;
};

export const loginUser = async (data) => {
  const response = await API.post("/auth/login", data);
  return response;
};

export const getCurrentUser = async () => {
  const response = await API.get("/auth/me");
  return response;
};

export const updateProfile = async (data) => {
  const response = await API.patch("/auth/edit-profile", data);
  return response;
};

export const logoutUser = async () => {
  const response = await API.post("/auth/logout");
  return response;
};