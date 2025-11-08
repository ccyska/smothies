import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8080"
});


// PRODUCTS

// GET semua produk
export const getAllProducts = () => {
  return api.get("/api/products");
};

// GET produk by ID
export const getProductById = (id) => {
  return api.get(`/api/products/${id}`);
};

// ORDERS

// POST buat order
export const createOrder = (data) => {
  return api.post("/api/user/orders", data);
};

// GET riwayat order
export const getOrderHistory = () => {
  return api.get("/api/user/orders");
};

export default api;
