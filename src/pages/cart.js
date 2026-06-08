import React, { useContext, useState, useEffect, useCallback } from 'react';
import Layout from './layout';
import CartComp from '../components/CartComp';
import { CartContext } from '../CartContext';
import { useAuth } from '../AuthContext';
import api from '../services/api';
import { Modal, Button, Input, Card, Badge } from '../components/ui';
import { useToast } from '../components/ui/Toast';
import { FiShoppingBag, FiMapPin, FiPackage, FiClock, FiRefreshCw, FiXCircle, FiPhone, FiMail, FiTrash2 } from 'react-icons/fi';

const CheckoutModal = ({ isOpen, onClose, items, user, onSuccess, onRemoveItem }) => {
  const [address, setAddress] = useState({ street: '', landmark: '', city: '', state: '', pincode: '' });
  const [contact, setContact] = useState({ email: '', mobile: '' });
  const [loading, setLoading] = useState(false);
  const addToast = useToast();

  useEffect(() => {
    if (isOpen) {
      setAddress({ street: '', landmark: '', city: '', state: '', pincode: '' });
      setContact({ email: user?.email || '', mobile: user?.mobile || '' });
    }
  }, [isOpen, user?.email, user?.mobile]);

  const total = items.reduce((s, i) => {
    const discount = Number(i.discount) || 0;
    return s + Number(i.price) * (1 - discount / 100) * (i.quantity || 1);
  }, 0);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!contact.mobile || !address.street || !address.city) {
      addToast('Please fill in mobile, street, and city.', 'error');
      return;
    }
    if (!/^\d{10}$/.test(contact.mobile.replace(/\s/g, ''))) {
      addToast('Mobile number must be exactly 10 digits.', 'error');
      return;
    }
    setLoading(true);
    try {
      await onSuccess(address, contact);
      onClose();
    } catch (err) {
      addToast(err.message || 'Order failed.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const productItems = items.filter(i => i.type === 'product');
  const serviceItems = items.filter(i => i.type !== 'product');

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Checkout" size="lg">
      <form onSubmit={handleSubmit} className="space-y-5">
        {productItems.length > 0 && (
          <div>
            <h4 className="text-sm font-semibold text-surface-700 dark:text-surface-300 mb-2 flex items-center gap-1.5">
              <FiShoppingBag size={14} /> Products ({productItems.length})
            </h4>
            <div className="bg-surface-50 dark:bg-surface-800/50 rounded-xl p-3 space-y-1 text-sm">
              {productItems.map((item, i) => {
                const discount = Number(item.discount) || 0;
                const discounted = Math.round(Number(item.price) * (1 - discount / 100) * (item.quantity || 1));
                return (
                  <div key={'p' + i} className="flex items-center gap-2">
                    <span className="flex-1 truncate">{item.name} × {item.quantity}</span>
                    <span className="font-medium shrink-0 flex items-center gap-1">
                      {discount > 0 && (
                        <>
                          <span className="text-xs text-surface-400 line-through">₹{Number(item.price) * (item.quantity || 1)}</span>
                          <Badge variant="warning" className="text-[10px]">{discount}% off</Badge>
                        </>
                      )}
                      ₹{discounted}
                    </span>
                    <button type="button" onClick={() => onRemoveItem?.(item)}
                      className="p-1 rounded text-surface-400 hover:text-error transition-colors" title="Remove">
                      <FiTrash2 size={14} />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {serviceItems.length > 0 && (
          <div>
            <h4 className="text-sm font-semibold text-surface-700 dark:text-surface-300 mb-2 flex items-center gap-1.5">
              <FiPackage size={14} /> Services ({serviceItems.length})
            </h4>
            <div className="bg-surface-50 dark:bg-surface-800/50 rounded-xl p-3 space-y-1 text-sm">
              {serviceItems.map((item, i) => {
                const discount = Number(item.discount) || 0;
                const discounted = Math.round(Number(item.price) * (1 - discount / 100));
                return (
                  <div key={'s' + i} className="flex items-center gap-2">
                    <span className="flex-1 truncate">{item.name || item.category}{item.subcategory?.name ? ` — ${item.subcategory.name}` : ''}{item.brand ? ` (${item.brand})` : ''}</span>
                    <span className="font-medium shrink-0 flex items-center gap-1">
                      {discount > 0 && (
                        <>
                          <span className="text-xs text-surface-400 line-through">₹{Number(item.price)}</span>
                          <Badge variant="warning" className="text-[10px]">{discount}% off</Badge>
                        </>
                      )}
                      ₹{discounted}
                    </span>
                    <button type="button" onClick={() => onRemoveItem?.(item)}
                      className="p-1 rounded text-surface-400 hover:text-error transition-colors" title="Remove">
                      <FiTrash2 size={14} />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        <div className="bg-surface-100 dark:bg-surface-800 rounded-xl p-3 flex justify-between font-semibold text-surface-900 dark:text-white text-sm">
          <span>Total</span>
          <span>₹{total}</span>
        </div>

        <div>
          <h4 className="text-sm font-semibold text-surface-700 dark:text-surface-300 mb-2 flex items-center gap-1.5">
            <FiMapPin size={14} /> Delivery Address
          </h4>
          <div className="space-y-3">
            <Input label="Street *" value={address.street}
              onChange={(e) => setAddress(prev => ({ ...prev, street: e.target.value }))} placeholder="Street address" />
            <Input label="Landmark" value={address.landmark}
              onChange={(e) => setAddress(prev => ({ ...prev, landmark: e.target.value }))} placeholder="Nearby landmark" />
            <div className="grid grid-cols-3 gap-3">
              <Input label="City *" value={address.city}
                onChange={(e) => setAddress(prev => ({ ...prev, city: e.target.value }))} placeholder="City" />
              <Input label="State" value={address.state}
                onChange={(e) => setAddress(prev => ({ ...prev, state: e.target.value }))} placeholder="State" />
              <Input label="PIN" value={address.pincode}
                onChange={(e) => setAddress(prev => ({ ...prev, pincode: e.target.value }))} placeholder="PIN" />
            </div>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-3">
          <Input label="Email" type="email" value={contact.email} readOnly
            className="cursor-not-allowed opacity-60 bg-surface-50"
            placeholder="Email" />
          <Input label="Mobile *" type="tel" value={contact.mobile}
            onChange={(e) => setContact(prev => ({ ...prev, mobile: e.target.value }))} placeholder="Mobile number" />
        </div>

        <div className="flex gap-3 pt-2">
          <Button variant="secondary" className="flex-1" onClick={onClose}>Cancel</Button>
          <Button type="submit" variant="primary" className="flex-1" disabled={loading}>
            {loading ? 'Placing Order...' : `Place Order — ₹${total}`}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

const OrderDetailModal = ({ order, onClose, onCancel }) => {
  if (!order) return null;
  const isCancellable = order.status !== 'cancelled' && order.status !== 'delivered' && order.status !== 'confirmed';

  return (
    <Modal isOpen={!!order} onClose={onClose} title={`Order #${order.id}`} size="lg">
      <div className="space-y-5">
        <div className="flex items-center justify-between">
          <Badge variant={order.status === 'delivered' || order.status === 'confirmed' ? 'active' : order.status === 'cancelled' ? 'error' : 'warning'}>
            {order.status}
          </Badge>
          <span className="text-xs text-surface-400">{new Date(order.createdAt).toLocaleString()}</span>
        </div>

        <div>
          <h4 className="text-sm font-semibold text-surface-700 dark:text-surface-300 mb-2 flex items-center gap-1.5">
            {order.type === 'store' ? <FiShoppingBag size={14} /> : <FiPackage size={14} />}
            {order.type === 'store' ? 'Products' : 'Services'} ({order.items?.length || 0})
          </h4>
          <div className="space-y-2">
            {order.items?.map((item, i) => (
              <div key={i} className="flex items-center gap-3 bg-surface-50 dark:bg-surface-800/50 rounded-xl p-3">
                {item.imageUrl && (
                  <img src={item.imageUrl} alt="" className="w-12 h-12 rounded-lg object-cover border border-surface-200 dark:border-surface-600" />
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-surface-900 dark:text-white truncate">{item.name}</p>
                  {item.category && (
                    <p className="text-xs text-surface-500">{item.category}{item.subcategory?.name ? ` / ${item.subcategory.name}` : ''}{item.brand ? ` — ${item.brand}` : ''}</p>
                  )}
                  {item.issueDescription && (
                    <p className="text-xs text-surface-400 mt-0.5 line-clamp-2">{item.issueDescription}</p>
                  )}
                </div>
                <div className="text-right shrink-0">
                  {(() => {
                    const discount = Number(item.discount) || 0;
                    const qty = item.quantity || 1;
                    const finalPrice = discount > 0
                      ? Math.round(Number(item.price) * (1 - discount / 100) * qty)
                      : Number(item.price) * qty;
                    return (
                      <>
                        {discount > 0 && (
                          <p className="text-xs text-surface-400 line-through">₹{Number(item.price) * qty}</p>
                        )}
                        <p className="text-sm font-semibold text-surface-900 dark:text-white flex items-center gap-1 justify-end">
                          {discount > 0 && <Badge variant="warning" className="text-[10px]">{discount}% off</Badge>}
                          ₹{finalPrice}
                        </p>
                        <p className="text-xs text-surface-400">×{qty}</p>
                      </>
                    );
                  })()}
                </div>
              </div>
            ))}
          </div>
        </div>

        {order.address && (
          <div>
            <h4 className="text-sm font-semibold text-surface-700 dark:text-surface-300 mb-2 flex items-center gap-1.5">
              <FiMapPin size={14} /> Address
            </h4>
            <div className="bg-surface-50 dark:bg-surface-800/50 rounded-xl p-3 text-sm text-surface-600 dark:text-surface-400 space-y-0.5">
              {order.address.street && <p>{order.address.street}</p>}
              {order.address.landmark && <p>{order.address.landmark}</p>}
              {order.address.city && <p>{order.address.city}{order.address.state ? `, ${order.address.state}` : ''}{order.address.pincode ? ` — ${order.address.pincode}` : ''}</p>}
            </div>
          </div>
        )}

        <div className="grid sm:grid-cols-2 gap-3">
          <div>
            <h4 className="text-sm font-semibold text-surface-700 dark:text-surface-300 mb-1 flex items-center gap-1.5">
              <FiMail size={14} /> Email
            </h4>
            <p className="text-sm text-surface-600 dark:text-surface-400">{order.contact?.email || order.address?.email || '—'}</p>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-surface-700 dark:text-surface-300 mb-1 flex items-center gap-1.5">
              <FiPhone size={14} /> Mobile
            </h4>
            <p className="text-sm text-surface-600 dark:text-surface-400">{order.contact?.mobile || order.address?.mobile || '—'}</p>
          </div>
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-surface-100 dark:border-surface-700">
          <div>
            <p className="text-xs text-surface-400">Total</p>
            <p className="text-lg font-bold text-primary-600">₹{order.total}</p>
          </div>
          {isCancellable && (
            <Button variant="outline" size="sm" onClick={() => onCancel(order.id)}>
              <FiXCircle size={14} /> Cancel Order
            </Button>
          )}
        </div>
      </div>
    </Modal>
  );
};

const PastOrders = ({ orders, loading, onRefresh, onSelect }) => (
  <Card padding={false}>
    <div className="p-5 pb-0 flex items-center justify-between">
      <h2 className="text-lg font-semibold text-surface-900 dark:text-white flex items-center gap-2">
        <FiClock size={16} /> Past Orders
      </h2>
      <button onClick={onRefresh}
        className="p-1.5 rounded-lg text-surface-400 hover:text-primary-500 hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors">
        <FiRefreshCw size={16} />
      </button>
    </div>
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-surface-50 dark:bg-surface-800/50 text-surface-500 dark:text-surface-400 text-xs font-semibold uppercase tracking-wider">
            <th className="text-left px-5 py-3">#</th>
            <th className="text-left px-5 py-3">Type</th>
            <th className="text-left px-5 py-3">Items</th>
            <th className="text-left px-5 py-3">Total</th>
            <th className="text-left px-5 py-3">Status</th>
            <th className="text-left px-5 py-3">Date</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-surface-100 dark:divide-surface-700">
          {orders.map((order, i) => (
            <tr key={order.id} className="hover:bg-surface-50/50 dark:hover:bg-surface-800/30 transition-colors cursor-pointer" onClick={() => onSelect(order)}>
              <td className="px-5 py-3 text-surface-500">{i + 1}</td>
              <td className="px-5 py-3">
                <span className="flex items-center gap-1.5 text-xs font-medium">
                  {order.type === 'store' ? <FiShoppingBag size={12} /> : <FiPackage size={12} />}
                  {order.type === 'store' ? 'Store' : 'Service'}
                </span>
              </td>
              <td className="px-5 py-3">
                <div className="space-y-1 max-w-[200px]">
                  {order.items?.slice(0, 2).map((item, j) => (
                    <div key={j} className="text-xs text-surface-600 dark:text-surface-400 truncate">
                      {item.name} × {item.quantity}
                    </div>
                  ))}
                  {order.items?.length > 2 && (
                    <div className="text-xs text-surface-400">+{order.items.length - 2} more</div>
                  )}
                </div>
              </td>
              <td className="px-5 py-3 font-medium text-surface-900 dark:text-white">₹{order.total}</td>
              <td className="px-5 py-3">
                <Badge variant={order.status === 'delivered' || order.status === 'confirmed' ? 'active' : order.status === 'cancelled' ? 'error' : 'warning'}>
                  {order.status}
                </Badge>
              </td>
              <td className="px-5 py-3 text-xs text-surface-500">
                {new Date(order.createdAt).toLocaleString()}
              </td>
            </tr>
          ))}
          {orders.length === 0 && (
            <tr>
              <td colSpan={6} className="px-5 py-12 text-center text-surface-400 dark:text-surface-500">No past orders.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  </Card>
);

const Cart = () => {
  const { user } = useAuth();
  const { cart, removeItem, removeItems, wishlist, loadWishlist, removeFromWishlist, hideFromWishlist, checkoutWishlist } = useContext(CartContext);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const addToast = useToast();
  const [selectedOrder, setSelectedOrder] = useState(null);

  const productItems = cart.filter(c => c.type === 'product');
  const serviceItems = user?.id ? wishlist : cart.filter(c => c.type !== 'product');
  const allItems = [...productItems, ...serviceItems];

  const fetchOrders = useCallback(async () => {
    if (!user?.id) return;
    setOrdersLoading(true);
    try {
      const data = await api.getOrders(user.id);
      setOrders((data || []).filter(o => o.status !== 'wishlist'));
    } catch {
      setOrders([]);
    } finally {
      setOrdersLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    if (user?.id) {
      fetchOrders();
      loadWishlist(user.id);
    }
  }, [fetchOrders, loadWishlist, user?.id]);

  const handleCombinedCheckout = async (address, contact) => {
    try {
      // Place product order
      if (productItems.length > 0) {
        await api.placeOrder({
          userId: user?.id, userName: user?.name || 'Guest', type: 'store',
          items: productItems.map(i => ({
            productId: i.productId, name: i.name,
            price: Number(i.price), quantity: i.quantity || 1,
            imageUrl: i.imageUrl, discount: Number(i.discount) || 0,
          })),
          total: productItems.reduce((s, i) => {
            const d = Number(i.discount) || 0;
            return s + Number(i.price) * (1 - d / 100) * (i.quantity || 1);
          }, 0),
          address, contact,
        });
      }

      // Place service order (wishlist for logged-in, or new order for guests)
      if (serviceItems.length > 0) {
        if (user?.id) {
          await checkoutWishlist(address, contact);
        } else {
          await api.placeOrder({
            userId: user?.id, userName: user?.name || 'Guest', type: 'service',
            items: serviceItems.map(i => ({
              name: i.name, price: Number(i.price), quantity: 1,
              category: i.category, subcategory: i.subcategory,
              brand: i.brand, issueDescription: i.issueDescription,
            })),
            total: serviceItems.reduce((s, i) => s + Number(i.price), 0),
            address, contact,
          });
        }
      }

      // Clean up cart — only after all orders succeed
      const productIndices = cart
        .map((item, i) => item.type === 'product' ? i : -1)
        .filter(i => i !== -1);
      const serviceIndices = !user?.id
        ? cart.map((item, i) => item.type !== 'product' ? i : -1).filter(i => i !== -1)
        : [];
      const allIndices = [...productIndices, ...serviceIndices];
      if (allIndices.length > 0) removeItems(allIndices);
      if (user?.id) api.saveCart(user.id, []).catch(() => {});

      addToast('Order placed successfully!', 'success');
      setCheckoutOpen(false);
      fetchOrders();
    } catch (err) {
      addToast(err.message || 'Checkout failed.', 'error');
    }
  };

  const handleCheckout = () => {
    if (!user) {
      addToast('Please login to place an order.', 'error');
      return;
    }
    setCheckoutOpen(true);
  };

  const handleRemoveService = async (orderId) => {
    try {
      await removeFromWishlist(orderId);
      addToast('Removed from cart.', 'success');
    } catch {
      addToast('Failed to remove from wishlist.', 'error');
    }
  };

  const handleRemoveCheckoutItem = async (item) => {
    try {
      if (item.type === 'product') {
        const idx = cart.findIndex(c => c.type === 'product' && c.productId === item.productId);
        if (idx !== -1) removeItem(idx);
      } else if (item.orderId) {
        hideFromWishlist(item.orderId);
      } else {
        const idx = cart.findIndex(c => c.type !== 'product' && c.category === item.category);
        if (idx !== -1) removeItem(idx);
      }
    } catch {
      addToast('Failed to remove item.', 'error');
    }
  };

  const handleCancelOrder = async (orderId) => {
    try {
      await api.updateOrderStatus(orderId, 'cancelled');
      addToast('Order cancelled.', 'success');
      setSelectedOrder(null);
      fetchOrders();
    } catch (err) {
      addToast(err.message || 'Failed to cancel order.', 'error');
    }
  };

  return (
    <Layout>
      <CartComp isAdmin={false} onRemoveService={handleRemoveService} />
      {allItems.length > 0 && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-4">
          <Card className="mt-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-surface-500 dark:text-surface-400">
                  {allItems.length} item{allItems.length !== 1 ? 's' : ''} ready for checkout
                </p>
                {!user && <p className="text-xs text-warning mt-0.5">Please login to place an order</p>}
              </div>
              <Button variant="primary" size="lg" onClick={handleCheckout}>
                <FiShoppingBag size={16} /> Checkout
              </Button>
            </div>
          </Card>
        </div>
      )}
      <CheckoutModal
        isOpen={checkoutOpen}
        onClose={() => setCheckoutOpen(false)}
        items={allItems}
        user={user}
        onSuccess={handleCombinedCheckout}
        onRemoveItem={handleRemoveCheckoutItem}
      />
      {user && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
          <PastOrders orders={orders} loading={ordersLoading} onRefresh={fetchOrders} onSelect={setSelectedOrder} />
        </div>
      )}
      <OrderDetailModal order={selectedOrder} onClose={() => setSelectedOrder(null)} onCancel={handleCancelOrder} />
    </Layout>
  );
};

export default Cart;
