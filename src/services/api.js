const BASE = process.env.REACT_APP_BE_APP_API_BASE_URL;
const SESSION_KEY = 'urbex-store-session';

const getAuthHeaders = () => {
  const session = JSON.parse(localStorage.getItem(SESSION_KEY) || 'null');
  const headers = { accept: 'application/json' };
  if (session?.token) headers['Authorization'] = `Bearer ${session.token}`;
  return headers;
};

const get = async (url, useAuth = false) => {
  const response = await fetch(`${BASE}${url}`, {
    headers: useAuth || url.startsWith('/api/auth/') ? getAuthHeaders() : { accept: 'application/json' },
  });
  if (!response.ok) throw new Error(`GET ${url} failed: ${response.status}`);
  return response.json();
};

const post = async (url, body, useAuth = false) => {
  const response = await fetch(`${BASE}${url}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...(useAuth || url.startsWith('/api/auth/') ? getAuthHeaders() : {}) },
    body: JSON.stringify(body),
  });
  if (!response.ok) throw new Error(`POST ${url} failed: ${response.status}`);
  return response.json();
};

const del = async (url, useAuth = false) => {
  const response = await fetch(`${BASE}${url}`, {
    method: 'DELETE',
    headers: useAuth ? getAuthHeaders() : { accept: 'application/json' },
  });
  if (!response.ok) throw new Error(`DELETE ${url} failed: ${response.status}`);
  return response.json();
};

const uploadImage = async (file) => {
  const formData = new FormData();
  formData.append('image', file);
  const response = await fetch(`${BASE}/api/upload/`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: formData,
  });
  if (!response.ok) throw new Error('Image upload failed');
  const data = await response.json();
  return data.imageUrl;
};

export const api = {
  // Product
  getProducts: () => get('/api/product'),
  getProductsAll: () => get('/api/product/all'),
  saveProduct: (data) => post('/api/product/saveOrUpdateProduct', data),

  // Category
  saveCategory: (data) => post('/api/product/saveOrUpdateCategory', data),

  // Subcategory
  saveSubCategory: (data) => post('/api/product/saveOrUpdateSubCategory', data),

  // Service Type
  saveServiceType: (data) => post('/api/product/saveOrUpdateServicType', data),

  // Brand
  saveBrand: (data) => post('/api/product/saveOrUpdateBrand', data),

  // Service Details
  getServiceDetails: (serviceIds) =>
    get(`/api/service/details?serviceIds=${serviceIds.join(',')}`),
  getServiceDetail: (serviceId) =>
    get(`/api/service/${serviceId}/details`),
  saveServiceDetails: (serviceId, data) =>
    post(`/api/service/${serviceId}/saveOrUpdatedetails`, data),

  // Upload
  uploadImage,

  // Store Products
  getStoreProducts: () => get('/api/store/products'),
  saveStoreProduct: (data) => post('/api/store/product', data),
  deleteStoreProduct: (id) => del(`/api/store/product/${id}`),

  // Auth
  register: async (data) => {
    const result = await post('/api/auth/register', data);
    if (result.token) localStorage.setItem(SESSION_KEY, JSON.stringify({ token: result.token, userId: result.user.id, name: result.user.name, email: result.user.email, mobile: result.user.mobile || '', role: result.user.role }));
    return result;
  },
  login: async (email, password) => {
    const result = await post('/api/auth/login', { email, password });
    if (result.token) localStorage.setItem(SESSION_KEY, JSON.stringify({ token: result.token, userId: result.user.id, name: result.user.name, email: result.user.email, mobile: result.user.mobile || '', role: result.user.role }));
    return result;
  },
  logout: () => {
    localStorage.removeItem(SESSION_KEY);
  },
  getSession: () => {
    const session = JSON.parse(localStorage.getItem(SESSION_KEY) || 'null');
    if (session) return { userId: session.userId, name: session.name, email: session.email, mobile: session.mobile, role: session.role };
    return null;
  },

  // Cart
  getCart: (userId) => get(`/api/cart?userId=${userId}`, true),
  saveCart: (userId, items) => post('/api/cart/save', { userId, items }, true),

  // Orders
  placeOrder: (data) => post('/api/orders', data, true),
  getOrders: (userId) => get(userId ? `/api/orders?userId=${userId}` : '/api/orders', true),
  updateOrderStatus: (orderId, status, address, contact) =>
    post('/api/orders/status', { orderId, status, address, contact }, true),
};

export default api;
