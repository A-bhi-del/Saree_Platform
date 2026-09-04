import API from "./axios";

export const addToCart = async (data) => {
    const response = await API.post("/cart/addToCart", data);
    return response;
};

export const getCart = async () => {
    const response = await API.get("/cart/cartItems");
    return response;
};

export const getCartCount = async () => {
    const response = await API.get("/cart/cartCount");
    return response;
};

export const updateCart = async (data, sareeId) => {
    const response = await API.patch(
        `/cart/updateCart/${sareeId}`,
        data
    );
    return response;
};

export const removeFromCart = async (sareeId) => {
    const response = await API.delete(
        `/cart/deleteCartItem/${sareeId}`
    );
    return response;
};

export const clearCart = async () => {
    const response = await API.delete("/cart/clearCart");
    return response;
};

export const validateCart = async () => {
    const response = await API.get("/cart/validateCart");
    return response;
};