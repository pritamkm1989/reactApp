import React, { useContext, useState } from 'react';
import { CartContext } from '../CartContext';
import { FiTrash2, FiPackage, FiImage, FiShoppingBag, FiMinus, FiPlus } from 'react-icons/fi';
import { Button, Card, ConfirmDialog, Img, Badge } from './ui';
import { useToast } from './ui/Toast';

const CartComp = ({ isAdmin, onRemoveService }) => {
  const { cart, removeItem, updateQuantity, clearCart, wishlist } = useContext(CartContext);
  const [removeIndex, setRemoveIndex] = useState(null);
  const [removeWishOrderId, setRemoveWishOrderId] = useState(null);
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const addToast = useToast();

  const cartArray = Array.isArray(cart) ? cart : [];

  const productItems = cartArray.filter(c => c.type === 'product');
  const serviceItems = Array.isArray(wishlist) && wishlist.length > 0
    ? wishlist
    : cartArray.filter(c => c.type !== 'product');

  const handleRemove = (index) => {
    addToast('Removed from cart!', 'success');
    removeItem(index);
  };

  const handleClearCart = () => {
    clearCart();
    addToast('Cart cleared!', 'info');
  };

  const totalPrice = [...productItems, ...serviceItems].reduce((sum, item) => {
    const discount = Number(item.discount) || 0;
    return sum + Number(item.price) * (1 - discount / 100) * (item.quantity || 1);
  }, 0);

  if (cartArray.length === 0 && serviceItems.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-surface-100 dark:bg-surface-800 rounded-2xl mb-4">
          <FiPackage size={28} className="text-surface-400" />
        </div>
        <h2 className="text-xl font-semibold text-surface-700 dark:text-surface-200">Your cart is empty</h2>
        <p className="text-surface-500 dark:text-surface-400 mt-1 text-sm">Add some services or products to get started.</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-surface-900 dark:text-white">
            {isAdmin ? 'Customer Orders' : 'Your Cart'}
          </h1>
          <p className="text-sm text-surface-500 dark:text-surface-400 mt-0.5">
            {cartArray.length + serviceItems.length} item{cartArray.length + serviceItems.length !== 1 ? 's' : ''}
            {totalPrice > 0 && ` (₹${totalPrice} total)`}
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

      {/* Product Items */}
      {productItems.length > 0 && (
        <div className="mb-8">
          <h2 className="text-base font-semibold text-surface-900 dark:text-white mb-3 flex items-center gap-2">
            <FiShoppingBag size={16} /> Products
          </h2>
          <div className="hidden md:block">
            <div className="bg-white dark:bg-surface-800 rounded-2xl border border-surface-200 dark:border-surface-700 overflow-hidden shadow-soft">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-surface-50 dark:bg-surface-800/50 text-surface-500 dark:text-surface-400 text-xs font-semibold uppercase tracking-wider">
                    <th className="text-left px-4 py-3">#</th>
                    <th className="text-left px-4 py-3">Product</th>
                    <th className="text-left px-4 py-3">Price</th>
                    <th className="text-left px-4 py-3">Qty</th>
                    <th className="text-left px-4 py-3">Subtotal</th>
                    {!isAdmin && <th className="text-left px-4 py-3">Action</th>}
                  </tr>
                </thead>
                <tbody className="divide-y divide-surface-100 dark:divide-surface-700">
                  {productItems.map((item, i) => {
                    const globalIndex = cartArray.indexOf(item);
                    const discount = Number(item.discount) || 0;
                    const subtotal = Math.round(Number(item.price) * (1 - discount / 100) * (item.quantity || 1));
                    return (
                      <tr key={i} className="hover:bg-surface-50/50 dark:hover:bg-surface-700/30 transition-colors">
                        <td className="px-4 py-3 text-surface-500">{i + 1}</td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            {item.imageUrl ? (
                              <Img src={item.imageUrl} alt="" className="w-10 h-10 rounded-lg object-cover border border-surface-200 dark:border-surface-600" />
                            ) : (
                              <div className="w-10 h-10 rounded-lg bg-surface-100 dark:bg-surface-700" />
                            )}
                            <span className="font-medium text-surface-900 dark:text-surface-100">{item.name}</span>
                            {discount > 0 && (
                              <Badge variant="warning" className="text-[10px]">{discount}% off</Badge>
                            )}
                          </div>
                        </td>
                        <td className="px-4 py-3 text-surface-700 dark:text-surface-300">
                          ₹{Number(item.price)}
                          {discount > 0 && (
                            <span className="text-xs text-surface-400 line-through ml-1">₹{Math.round(Number(item.price) * (item.quantity || 1))}</span>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          {!isAdmin ? (
                            <div className="flex items-center gap-1.5">
                              <button onClick={() => updateQuantity(globalIndex, (item.quantity || 1) - 1)}
                                className="p-1 rounded text-surface-400 hover:text-primary-500 hover:bg-surface-100 dark:hover:bg-surface-700 transition-colors">
                                <FiMinus size={12} />
                              </button>
                              <span className="text-sm font-semibold text-surface-900 dark:text-white w-6 text-center">{item.quantity || 1}</span>
                              <button onClick={() => updateQuantity(globalIndex, (item.quantity || 1) + 1)}
                                className="p-1 rounded text-surface-400 hover:text-primary-500 hover:bg-surface-100 dark:hover:bg-surface-700 transition-colors">
                                <FiPlus size={12} />
                              </button>
                            </div>
                          ) : (
                            <span>{item.quantity || 1}</span>
                          )}
                        </td>
                        <td className="px-4 py-3 font-medium text-surface-900 dark:text-surface-100">₹{subtotal}</td>
                        {!isAdmin && (
                          <td className="px-4 py-3">
                            <button onClick={() => setRemoveIndex(globalIndex)}
                              className="p-1.5 rounded-lg text-surface-400 dark:text-surface-500 hover:text-error hover:bg-error/10 transition-colors" title="Remove">
                              <FiTrash2 size={16} />
                            </button>
                          </td>
                        )}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Mobile Products */}
          <div className="md:hidden space-y-3">
            {productItems.map((item, i) => {
              const globalIndex = cartArray.indexOf(item);
              const discount = Number(item.discount) || 0;
              const subtotal = Math.round(Number(item.price) * (1 - discount / 100) * (item.quantity || 1));
              return (
                <Card key={i} className="relative">
                  {!isAdmin && (
                    <button onClick={() => setRemoveIndex(globalIndex)}
                      className="absolute top-3 right-3 p-1.5 rounded-lg text-surface-400 dark:text-surface-500 hover:text-error hover:bg-error/10 transition-colors">
                      <FiTrash2 size={16} />
                    </button>
                  )}
                  <div className="flex gap-3 pr-8">
                    {item.imageUrl ? (
                      <Img src={item.imageUrl} alt="" className="w-16 h-16 rounded-lg object-cover border border-surface-200 dark:border-surface-600" />
                    ) : (
                      <div className="w-16 h-16 rounded-lg bg-surface-100 dark:bg-surface-700" />
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-surface-900 dark:text-surface-100 text-sm">{item.name}</p>
                      <p className="text-primary-600 font-semibold text-sm mt-0.5">
                        ₹{Number(item.price)}
                        {discount > 0 && (
                          <span className="text-xs text-surface-400 line-through ml-1">₹{Math.round(Number(item.price) * (item.quantity || 1))}</span>
                        )}
                      </p>
                      <div className="flex items-center justify-between mt-2">
                        {!isAdmin ? (
                          <div className="flex items-center gap-1.5">
                            <button onClick={() => updateQuantity(globalIndex, (item.quantity || 1) - 1)}
                              className="p-1 rounded text-surface-400 hover:text-primary-500 transition-colors">
                              <FiMinus size={12} />
                            </button>
                            <span className="text-sm font-semibold w-6 text-center">{item.quantity || 1}</span>
                            <button onClick={() => updateQuantity(globalIndex, (item.quantity || 1) + 1)}
                              className="p-1 rounded text-surface-400 hover:text-primary-500 transition-colors">
                              <FiPlus size={12} />
                            </button>
                          </div>
                        ) : (
                          <span className="text-sm text-surface-500">Qty: {item.quantity || 1}</span>
                        )}
                        <span className="text-sm font-semibold text-surface-900 dark:text-white">₹{subtotal}</span>
                      </div>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      )}

      {/* Service Items */}
      {serviceItems.length > 0 && (
        <div>
          <h2 className="text-base font-semibold text-surface-900 dark:text-white mb-3 flex items-center gap-2">
            <FiPackage size={16} /> Service Bookings
          </h2>
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
                    {serviceItems.map((item, i) => {
                      const globalIndex = cartArray.indexOf(item);
                      return (
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
                            ) : item.imageUrl ? (
                              <Img src={item.imageUrl} alt="" className="w-10 h-10 rounded-lg object-cover border border-surface-200 dark:border-surface-600" />
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
                              <button onClick={() => {
                                if (item.orderId) {
                                  setRemoveWishOrderId(item.orderId);
                                } else {
                                  setRemoveIndex(globalIndex);
                                }
                              }}
                                className="p-1.5 rounded-lg text-surface-400 dark:text-surface-500 hover:text-error hover:bg-error/10 transition-colors" title="Remove">
                                <FiTrash2 size={16} />
                              </button>
                            </td>
                          )}
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Mobile Services */}
          <div className="md:hidden space-y-3">
            {serviceItems.map((item, i) => {
              const globalIndex = cartArray.indexOf(item);
              return (
                <Card key={i} className="relative">
                  {!isAdmin && (
                    <button onClick={() => {
                      if (item.orderId) {
                        setRemoveWishOrderId(item.orderId);
                      } else {
                        setRemoveIndex(globalIndex);
                      }
                    }}
                      className="absolute top-3 right-3 p-1.5 rounded-lg text-surface-400 dark:text-surface-500 hover:text-error hover:bg-error/10 transition-colors">
                      <FiTrash2 size={16} />
                    </button>
                  )}
                  <div className="space-y-2 pr-8">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-surface-400">#{i + 1}</span>
                      {(item.uploadedImage || item.imageUrl) && (
                        <Img src={item.uploadedImage || item.imageUrl} alt="" className="w-10 h-10 rounded-lg object-cover border border-surface-200" />
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
              );
            })}
          </div>
        </div>
      )}

      {/* Cart total bar */}
      {(productItems.length > 0 || serviceItems.length > 0) && !isAdmin && (
        <div className="mt-6 p-4 bg-white dark:bg-surface-800 rounded-2xl border border-surface-200 dark:border-surface-700 shadow-soft">
          <div className="flex items-center justify-between">
            <span className="text-base font-semibold text-surface-900 dark:text-white">Total</span>
            <span className="text-xl font-bold text-primary-600">₹{totalPrice}</span>
          </div>
        </div>
      )}

      <ConfirmDialog
        isOpen={removeIndex !== null}
        onClose={() => setRemoveIndex(null)}
        onConfirm={() => handleRemove(removeIndex)}
        title="Remove item"
        message="Are you sure you want to remove this item from your cart?"
        confirmLabel="Remove"
      />

      <ConfirmDialog
        isOpen={removeWishOrderId !== null}
        onClose={() => setRemoveWishOrderId(null)}
        onConfirm={() => {
          if (removeWishOrderId && onRemoveService) onRemoveService(removeWishOrderId);
          setRemoveWishOrderId(null);
        }}
        title="Remove service booking"
        message="Are you sure you want to remove this service booking?"
        confirmLabel="Remove"
      />

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
