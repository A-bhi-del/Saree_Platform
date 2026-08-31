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

export const isfollowing = async (adminId) => {
  const response = await API.get(`/favorites/exists/${adminId}`);
  return response;
}

export const getFollowersCount = async () => {
  const response = await API.get("/favorites/followercount");
  return response.data;
}

export const getFollowingCount = async () => {
  const response = await API.get("/favorites/followingcount");
  return response.data;
}