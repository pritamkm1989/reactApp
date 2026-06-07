import React, { useState, useEffect } from "react";
import { FiPlus, FiUpload, FiEdit3, FiRefreshCw, FiX } from "react-icons/fi";
import axios from "axios";
import { uploadImage } from '../services/ImageUpload';
import AdminServiceDetail from './AdminServiceDetail';
import { Button, Card, Badge, LoadingOverlay, Modal, Input } from './ui';

const AdminProduct = () => {
  const [products, setProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const [loading, setLoading] = useState(false);
  const [subCategoryId, setSubCategoryId] = useState(null);
  const [uploadedImages, setUploadedImages] = useState({});
  const [isServiceDtlModalOpen, setisServiceDtlModalOpen] = useState(false);
  const [serviceDetail, setServiceDetail] = useState(null);
  const [serviceId, setServiceId] = useState(null);
  const [newSubCategory, setNewSubCategory] = useState('');

  // Dialog state
  const [dialog, setDialog] = useState({ open: false, action: null, productId: null });

  useEffect(() => {
    setLoading(true);
    axios.get(`${process.env.REACT_APP_BE_APP_API_BASE_URL}/api/product/all`)
      .then(response => {
        setProducts(response.data);
        if (selectedCategory) {
          const updated = response.data
            .find(p => p.id === selectedProductId)
            ?.categories.find(c => c.id === selectedCategory.id);
          setSelectedCategory(updated);
        }
      })
      .catch(error => console.error("Error fetching product:", error))
      .finally(() => setLoading(false));
  }, [refreshKey]);

  const apiPost = async (url, body) => {
    setLoading(true);
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      return await response.json();
    } catch (error) {
      console.error(`Error in API call: ${url}`, error);
    } finally {
      setLoading(false);
    }
  };

  const openServiceModal = async (id, isActive) => {
    setServiceId(id);
    let details = await apiGet(`${process.env.REACT_APP_BE_APP_API_BASE_URL}/api/service/${id}/details`);
    if (!details) details = { isActive };
    else details.isActive = isActive;
    setServiceDetail(details);
    setisServiceDtlModalOpen(true);
  };

  const apiGet = async (url) => {
    setLoading(true);
    try {
      const response = await axios.get(url);
      return response.data;
    } catch (error) {
      console.error("Error fetching:", error);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const closeModal = () => {
    setisServiceDtlModalOpen(false);
    setServiceDetail(null);
    setRefreshKey(k => k + 1);
  };

  const handleFileChange = async (event, subcategoryId) => {
    const file = event.target.files[0];
    if (!file) return;
    const validFormats = ["image/png", "image/jpeg", "image/jpg"];
    if (!validFormats.includes(file.type)) {
      alert("Invalid file type. Only PNG and JPEG are allowed.");
      return;
    }
    const imagePath = await uploadImage(file);
    if (imagePath) {
      setUploadedImages(prev => ({ ...prev, [subcategoryId]: imagePath }));
    }
  };

  const submitDialog = async () => {
    const val = dialog.action;
    if (val === 'PRODUCT') await apiPost(`${process.env.REACT_APP_BE_APP_API_BASE_URL}/api/product/saveOrUpdateProduct`, { name: dialog.inputValue });
    if (val === 'CATEGORY') await apiPost(`${process.env.REACT_APP_BE_APP_API_BASE_URL}/api/product/saveOrUpdateCategory`, { name: dialog.inputValue, productId: dialog.productId });
    if (val === 'SERVICE_TYPE') await apiPost(`${process.env.REACT_APP_BE_APP_API_BASE_URL}/api/product/saveOrUpdateServicType`, { serviceType: dialog.inputValue, isActive: true, subCategoryId });
    if (val === 'BRAND') await apiPost(`${process.env.REACT_APP_BE_APP_API_BASE_URL}/api/product/saveOrUpdateBrand`, { brandName: dialog.inputValue, isActive: true, subCategoryId });
    setDialog({ open: false, action: null, productId: null, inputValue: '' });
    setRefreshKey(k => k + 1);
  };

  const changeStatus = async (productId, status, action) => {
    await apiPost(`${process.env.REACT_APP_BE_APP_API_BASE_URL}/api/product/saveOrUpdateProduct`, { id: productId, [action]: !status });
    setRefreshKey(k => k + 1);
  };

  const changeCategoryStatus = async (categoryId, status, action) => {
    await apiPost(`${process.env.REACT_APP_BE_APP_API_BASE_URL}/api/product/saveOrUpdateCategory`, { id: categoryId, [action]: !status });
    setRefreshKey(k => k + 1);
  };

  const toggleSubCategory = async (subcategoryId, isActive) => {
    const subCategory = selectedCategory?.subcategories.find(s => s.id === subcategoryId);
    if (!isActive && (subCategory?.serviceTypes?.length < 1 || !subCategory?.imageUrl)) {
      return alert("Add some service types & a display image before activating.");
    }
    await apiPost(`${process.env.REACT_APP_BE_APP_API_BASE_URL}/api/product/saveOrUpdateSubCategory`, { id: subcategoryId, isActive: !isActive });
    setRefreshKey(k => k + 1);
  };

  const updateImage = async (subcategoryId) => {
    await apiPost(`${process.env.REACT_APP_BE_APP_API_BASE_URL}/api/product/saveOrUpdateSubCategory`, { id: subcategoryId, imageUrl: uploadedImages[subcategoryId] });
    setRefreshKey(k => k + 1);
  };

  const handleNewSubcategoryClick = async () => {
    if (newSubCategory.length < 3 || newSubCategory.length > 50) {
      return alert('Subcategory name should be between 3 and 50 characters.');
    }
    await apiPost(`${process.env.REACT_APP_BE_APP_API_BASE_URL}/api/product/saveOrUpdateSubCategory`, { categoryId: selectedCategory.id, name: newSubCategory });
    setNewSubCategory('');
    setRefreshKey(k => k + 1);
  };

  return (
    <LoadingOverlay loading={loading}>
      <div className="space-y-6">
        {/* Input Dialog */}
        <Modal isOpen={dialog.open} onClose={() => setDialog({ open: false, action: null, productId: null, inputValue: '' })} title={`Add ${dialog.action}`} size="sm">
          <div className="space-y-4">
            <Input
              placeholder="Enter name..."
              value={dialog.inputValue || ''}
              onChange={(e) => setDialog(prev => ({ ...prev, inputValue: e.target.value }))}
              autoFocus
            />
            <div className="flex gap-2 justify-end">
              <Button variant="secondary" onClick={() => setDialog({ open: false, action: null, productId: null, inputValue: '' })}>Cancel</Button>
              <Button variant="primary" onClick={submitDialog}>Submit</Button>
            </div>
          </div>
        </Modal>

        {/* Products Table */}
        <Card padding={false}>
          <div className="p-5 pb-0 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-surface-900">Products</h2>
            <button onClick={() => setRefreshKey(k => k + 1)} className="p-1.5 rounded-lg text-surface-400 hover:text-primary-500 hover:bg-surface-100 transition-colors" title="Refresh">
              <FiRefreshCw size={16} />
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-surface-50 text-surface-500 text-xs font-semibold uppercase tracking-wider">
                  <th className="text-left px-5 py-3">#</th>
                  <th className="text-left px-5 py-3">Product</th>
                  <th className="text-left px-5 py-3">Home Page</th>
                  <th className="text-left px-5 py-3">Categories</th>
                  <th className="text-left px-5 py-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-100">
                {products.map((product, index) => (
                  <tr key={product.id} className="hover:bg-surface-50/50 transition-colors">
                    <td className="px-5 py-3 text-surface-500">{index + 1}</td>
                    <td className="px-5 py-3 font-medium text-surface-900">{product.name}</td>
                    <td className="px-5 py-3">
                      <Badge variant={product.homePageEnabled ? 'active' : 'inactive'}>
                        {product.homePageEnabled ? 'Active' : 'Inactive'}
                      </Badge>
                      <button onClick={() => changeStatus(product.id, product.homePageEnabled, 'homePageEnabled')} className="ml-1.5 text-surface-400 hover:text-primary-500">
                        <FiRefreshCw size={12} />
                      </button>
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex flex-wrap gap-1.5">
                        {product.categories.map(sub => (
                          <button
                            key={sub.id}
                            onClick={() => { setSelectedCategory(sub); setSelectedProductId(product.id); }}
                            className="inline-flex items-center px-2.5 py-0.5 text-xs font-medium rounded-full bg-surface-100 text-surface-600 hover:bg-primary-100 hover:text-primary-700 transition-colors"
                          >
                            {sub.name}
                          </button>
                        ))}
                        {product.isActive && (
                          <button onClick={() => setDialog({ open: true, action: 'CATEGORY', productId: product.id, inputValue: '' })} className="inline-flex items-center px-2.5 py-0.5 text-xs font-medium rounded-full bg-primary-100 text-primary-600 hover:bg-primary-200 transition-colors">
                            <FiPlus size={12} className="mr-0.5" /> Add
                          </button>
                        )}
                      </div>
                    </td>
                    <td className="px-5 py-3">
                      <Badge variant={product.isActive ? 'active' : 'inactive'}>
                        {product.isActive ? 'Active' : 'Inactive'}
                      </Badge>
                      <button onClick={() => changeStatus(product.id, product.isActive, 'isActive')} className="ml-1.5 text-surface-400 hover:text-primary-500">
                        <FiRefreshCw size={12} />
                      </button>
                    </td>
                  </tr>
                ))}
                <tr className="bg-surface-50/50">
                  <td className="px-5 py-3 text-surface-500">{products.length + 1}</td>
                  <td className="px-5 py-3">
                    <Button size="sm" variant="outline" onClick={() => setDialog({ open: true, action: 'PRODUCT', productId: null, inputValue: '' })}>
                      <FiPlus size={14} /> Add Product
                    </Button>
                  </td>
                  <td></td>
                  <td></td>
                  <td></td>
                </tr>
              </tbody>
            </table>
          </div>
        </Card>

        {/* Selected Category Details */}
        {selectedCategory && (
          <Card padding={false}>
            <div className="p-5 pb-0 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-semibold text-surface-900">
                  Category: {selectedCategory.name}
                </h2>
                <Badge variant={selectedCategory.isActive ? 'active' : 'inactive'}>
                  {selectedCategory.isActive ? 'Active' : 'Inactive'}
                </Badge>
                <button onClick={() => changeCategoryStatus(selectedCategory.id, selectedCategory.isActive, 'isActive')} className="text-surface-400 hover:text-primary-500">
                  <FiRefreshCw size={12} />
                </button>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-surface-50 text-surface-500 text-xs font-semibold uppercase tracking-wider">
                    <th className="text-left px-5 py-3">#</th>
                    <th className="text-left px-5 py-3">Subcategory</th>
                    <th className="text-left px-5 py-3">Service Types</th>
                    <th className="text-left px-5 py-3">Brands</th>
                    <th className="text-left px-5 py-3">Image</th>
                    <th className="text-left px-5 py-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-surface-100">
                  {selectedCategory.subcategories.map((sub, i) => (
                    <tr key={sub.id} className="hover:bg-surface-50/50 transition-colors">
                      <td className="px-5 py-3 text-surface-500">{i + 1}</td>
                      <td className="px-5 py-3 font-medium text-surface-900">{sub.name}</td>
                      <td className="px-5 py-3">
                        <div className="flex flex-wrap gap-1.5">
                          {sub.serviceTypes.map(st => (
                            <button
                              key={st.id}
                              onClick={() => openServiceModal(st.id, st.isActive)}
                              className="inline-flex items-center px-2.5 py-0.5 text-xs font-medium rounded-full bg-surface-100 text-surface-600 hover:bg-primary-100 hover:text-primary-700 transition-colors"
                            >
                              {st.serviceType}
                            </button>
                          ))}
                          <button onClick={() => { setDialog({ open: true, action: 'SERVICE_TYPE', inputValue: '' }); setSubCategoryId(sub.id); }} className="inline-flex items-center px-2.5 py-0.5 text-xs font-medium rounded-full bg-primary-100 text-primary-600 hover:bg-primary-200 transition-colors">
                            <FiPlus size={12} className="mr-0.5" /> Add
                          </button>
                        </div>
                      </td>
                      <td className="px-5 py-3">
                        <div className="flex flex-wrap gap-1.5">
                          {sub.brands.map(brand => (
                            <span key={brand.brandName} className="inline-flex items-center px-2.5 py-0.5 text-xs font-medium rounded-full bg-surface-100 text-surface-600">
                              {brand.brandName}
                            </span>
                          ))}
                          <button onClick={() => { setDialog({ open: true, action: 'BRAND', inputValue: '' }); setSubCategoryId(sub.id); }} className="inline-flex items-center px-2.5 py-0.5 text-xs font-medium rounded-full bg-primary-100 text-primary-600 hover:bg-primary-200 transition-colors">
                            <FiPlus size={12} className="mr-0.5" /> Add
                          </button>
                        </div>
                      </td>
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-2">
                          {(uploadedImages[sub.id] || sub.imageUrl) && (
                            <img src={uploadedImages[sub.id] || sub.imageUrl} alt="" className="w-10 h-10 rounded-lg object-cover border border-surface-200" />
                          )}
                          <label className="cursor-pointer p-1.5 rounded-lg text-surface-400 hover:text-primary-500 hover:bg-primary-50 transition-colors">
                            <FiUpload size={14} />
                            <input type="file" className="hidden" accept="image/*" onChange={(e) => handleFileChange(e, sub.id)} />
                          </label>
                        </div>
                      </td>
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-1.5">
                          <Badge variant={sub.isActive ? 'active' : 'inactive'}>
                            {sub.isActive ? 'Active' : 'Inactive'}
                          </Badge>
                          <button onClick={() => toggleSubCategory(sub.id, sub.isActive)} className="text-surface-400 hover:text-primary-500">
                            <FiRefreshCw size={12} />
                          </button>
                          {uploadedImages[sub.id] && (
                            <Button size="sm" variant="ghost" onClick={() => updateImage(sub.id)}>
                              Save Image
                            </Button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                  {/* Add new subcategory row */}
                  <tr className="bg-surface-50/30">
                    <td className="px-5 py-3 text-surface-500">{selectedCategory.subcategories.length + 1}</td>
                    <td className="px-5 py-3">
                      <Input
                        placeholder="Subcategory name"
                        value={newSubCategory}
                        onChange={(e) => setNewSubCategory(e.target.value)}
                        className="text-sm"
                      />
                    </td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td className="px-5 py-3">
                      <Button size="sm" variant="outline" onClick={handleNewSubcategoryClick}>
                        <FiPlus size={14} /> Add
                      </Button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </Card>
        )}

        {/* Service Detail Modal */}
        {isServiceDtlModalOpen && (
          <AdminServiceDetail serviceDetail={serviceDetail} closeModal={closeModal} serviceId={serviceId} />
        )}
      </div>
    </LoadingOverlay>
  );
};

export default AdminProduct;
