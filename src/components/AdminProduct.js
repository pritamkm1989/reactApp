import React, { useState, useEffect } from "react";
import { FiPlus, FiUpload, FiRefreshCw, FiChevronRight } from "react-icons/fi";
import api from '../services/api';
import AdminServiceDetail from './AdminServiceDetail';
import { Button, Card, Badge, LoadingOverlay, Modal, Input, Img } from './ui';
import { useToast } from './ui/Toast';

const views = { PRODUCTS: 'products', CATEGORIES: 'categories', SUBCATEGORIES: 'subcategories' };

const AdminProduct = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const addToast = useToast();

  // Navigation
  const [view, setView] = useState(views.PRODUCTS);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);

  // Subcategory management
  const [uploadedImages, setUploadedImages] = useState({});
  const [newSubCategory, setNewSubCategory] = useState('');

  // Service detail modal
  const [serviceModal, setServiceModal] = useState({ open: false, serviceId: null, isActive: false });

  // Generic input dialog
  const [dialog, setDialog] = useState({ open: false, action: null, extra: null });

  useEffect(() => {
    setLoading(true);
    api.getProductsAll()
      .then(data => {
        setProducts(data);
        const pid = selectedProductId;
        const cid = selectedCategoryId;
        if (pid) {
          const fresh = data.find(p => p.id === pid);
          if (fresh) setSelectedProduct(fresh);
          if (cid && fresh) {
            const cat = fresh.categories.find(c => c.id === cid);
            if (cat) setSelectedCategory(cat);
          }
        }
      })
      .catch(err => console.error("Error fetching products:", err))
      .finally(() => setLoading(false));
  }, [refreshKey, selectedProductId, selectedCategoryId]);

  const refresh = () => setRefreshKey(k => k + 1);

  const openDialog = (action, extra = null) => setDialog({ open: true, action, extra, inputValue: '' });
  const closeDialog = () => setDialog({ open: false, action: null, extra: null, inputValue: '' });

  const submitDialog = async () => {
    const { action, extra, inputValue } = dialog;
    try {
      if (action === 'PRODUCT') await api.saveProduct({ name: inputValue });
      if (action === 'CATEGORY') await api.saveCategory({ name: inputValue, productId: extra });
      if (action === 'SUBCATEGORY') await api.saveSubCategory({ name: inputValue, categoryId: extra });
      if (action === 'SERVICE_TYPE') await api.saveServiceType({ serviceType: inputValue, isActive: true, subCategoryId: extra });
      if (action === 'BRAND') await api.saveBrand({ brandName: inputValue, isActive: true, subCategoryId: extra });
    } catch (err) {
      console.error(err);
    }
    closeDialog();
    refresh();
  };

  const toggleProductStatus = async (product, field) => {
    await api.saveProduct({ id: product.id, [field]: !product[field] });
    refresh();
  };

  const toggleCategoryStatus = async (category) => {
    if (!category.isActive) {
      const activeSubs = category.subcategories?.filter(s => s.isActive) || [];
      if (activeSubs.length === 0) {
        addToast('Activate at least one subcategory before activating this category.', 'error');
        return;
      }
    }
    await api.saveCategory({ id: category.id, isActive: !category.isActive });
    addToast(`Category ${category.isActive ? 'deactivated' : 'activated'}.`, 'success');
    refresh();
  };

  const toggleSubCategory = async (sub) => {
    if (!sub.isActive) {
      const activeServiceTypes = sub.serviceTypes?.filter(st => st.isActive) || [];
      const activeBrands = sub.brands?.filter(b => b.isActive) || [];
      const missing = [];
      if (activeServiceTypes.length === 0) missing.push('at least one active service type');
      if (activeBrands.length === 0) missing.push('at least one active brand');
      if (!sub.imageUrl) missing.push('a display image');
      if (missing.length > 0) {
        addToast(`Cannot activate: add ${missing.join(', ')} first.`, 'error');
        return;
      }
    }
    await api.saveSubCategory({ id: sub.id, isActive: !sub.isActive });
    addToast(`Subcategory ${sub.isActive ? 'deactivated' : 'activated'}.`, 'success');
    refresh();
  };

  const handleFileChange = async (e, subId) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!["image/png", "image/jpeg", "image/jpg"].includes(file.type))
      return addToast("Only PNG and JPEG allowed.", 'error');
    const imagePath = await api.uploadImage(file);
    if (imagePath) setUploadedImages(prev => ({ ...prev, [subId]: imagePath }));
  };

  const saveSubImage = async (subId) => {
    await api.saveSubCategory({ id: subId, imageUrl: uploadedImages[subId] });
    setUploadedImages(prev => { const { [subId]: _, ...rest } = prev; return rest; });
    refresh();
  };

  const handleAddSubcategory = async () => {
    if (newSubCategory.length < 3 || newSubCategory.length > 50)
      return addToast('Subcategory name must be 3-50 characters.', 'error');
    await api.saveSubCategory({ categoryId: selectedCategory.id, name: newSubCategory });
    setNewSubCategory('');
    refresh();
  };

  const openServiceModal = async (serviceId, isActive) => {
    let details = null;
    try {
      details = await api.getServiceDetail(serviceId);
    } catch (_) { }
    if (!details) details = { isActive };
    else details.isActive = isActive;
    setServiceModal({ open: true, serviceId, detail: details });
  };

  const closeServiceModal = () => {
    setServiceModal({ open: false, serviceId: null, detail: null });
    refresh();
  };

  const goToCategories = (product) => {
    setSelectedProduct(product);
    setSelectedProductId(product.id);
    setSelectedCategory(null);
    setSelectedCategoryId(null);
    setView(views.CATEGORIES);
  };

  const goToSubcategories = (category) => {
    setSelectedCategory(category);
    setSelectedCategoryId(category.id);
    setView(views.SUBCATEGORIES);
  };

  // ───────────── Render Helpers ─────────────

  const Breadcrumb = () => (
    <div className="flex items-center gap-1.5 text-sm text-surface-500 mb-4">
      {view !== views.PRODUCTS && (
        <button onClick={() => { setView(views.PRODUCTS); setSelectedProduct(null); setSelectedCategory(null); setSelectedProductId(null); setSelectedCategoryId(null); }}
          className="hover:text-primary-600 transition-colors font-medium">
          Products
        </button>
      )}
      {view === views.CATEGORIES || view === views.SUBCATEGORIES ? (
        <>
          <FiChevronRight size={14} />
          <button onClick={() => goToCategories(selectedProduct)}
            className={`transition-colors font-medium ${view === views.SUBCATEGORIES ? 'hover:text-primary-600' : 'text-surface-900 dark:text-white'}`}>
            {selectedProduct?.name}
          </button>
        </>
      ) : (
        <span className="text-surface-900 dark:text-white font-medium">Products</span>
      )}
      {view === views.SUBCATEGORIES && (
        <>
          <FiChevronRight size={14} />
          <span className="text-surface-900 dark:text-white font-medium">{selectedCategory?.name}</span>
        </>
      )}
    </div>
  );

  // ───────────── Products View ─────────────
  const renderProducts = () => (
    <Card padding={false}>
      <div className="p-5 pb-0 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-surface-900 dark:text-white">Products</h2>
        <div className="flex gap-2">
          <button onClick={refresh} className="p-1.5 rounded-lg text-surface-400 hover:text-primary-500 hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors" title="Refresh">
            <FiRefreshCw size={16} />
          </button>
          <Button size="sm" variant="outline" onClick={() => openDialog('PRODUCT')}>
            <FiPlus size={14} /> Add Product
          </Button>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-surface-50 dark:bg-surface-800/50 text-surface-500 dark:text-surface-400 text-xs font-semibold uppercase tracking-wider">
              <th className="text-left px-5 py-3">#</th>
              <th className="text-left px-5 py-3">Product</th>
              <th className="text-left px-5 py-3">Home</th>
              <th className="text-left px-5 py-3">Categories</th>
              <th className="text-left px-5 py-3">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-surface-100 dark:divide-surface-700">
            {products.map((p, i) => (
              <tr key={p.id} className="hover:bg-surface-50/50 dark:hover:bg-surface-800/30 transition-colors">
                <td className="px-5 py-3 text-surface-500">{i + 1}</td>
                <td className="px-5 py-3">
                  <button onClick={() => goToCategories(p)}
                    className="font-medium text-surface-900 dark:text-surface-100 hover:text-primary-600 transition-colors">
                    {p.name}
                  </button>
                </td>
                <td className="px-5 py-3">
                  <div className="flex items-center gap-1.5">
                    <Badge variant={p.homePageEnabled ? 'active' : 'inactive'}>
                      {p.homePageEnabled ? 'Active' : 'Inactive'}
                    </Badge>
                    <button onClick={() => toggleProductStatus(p, 'homePageEnabled')}
                      className="text-surface-400 hover:text-primary-500 transition-colors"
                      title="Toggle home page visibility">
                      <FiRefreshCw size={12} />
                    </button>
                  </div>
                </td>
                <td className="px-5 py-3">
                  <div className="flex flex-wrap gap-1.5">
                    {p.categories?.map(cat => (
                      <button key={cat.id} onClick={() => goToCategories(p)}
                        className="inline-flex items-center px-2.5 py-0.5 text-xs font-medium rounded-full bg-surface-100 dark:bg-surface-700 text-surface-600 dark:text-surface-300 hover:bg-primary-100 dark:hover:bg-primary-900/30 hover:text-primary-700 transition-colors">
                        {cat.name}
                      </button>
                    ))}
                    {p.isActive && (
                      <button onClick={() => openDialog('CATEGORY', p.id)}
                        className="inline-flex items-center px-2.5 py-0.5 text-xs font-medium rounded-full bg-primary-100 text-primary-600 hover:bg-primary-200 transition-colors">
                        <FiPlus size={12} className="mr-0.5" /> Add
                      </button>
                    )}
                  </div>
                </td>
                <td className="px-5 py-3">
                  <div className="flex items-center gap-1.5">
                    <Badge variant={p.isActive ? 'active' : 'inactive'}>{p.isActive ? 'Active' : 'Inactive'}</Badge>
                    <button onClick={() => toggleProductStatus(p, 'isActive')}
                      className="text-surface-400 hover:text-primary-500 transition-colors" title="Toggle status">
                      <FiRefreshCw size={12} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );

  // ───────────── Categories View ─────────────
  const renderCategories = () => (
    <Card padding={false}>
      <div className="p-5 pb-0 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-surface-900 dark:text-white">
          {selectedProduct?.name} — Categories
        </h2>
        <div className="flex gap-2">
          <button onClick={refresh} className="p-1.5 rounded-lg text-surface-400 hover:text-primary-500 hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors" title="Refresh">
            <FiRefreshCw size={16} />
          </button>
          <Button size="sm" variant="outline" onClick={() => openDialog('CATEGORY', selectedProduct?.id)}>
            <FiPlus size={14} /> Add
          </Button>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-surface-50 dark:bg-surface-800/50 text-surface-500 dark:text-surface-400 text-xs font-semibold uppercase tracking-wider">
              <th className="text-left px-5 py-3">#</th>
              <th className="text-left px-5 py-3">Name</th>
              <th className="text-left px-5 py-3">Subcategories</th>
              <th className="text-left px-5 py-3">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-surface-100 dark:divide-surface-700">
            {selectedProduct?.categories?.map((cat, i) => (
              <tr key={cat.id} className="hover:bg-surface-50/50 dark:hover:bg-surface-800/30 transition-colors">
                <td className="px-5 py-3 text-surface-500">{i + 1}</td>
                <td className="px-5 py-3">
                  <button onClick={() => goToSubcategories(cat)}
                    className="font-medium text-surface-900 dark:text-surface-100 hover:text-primary-600 transition-colors">
                    {cat.name}
                  </button>
                </td>
                <td className="px-5 py-3">
                  <div className="flex flex-wrap gap-1">
                    {cat.subcategories?.map(sub => (
                      <span key={sub.id}
                        className="inline-flex items-center px-2 py-0.5 text-xs font-medium rounded-full bg-surface-100 dark:bg-surface-700 text-surface-600 dark:text-surface-300">
                        {sub.name}
                      </span>
                    ))}
                  </div>
                </td>
                <td className="px-5 py-3">
                  <div className="flex items-center gap-1.5">
                    <Badge variant={cat.isActive ? 'active' : 'inactive'}>{cat.isActive ? 'Active' : 'Inactive'}</Badge>
                    <button onClick={() => toggleCategoryStatus(cat)}
                      className="text-surface-400 hover:text-primary-500 transition-colors" title="Toggle status">
                      <FiRefreshCw size={12} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );

  // ───────────── Subcategories View ─────────────
  const renderSubcategories = () => {
    const subs = selectedCategory?.subcategories || [];
    return (
      <Card padding={false}>
        <div className="p-5 pb-0 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-surface-900 dark:text-white">
            {selectedCategory?.name} — Subcategories
          </h2>
          <button onClick={refresh} className="p-1.5 rounded-lg text-surface-400 hover:text-primary-500 hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors" title="Refresh">
            <FiRefreshCw size={16} />
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-surface-50 dark:bg-surface-800/50 text-surface-500 dark:text-surface-400 text-xs font-semibold uppercase tracking-wider">
                <th className="text-left px-5 py-3">#</th>
                <th className="text-left px-5 py-3">Subcategory</th>
                <th className="text-left px-5 py-3">Service Types</th>
                <th className="text-left px-5 py-3">Brands</th>
                <th className="text-left px-5 py-3">Image</th>
                <th className="text-left px-5 py-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-100 dark:divide-surface-700">
              {subs.map((sub, i) => (
                <tr key={sub.id} className="hover:bg-surface-50/50 dark:hover:bg-surface-800/30 transition-colors">
                  <td className="px-5 py-3 text-surface-500">{i + 1}</td>
                  <td className="px-5 py-3 font-medium text-surface-900 dark:text-surface-100">{sub.name}</td>
                  <td className="px-5 py-3">
                    <div className="flex flex-wrap gap-1.5">
                      {sub.serviceTypes?.map(st => (
                        <button key={st.id}
                          onClick={() => openServiceModal(st.id, st.isActive)}
                          className="inline-flex items-center px-2.5 py-0.5 text-xs font-medium rounded-full bg-surface-100 dark:bg-surface-700 text-surface-600 dark:text-surface-300 hover:bg-primary-100 dark:hover:bg-primary-900/30 hover:text-primary-700 transition-colors">
                          {st.serviceType}
                        </button>
                      ))}
                      <button onClick={() => openDialog('SERVICE_TYPE', sub.id)}
                        className="inline-flex items-center px-2.5 py-0.5 text-xs font-medium rounded-full bg-primary-100 text-primary-600 hover:bg-primary-200 transition-colors">
                        <FiPlus size={12} className="mr-0.5" /> Add
                      </button>
                    </div>
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex flex-wrap gap-1.5">
                      {sub.brands?.map(b => (
                        <span key={b.brandName}
                          className="inline-flex items-center px-2.5 py-0.5 text-xs font-medium rounded-full bg-surface-100 dark:bg-surface-700 text-surface-600 dark:text-surface-300">
                          {b.brandName}
                        </span>
                      ))}
                      <button onClick={() => openDialog('BRAND', sub.id)}
                        className="inline-flex items-center px-2.5 py-0.5 text-xs font-medium rounded-full bg-primary-100 text-primary-600 hover:bg-primary-200 transition-colors">
                        <FiPlus size={12} className="mr-0.5" /> Add
                      </button>
                    </div>
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-2">
                      {(uploadedImages[sub.id] || sub.imageUrl) && (
                        <Img src={uploadedImages[sub.id] || sub.imageUrl} alt=""
                          className="w-10 h-10 rounded-lg object-cover border border-surface-200 dark:border-surface-600" />
                      )}
                      <label className="cursor-pointer p-1.5 rounded-lg text-surface-400 hover:text-primary-500 hover:bg-primary-50 dark:hover:bg-primary-900/30 transition-colors">
                        <FiUpload size={14} />
                        <input type="file" className="hidden" accept="image/*" onChange={(e) => handleFileChange(e, sub.id)} />
                      </label>
                    </div>
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-1.5">
                      <Badge variant={sub.isActive ? 'active' : 'inactive'}>{sub.isActive ? 'Active' : 'Inactive'}</Badge>
                      <button onClick={() => toggleSubCategory(sub)}
                        className="text-surface-400 hover:text-primary-500 transition-colors" title="Toggle status">
                        <FiRefreshCw size={12} />
                      </button>
                      {uploadedImages[sub.id] && (
                        <Button size="sm" variant="ghost" onClick={() => saveSubImage(sub.id)}>
                          Save Image
                        </Button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {/* Add new subcategory row */}
              <tr className="bg-surface-50/30 dark:bg-surface-800/20">
                <td className="px-5 py-3 text-surface-500">{subs.length + 1}</td>
                <td className="px-5 py-3">
                  <Input placeholder="Subcategory name" value={newSubCategory}
                    onChange={(e) => setNewSubCategory(e.target.value)} className="text-sm" />
                </td>
                <td></td>
                <td></td>
                <td></td>
                <td className="px-5 py-3">
                  <Button size="sm" variant="outline" onClick={handleAddSubcategory}>
                    <FiPlus size={14} /> Add
                  </Button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </Card>
    );
  };

  return (
    <LoadingOverlay loading={loading}>
      <div className="space-y-6">
        <Breadcrumb />

        <Modal isOpen={dialog.open} onClose={closeDialog}
          title={`Add ${dialog.action?.replace(/_/g, ' ').toLowerCase()}`} size="sm">
          <div className="space-y-4">
            <Input placeholder="Enter name..." value={dialog.inputValue || ''}
              onChange={(e) => setDialog(prev => ({ ...prev, inputValue: e.target.value }))} autoFocus />
            <div className="flex gap-2 justify-end">
              <Button variant="secondary" onClick={closeDialog}>Cancel</Button>
              <Button variant="primary" onClick={submitDialog}>Submit</Button>
            </div>
          </div>
        </Modal>

        {view === views.PRODUCTS && renderProducts()}
        {view === views.CATEGORIES && renderCategories()}
        {view === views.SUBCATEGORIES && renderSubcategories()}

        {serviceModal.open && (
          <AdminServiceDetail
            serviceDetail={serviceModal.detail}
            closeModal={closeServiceModal}
            serviceId={serviceModal.serviceId}
          />
        )}
      </div>
    </LoadingOverlay>
  );
};

export default AdminProduct;
