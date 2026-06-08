import React, { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import Layout from './layout';
import AdminProduct from '../components/AdminProduct';
import StoreAdmin from '../components/StoreAdmin';
import CartComp from '../components/CartComp';
import api from '../services/api';
import { useAuth } from '../AuthContext';
import { Card, Badge, Img } from '../components/ui';
import { FiPackage, FiShoppingCart, FiGrid, FiRefreshCw } from 'react-icons/fi';

const StoreOrders = () => {
  const [orders, setOrders] = useState([]);

  const fetchOrders = () => {
    api.getOrders()
      .then(data => setOrders(data || []))
      .catch(err => console.error(err));
  };

  useEffect(() => { fetchOrders(); }, []);

  const updateStatus = async (orderId, status) => {
    await api.updateOrderStatus(orderId, status);
    fetchOrders();
  };

  const statusBadge = (status) => {
    const map = { pending: 'warning', confirmed: 'active', delivered: 'active', cancelled: 'error' };
    return <Badge variant={map[status] || 'inactive'}>{status}</Badge>;
  };

  return (
    <Card padding={false}>
      <div className="p-5 pb-0 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-surface-900 dark:text-white">Store Orders</h2>
        <button onClick={fetchOrders}
          className="p-1.5 rounded-lg text-surface-400 hover:text-primary-500 hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors" title="Refresh">
          <FiRefreshCw size={16} />
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-surface-50 dark:bg-surface-800/50 text-surface-500 dark:text-surface-400 text-xs font-semibold uppercase tracking-wider">
              <th className="text-left px-5 py-3">#</th>
              <th className="text-left px-5 py-3">Customer</th>
              <th className="text-left px-5 py-3">Items</th>
              <th className="text-left px-5 py-3">Total</th>
              <th className="text-left px-5 py-3">Address</th>
              <th className="text-left px-5 py-3">Contact</th>
              <th className="text-left px-5 py-3">Status</th>
              <th className="text-left px-5 py-3">Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-surface-100 dark:divide-surface-700">
            {orders.map((order, i) => (
              <tr key={order.id} className="hover:bg-surface-50/50 dark:hover:bg-surface-800/30 transition-colors">
                <td className="px-5 py-3 text-surface-500">{i + 1}</td>
                <td className="px-5 py-3 font-medium text-surface-900 dark:text-surface-100">{order.userName}</td>
                <td className="px-5 py-3">
                  <div className="space-y-1">
                    {order.items?.map((item, j) => (
                      <div key={j} className="flex items-center gap-2 text-xs text-surface-600 dark:text-surface-400">
                        {item.imageUrl && <Img src={item.imageUrl} alt="" className="w-6 h-6 rounded object-cover" />}
                        <span>{item.name} × {item.quantity}</span>
                      </div>
                    ))}
                  </div>
                </td>
                <td className="px-5 py-3 font-medium text-surface-900 dark:text-white">₹{order.total}</td>
                <td className="px-5 py-3 text-xs text-surface-600 dark:text-surface-400 max-w-[160px]">
                  {order.address?.street}{order.address?.city ? `, ${order.address.city}` : ''}
                </td>
                <td className="px-5 py-3 text-xs text-surface-600 dark:text-surface-400">
                  {order.contact?.email}<br />{order.contact?.mobile}
                </td>
                <td className="px-5 py-3">
                  <div className="flex items-center gap-1.5">
                    {statusBadge(order.status)}
                    <select value={order.status}
                      onChange={(e) => updateStatus(order.id, e.target.value)}
                      className="text-xs bg-transparent border border-surface-200 dark:border-surface-600 rounded-lg px-1 py-0.5 text-surface-600 dark:text-surface-400">
                      <option value="pending">pending</option>
                      <option value="confirmed">confirmed</option>
                      <option value="delivered">delivered</option>
                      <option value="cancelled">cancelled</option>
                    </select>
                  </div>
                </td>
                <td className="px-5 py-3 text-xs text-surface-500">
                  {new Date(order.createdAt).toLocaleDateString()}
                </td>
              </tr>
            ))}
            {orders.length === 0 && (
              <tr>
                <td colSpan={8} className="px-5 py-12 text-center text-surface-400 dark:text-surface-500">No orders yet.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </Card>
  );
};

// ─── Admin Page ───

const AdminPage = () => {
  const { user, loading } = useAuth();
  const [activeTab, setActiveTab] = useState('admin');

  if (!loading && (!user || user.role === 'user')) {
    return <Navigate to="/" replace />;
  }

  const role = user?.role || 'user';
  const tabs = [
    ...(role === 'admin' || role === 'helper' ? [{ key: 'admin', label: 'Services', icon: FiPackage }] : []),
    ...(role === 'admin' ? [{ key: 'store', label: 'Store', icon: FiGrid }] : []),
    { key: 'orders', label: role === 'user' ? 'My Orders' : 'Orders', icon: FiShoppingCart },
  ];

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-xl sm:text-2xl font-bold text-surface-900 dark:text-white mb-6">Admin Panel</h1>

        <div className="flex gap-1 bg-surface-100 dark:bg-surface-800 p-1 rounded-xl mb-6 w-fit">
          {tabs.map(tab => (
            <button key={tab.key} onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-all ${
                activeTab === tab.key
                  ? 'bg-white dark:bg-surface-700 text-surface-900 dark:text-white shadow-soft'
                  : 'text-surface-500 hover:text-surface-700 dark:hover:text-surface-300'
              }`}
            >
              <tab.icon size={16} /> {tab.label}
            </button>
          ))}
        </div>

        <div>
          {activeTab === 'admin' && <AdminProduct />}
          {activeTab === 'store' && <StoreAdmin />}
          {activeTab === 'orders' && (
            <div className="space-y-6">
              <StoreOrders />
              <CartComp isAdmin={true} />
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default AdminPage;
