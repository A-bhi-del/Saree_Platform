import API from "./axios";

export const getActiveSales = async () => {
  const response = await API.get("/sales/active");
  return response;
};