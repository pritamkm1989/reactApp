import React, { useState, useEffect } from "react";
import { FiPlus, FiEdit3, FiTrash2, FiUpload, FiRefreshCw } from "react-icons/fi";
import { Button, Card, Badge, Modal, Input, Img, ConfirmDialog } from './ui';
import { useToast } from './ui/Toast';
import api from '../services/api';

const StoreAdmin = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const addToast = useToast();

  const [modal, setModal] = useState({ open: false, edit: null });
  const [form, setForm] = useState({ name: '', description: '', category: '', price: '', discount: '', imageUrl: '', stock: '', isActive: true });
  const [deleteId, setDeleteId] = useState(null);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const data = await api.getStoreProducts();
      setProducts(data || []);
    } catch {
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchProducts(); }, []);

  const openAdd = () => {
    setForm({ name: '', description: '', category: '', price: '', discount: '', imageUrl: '', stock: '', isActive: true });
    setModal({ open: true, edit: null });
  };

  const openEdit = (product) => {
    setForm({ ...product });
    setModal({ open: true, edit: product.id });
  };

  const closeModal = () => setModal({ open: false, edit: null });

  const handleSubmit = async () => {
    if (!form.name || !form.price) {
      addToast('Name and price are required.', 'error');
      return;
    }
    try {
      await api.saveStoreProduct(modal.edit ? { ...form, id: modal.edit } : form);
      addToast(modal.edit ? 'Product updated.' : 'Product added.', 'success');
      closeModal();
      fetchProducts();
    } catch {
      addToast('Failed to save product.', 'error');
    }
  };

  const handleDelete = async () => {
    try {
      await api.deleteStoreProduct(deleteId);
      setDeleteId(null);
      addToast('Product removed.', 'success');
      fetchProducts();
    } catch {
      addToast('Failed to delete product.', 'error');
    }
  };

  const toggleActive = async (id) => {
    const product = products.find(p => p.id === id);
    if (!product) return;
    try {
      await api.saveStoreProduct({ ...product, isActive: !product.isActive });
      fetchProducts();
    } catch {
      addToast('Failed to update status.', 'error');
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!["image/png", "image/jpeg", "image/jpg"].includes(file.type))
      return addToast('Only PNG and JPEG allowed.', 'error');
    const reader = new FileReader();
    reader.onload = (ev) => setForm(prev => ({ ...prev, imageUrl: ev.target.result }));
    reader.readAsDataURL(file);
  };

  return (
    <div className="space-y-6">
      <Card padding={false}>
        <div className="p-5 pb-0 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-surface-900 dark:text-white">Store Products</h2>
          <div className="flex gap-2">
            <button onClick={fetchProducts}
              className="p-1.5 rounded-lg text-surface-400 hover:text-primary-500 hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors" title="Refresh">
              <FiRefreshCw size={16} />
            </button>
            <Button size="sm" variant="outline" onClick={openAdd}>
              <FiPlus size={14} /> Add Product
            </Button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-surface-50 dark:bg-surface-800/50 text-surface-500 dark:text-surface-400 text-xs font-semibold uppercase tracking-wider">
                <th className="text-left px-5 py-3">#</th>
                <th className="text-left px-5 py-3">Image</th>
                <th className="text-left px-5 py-3">Name</th>
                <th className="text-left px-5 py-3">Category</th>
                <th className="text-left px-5 py-3">Price</th>
                <th className="text-left px-5 py-3">Stock</th>
                <th className="text-left px-5 py-3">Status</th>
                <th className="text-left px-5 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-100 dark:divide-surface-700">
              {products.map((p, i) => (
                <tr key={p.id} className="hover:bg-surface-50/50 dark:hover:bg-surface-800/30 transition-colors">
                  <td className="px-5 py-3 text-surface-500">{i + 1}</td>
                  <td className="px-5 py-3">
                    {p.imageUrl ? (
                      <Img src={p.imageUrl} alt="" className="w-10 h-10 rounded-lg object-cover border border-surface-200 dark:border-surface-600" />
                    ) : (
                      <div className="w-10 h-10 rounded-lg bg-surface-100 dark:bg-surface-700" />
                    )}
                  </td>
                  <td className="px-5 py-3 font-medium text-surface-900 dark:text-surface-100">{p.name}</td>
                  <td className="px-5 py-3 text-surface-600 dark:text-surface-400">{p.category || '—'}</td>
                  <td className="px-5 py-3 text-surface-700 dark:text-surface-300">
                    ₹{p.price}{p.discount ? <span className="text-success text-xs ml-1">({p.discount}% off)</span> : ''}
                  </td>
                  <td className="px-5 py-3 text-surface-600 dark:text-surface-400">{p.stock ?? '—'}</td>
                  <td className="px-5 py-3">
                    <button onClick={() => toggleActive(p.id)}>
                      <Badge variant={p.isActive ? 'active' : 'inactive'}>{p.isActive ? 'Active' : 'Inactive'}</Badge>
                    </button>
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-1">
                      <button onClick={() => openEdit(p)}
                        className="p-1.5 rounded-lg text-surface-400 hover:text-primary-500 hover:bg-primary-50 dark:hover:bg-primary-900/30 transition-colors" title="Edit">
                        <FiEdit3 size={14} />
                      </button>
                      <button onClick={() => setDeleteId(p.id)}
                        className="p-1.5 rounded-lg text-surface-400 hover:text-error hover:bg-error/10 transition-colors" title="Delete">
                        <FiTrash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {!loading && products.length === 0 && (
                <tr>
                  <td colSpan={8} className="px-5 py-12 text-center text-surface-400 dark:text-surface-500">
                    No products yet. Click "Add Product" to get started.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      <Modal isOpen={modal.open} onClose={closeModal} title={modal.edit ? 'Edit Product' : 'Add Product'} size="md">
        <div className="space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <Input label="Product Name" value={form.name}
              onChange={(e) => setForm(prev => ({ ...prev, name: e.target.value }))} placeholder="e.g. Rohu Fish" />
            <Input label="Category" value={form.category}
              onChange={(e) => setForm(prev => ({ ...prev, category: e.target.value }))} placeholder="e.g. Fish" />
          </div>
          <Input label="Description" value={form.description}
            onChange={(e) => setForm(prev => ({ ...prev, description: e.target.value }))} placeholder="Brief description..." />
          <div className="grid sm:grid-cols-3 gap-4">
            <Input label="Price (₹)" type="number" value={form.price}
              onChange={(e) => setForm(prev => ({ ...prev, price: e.target.value }))} placeholder="0" />
            <Input label="Discount (%)" type="number" value={form.discount}
              onChange={(e) => setForm(prev => ({ ...prev, discount: e.target.value }))} placeholder="0" />
            <Input label="Stock" type="number" value={form.stock}
              onChange={(e) => setForm(prev => ({ ...prev, stock: e.target.value }))} placeholder="0" />
          </div>
          <div>
            <p className="text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">Image</p>
            <div className="flex items-center gap-3">
              {form.imageUrl && (
                <Img src={form.imageUrl} alt="" className="w-16 h-16 rounded-lg object-cover border border-surface-200 dark:border-surface-600" />
              )}
              <label className="flex items-center gap-2 px-3 py-2 bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 text-sm font-medium rounded-xl cursor-pointer hover:bg-primary-100 dark:hover:bg-primary-900/50 transition-colors border border-primary-200 dark:border-primary-800">
                <FiUpload size={14} /> Upload
                <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
              </label>
            </div>
          </div>
          <div className="flex gap-2 justify-end pt-2">
            <Button variant="secondary" onClick={closeModal}>Cancel</Button>
            <Button variant="primary" onClick={handleSubmit}>{modal.edit ? 'Update' : 'Add'}</Button>
          </div>
        </div>
      </Modal>

      <ConfirmDialog
        isOpen={deleteId !== null}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Delete Product"
        message="Are you sure you want to delete this product?"
        confirmLabel="Delete"
      />
    </div>
  );
};

export default StoreAdmin;
