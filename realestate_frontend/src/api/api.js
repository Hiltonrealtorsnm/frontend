import axios from "axios";

const BASE = "https://hiltonbackend.onrender.com";

const api = axios.create({
  baseURL: BASE,
});

// =========================================
// 🔐 ATTACH JWT TOKEN
// =========================================
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("adminToken");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// =========================================
// 🔑 AUTH
// =========================================
export async function login(email, password) {
  const res = await api.post("/auth/login", { email, password });
  const token = res.data?.token || res.data;
  localStorage.setItem("adminToken", token);
  return token;
}

export function logout() {
  localStorage.removeItem("adminToken");
}

// =========================================
// 🧑‍💼 SELLER API
// =========================================
export function addSeller(body) {
  return api.post("/seller/add", body);
}

export function findSellerByEmailPhone(email, phone) {
  return api.get("/seller/check", { params: { email, phone } });
}

export function findSellerByPhone(phone) {
  return api.get("/seller/check", { params: { phone } });
}

export function addOrUpdateSeller(body) {
  return api.post("/seller/add", body);
}

// =========================================
// 🏠 PROPERTY API
// =========================================
export function addProperty(body) {
  return api.post("/property/add", body);
}

export function getProperties(page = 0, size = 10) {
  return api.get(`/property/all?page=${page}&size=${size}`);
}

export function getProperty(id) {
  return api.get(`/property/${id}`);
}

export function approveProperty(id) {
  return api.put(`/property/approve/${id}`);
}

export function rejectProperty(id) {
  return api.put(`/property/reject/${id}`);
}

export function updateProperty(id, data) {
  return api.put(`/property/update/${id}`, data);
}

export function deleteProperty(id) {
  return api.delete(`/property/delete/${id}`);
}

export function searchProperty(params) {
  return api.get("/property/search", { params });
}

export const markPropertySold = (id) => api.put(`/property/sold/${id}`);

// =========================================
// 📸 PROPERTY IMAGES
// =========================================
export function uploadPropertyImages(propertyId, files) {
  const form = new FormData();
  files.forEach((f) => form.append("images", f));
  return api.post(`/property/uploadImages/${propertyId}`, form, {
    headers: { "Content-Type": "multipart/form-data" },
  });
}

export function uploadSinglePropertyImage(propertyId, file) {
  const form = new FormData();
  form.append("image", file);
  return api.post(`/property/uploadImage/${propertyId}`, form, {
    headers: { "Content-Type": "multipart/form-data" },
  });
}

export function replaceImage(imageId, file) {
  const form = new FormData();
  form.append("image", file);
  return api.put(`/property/replaceImage/${imageId}`, form, {
    headers: { "Content-Type": "multipart/form-data" },
  });
}

export function deleteImage(imageId) {
  return api.delete(`/property/deleteImage/${imageId}`);
}

export function reorderImages(propertyId, newOrder) {
  return api.put(`/property/reorderImages/${propertyId}`, newOrder);
}

// =========================================
// 📩 ENQUIRIES
// =========================================
export function sendEnquiry(data) {
  return api.post("/enquiry/add", data);
}

export function getAllEnquiries(page = 0, size = 20) {
  return api.get(`/enquiry/all?page=${page}&size=${size}`);
}

export function getEnquiriesByProperty(propertyId, page = 0, size = 20) {
  return api.get(`/enquiry/property/${propertyId}?page=${page}&size=${size}`);
}
export function deleteEnquiry(id) {
  return api.delete(`/enquiry/${id}`);
}


// =========================================
// 🏗 PROJECT API (PERFECTLY FIXED)
// =========================================

// GET all projects
export const getProjects = (page = 0, size = 20) =>
  api.get(`/project/all?page=${page}&size=${size}&sort=projectId,desc`);

// GET project by ID
export const getProjectById = (id) => api.get(`/project/${id}`);

// CREATE project
export const createProject = (body) => api.post(`/project/add`, body);

// UPDATE project
export const updateProject = (id, body) =>
  api.put(`/project/update/${id}`, body);

// DELETE project
export const deleteProject = (id) => api.delete(`/project/delete/${id}`);

// UPDATE project status
export const updateProjectStatus = (id, status) =>
  api.put(`/project/updateStatus/${id}?status=${status}`);

// GET ALL IMAGES FOR PROJECT
export const getProjectImages = (projectId) =>
  api.get(`/project/getImages/${projectId}`);

// UPLOAD SINGLE PROJECT IMAGE
export const uploadProjectImage = (projectId, file) => {
  const form = new FormData();
  form.append("image", file);
  return api.post(`/project/uploadImage/${projectId}`, form, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

// UPLOAD MULTIPLE IMAGES
export const uploadProjectImages = (projectId, files) => {
  const form = new FormData();
  files.forEach((f) => form.append("images", f));
  return api.post(`/project/uploadImages/${projectId}`, form, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

// DELETE PROJECT IMAGE
export const deleteProjectImage = (imageId) =>
  api.delete(`/project/deleteImage/${imageId}`);

export default api;
