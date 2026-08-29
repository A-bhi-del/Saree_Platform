import API from "./axios";

export const getAdmins = async () => {
  const response = await API.get("/admins");
  return response;
};