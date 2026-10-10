import API from "./axios";


export const applyCoupon = async (code) => {
  const response = await API.post("/coupons/apply", { code });
  return response;
};

export const validateCoupon = async (code) => {
  const response = await API.post("/coupons/validate", { code });
  return response;
};

export const removeCoupon = async () => {
  const response = await API.post("/coupons/remove");
  return response;
};

// Get available coupons for cart
export const getAvailableCoupons = async () => {
  const response = await API.get("/coupons/available");
  return response;
};

// ADMIN ENDPOINTS
export const createCoupon = async (couponData) => {
  const response = await API.post("/coupons/admin", couponData);
  return response;
};


export const getAllCoupons = async (params = {}) => {
  const response = await API.get("/coupons/admin", { params });
  return response;
};


export const getCouponById = async (couponId) => {
  const response = await API.get(`/coupons/admin/${couponId}`);
  return response;
};

export const updateCoupon = async (couponId, updateData) => {
  const response = await API.patch(`/coupons/admin/${couponId}`, updateData);
  return response;
};

export const toggleCouponStatus = async (couponId, isActive) => {
  const response = await API.patch(`/coupons/admin/${couponId}/status`, {
    isActive,
  });
  return response;
};


export const deleteCoupon = async (couponId) => {
  const response = await API.delete(`/coupons/admin/${couponId}`);
  return response;
};

export const getCouponRedemptionHistory = async (couponId, params = {}) => {
  const response = await API.get(`/coupons/admin/${couponId}/redemptions`, {
    params,
  });
  return response;
};
