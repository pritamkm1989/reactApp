const BASE = process.env.REACT_APP_BE_APP_API_BASE_URL;

const get = async (url) => {
  const response = await fetch(`${BASE}${url}`, {
    headers: { accept: 'application/json' },
  });
  if (!response.ok) throw new Error(`GET ${url} failed: ${response.status}`);
  return response.json();
};

const post = async (url, body) => {
  const response = await fetch(`${BASE}${url}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!response.ok) throw new Error(`POST ${url} failed: ${response.status}`);
  return response.json();
};

const uploadImage = async (file) => {
  const formData = new FormData();
  formData.append('image', file);
  const response = await fetch(`${BASE}/api/upload/`, {
    method: 'POST',
    headers: { accept: 'application/json' },
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
};

export default api;
