import React, { useContext, useState } from 'react';
import { CartContext } from '../CartContext';
import { FiTrash2, FiPackage, FiImage, FiShoppingBag } from 'react-icons/fi';
import { Button, Card, Badge, ConfirmDialog, Img } from './ui';
import { useToast } from './ui/Toast';

const CartComp = ({ isAdmin }) => {
  const { cart, removeItem, clearCart } = useContext(CartContext);
  const [removeIndex, setRemoveIndex] = useState(null);
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const addToast = useToast();

  const cartArray = Array.isArray(cart) ? cart : [];

  const handleRemove = (index) => {
    addToast('Removed from cart!', 'success');
    removeItem(index);
  };

  const handleClearCart = () => {
    clearCart();
    addToast('Cart cleared!', 'info');
  };

  if (cartArray.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-surface-100 dark:bg-surface-800 rounded-2xl mb-4">
          <FiPackage size={28} className="text-surface-400" />
        </div>
        <h2 className="text-xl font-semibold text-surface-700 dark:text-surface-200">Your cart is empty</h2>
        <p className="text-surface-500 dark:text-surface-400 mt-1 text-sm">Add some services to get started.</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header + Summary */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-surface-900 dark:text-white">
            {isAdmin ? 'Customer Orders' : 'Your Cart'}
          </h1>
          <p className="text-sm text-surface-500 dark:text-surface-400 mt-0.5">
            {cartArray.length} item{cartArray.length !== 1 ? 's' : ''}
          </p>
        </div>
        {!isAdmin && (
          <div className="flex items-center gap-2">
            <Button variant="secondary" size="sm" onClick={() => setShowClearConfirm(true)}>
              <FiTrash2 size={14} /> Clear All
            </Button>
          </div>
        )}
      </div>

      {/* Desktop Table */}
      <div className="hidden md:block">
        <div className="bg-white dark:bg-surface-800 rounded-2xl border border-surface-200 dark:border-surface-700 overflow-hidden shadow-soft">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-surface-50 dark:bg-surface-800/50 text-surface-500 dark:text-surface-400 text-xs font-semibold uppercase tracking-wider">
                  <th className="text-left px-4 py-3">#</th>
                  <th className="text-left px-4 py-3">Category</th>
                  <th className="text-left px-4 py-3">Subcategory</th>
                  <th className="text-left px-4 py-3">Type</th>
                  <th className="text-left px-4 py-3">Sub Type</th>
                  <th className="text-left px-4 py-3">Issue</th>
                  <th className="text-left px-4 py-3">Image</th>
                  {isAdmin && (
                    <>
                      <th className="text-left px-4 py-3">Address</th>
                      <th className="text-left px-4 py-3">Email</th>
                      <th className="text-left px-4 py-3">Mobile</th>
                      <th className="text-left px-4 py-3">Date</th>
                    </>
                  )}
                  {!isAdmin && <th className="text-left px-4 py-3">Action</th>}
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-100 dark:divide-surface-700">
                {cartArray.map((item, i) => (
                  <tr key={i} className="hover:bg-surface-50/50 dark:hover:bg-surface-700/30 transition-colors">
                    <td className="px-4 py-3 text-surface-500">{i + 1}</td>
                    <td className="px-4 py-3 font-medium text-surface-900 dark:text-surface-100">{item.category}</td>
                    <td className="px-4 py-3 text-surface-700 dark:text-surface-300">{item.subcategory?.name}</td>
                    <td className="px-4 py-3 text-surface-700 dark:text-surface-300">{item.type}</td>
                    <td className="px-4 py-3 text-surface-700 dark:text-surface-300">{item.brand || '—'}</td>
                    <td className="px-4 py-3 text-surface-600 dark:text-surface-400 max-w-[200px] truncate" title={item.issueDescription}>
                      {item.issueDescription || '—'}
                    </td>
                    <td className="px-4 py-3">
                      {item.uploadedImage ? (
                        <Img src={item.uploadedImage} alt="" className="w-10 h-10 rounded-lg object-cover border border-surface-200 dark:border-surface-600" />
                      ) : (
                        <span className="text-surface-300 dark:text-surface-600"><FiImage size={20} /></span>
                      )}
                    </td>
                    {isAdmin && (
                      <>
                        <td className="px-4 py-3 text-xs text-surface-600 dark:text-surface-400 max-w-[160px]">
                          {item.address?.street && <p>{item.address.street}</p>}
                          {item.address?.landmark && <p className="text-surface-400">{item.address.landmark}</p>}
                          {item.address?.city && <p>{item.address.city} — {item.address.state}</p>}
                        </td>
                        <td className="px-4 py-3 text-xs text-surface-600 dark:text-surface-400">{item.address?.email || '—'}</td>
                        <td className="px-4 py-3 text-xs text-surface-600 dark:text-surface-400">{item.address?.mobile || '—'}</td>
                        <td className="px-4 py-3 text-xs text-surface-500">
                          {item.createdAt?.toLocaleString?.() || '—'}
                        </td>
                      </>
                    )}
                    {!isAdmin && (
                      <td className="px-4 py-3">
                        <button
                          onClick={() => setRemoveIndex(i)}
                          className="p-1.5 rounded-lg text-surface-400 dark:text-surface-500 hover:text-error hover:bg-error/10 transition-colors"
                          title="Remove"
                        >
                          <FiTrash2 size={16} />
                        </button>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden space-y-3">
        {cartArray.map((item, i) => (
          <Card key={i} className="relative">
            {!isAdmin && (
              <button
                onClick={() => setRemoveIndex(i)}
                className="absolute top-3 right-3 p-1.5 rounded-lg text-surface-400 dark:text-surface-500 hover:text-error hover:bg-error/10 transition-colors"
              >
                <FiTrash2 size={16} />
              </button>
            )}
            <div className="space-y-2 pr-8">
              <div className="flex items-center justify-between">
                <span className="text-xs text-surface-400">#{i + 1}</span>
                {item.uploadedImage && (
                  <Img src={item.uploadedImage} alt="" className="w-10 h-10 rounded-lg object-cover border border-surface-200" />
                )}
              </div>
              <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm">
                <span className="text-surface-500 dark:text-surface-400">Category</span>
                <span className="text-surface-900 dark:text-surface-100 font-medium">{item.category}</span>
                <span className="text-surface-500 dark:text-surface-400">Subcategory</span>
                <span className="text-surface-700 dark:text-surface-300">{item.subcategory?.name}</span>
                <span className="text-surface-500 dark:text-surface-400">Type</span>
                <span className="text-surface-700 dark:text-surface-300">{item.type}</span>
                {item.brand && (
                  <>
                    <span className="text-surface-500 dark:text-surface-400">Brand</span>
                    <span className="text-surface-700 dark:text-surface-300">{item.brand}</span>
                  </>
                )}
              </div>
              {item.issueDescription && (
                <p className="text-sm text-surface-600 dark:text-surface-400 bg-surface-50 dark:bg-surface-800/50 rounded-lg p-2.5">
                  {item.issueDescription}
                </p>
              )}
              {isAdmin && item.address && (
                <div className="text-xs text-surface-500 dark:text-surface-400 bg-surface-50 dark:bg-surface-800/50 rounded-lg p-2.5 space-y-0.5">
                  {item.address.street && <p>{item.address.street}</p>}
                  {item.address.email && <p>{item.address.email}</p>}
                  {item.address.mobile && <p>{item.address.mobile}</p>}
                </div>
              )}
            </div>
          </Card>
        ))}
      </div>

      {/* Confirm remove dialog */}
      <ConfirmDialog
        isOpen={removeIndex !== null}
        onClose={() => setRemoveIndex(null)}
        onConfirm={() => handleRemove(removeIndex)}
        title="Remove item"
        message="Are you sure you want to remove this item from your cart?"
        confirmLabel="Remove"
      />

      {/* Confirm clear dialog */}
      <ConfirmDialog
        isOpen={showClearConfirm}
        onClose={() => setShowClearConfirm(false)}
        onConfirm={handleClearCart}
        title="Clear cart"
        message="Are you sure you want to remove all items from your cart?"
        confirmLabel="Clear All"
      />
    </div>
  );
};

export default CartComp;
