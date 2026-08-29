import API from "./axios";

export const followAdmin = async (adminBId) => {
    const response = await API.post(`/favorites/${adminBId}`);
    return response;
};

export const unfollowAdmin = async (adminId) => {
    const response = await API.delete(`/favorites/${adminId}`);
    return response;
};

export const getfollowers = async () => {
  const response = await API.get("/favorites/followers");
  return response;
};

export const getfollowings = async () => {
  const response = await API.get("/favorites/followings");
  return response;
};

