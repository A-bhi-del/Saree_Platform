import API from "./axios";

export const createRequestApi = async (data) => {
  const response = await API.post("/requests", data);
  return response;
};

export const getRequests = async () => {
  const response = await API.get("/requests");
  return response;
};

export const updateRequestStatus = async (id, data) => {
  const response = await API.patch(
    `/requests/${id}/status`,
    data
  );
  return response;
};

export const deleteCustomerRequest = async (id) => {
  const response = await API.delete(
    `/requests/customer/${id}`
  );
  return response;
};

export const deleteAdminRequest = async (id) => {
  const response = await API.delete(
    `/requests/admin/${id}`
  );

  return response;
};