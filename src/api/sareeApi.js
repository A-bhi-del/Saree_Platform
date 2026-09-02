import API from "./axios";

export const fetchSareesApi = (params) => API.get("/sarees", { params });

export const fetchSareeByIdApi = (id) => API.get(`/sarees/${id}`);

export const createSareeApi = async (formData) => {
  const response = await API.post("/sarees", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response;
};

export const updateSareeApi = (id, sareeData) => API.put(`/sarees/${id}`, sareeData);

export const deleteSareeApi = (id) => API.delete(`/sarees/${id}`);

export const fetchRelatedSareeApi = (id) => API.get(`/sarees/${id}/related`);