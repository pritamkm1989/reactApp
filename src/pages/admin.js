import React, { useState } from "react";
import Layout from './layout';
import AdminProduct from '../components/AdminProduct';
import CartComp from '../components/CartComp';
import { FiPackage, FiShoppingCart } from 'react-icons/fi';

const tabs = [
  { key: 'admin', label: 'Products', icon: FiPackage },
  { key: 'cart', label: 'Orders', icon: FiShoppingCart },
];

const AdminPage = () => {
  const [activeTab, setActiveTab] = useState('admin');

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-xl sm:text-2xl font-bold text-surface-900 mb-6">Admin Panel</h1>

        {/* Tabs */}
        <div className="flex gap-1 bg-surface-100 p-1 rounded-xl mb-6 w-fit">
          {tabs.map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-all ${
                activeTab === tab.key
                  ? 'bg-white text-surface-900 shadow-soft'
                  : 'text-surface-500 hover:text-surface-700'
              }`}
            >
              <tab.icon size={16} />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div>
          {activeTab === 'admin' && <AdminProduct />}
          {activeTab === 'cart' && <CartComp isAdmin={true} />}
        </div>
      </div>
    </Layout>
  );
};

export default AdminPage;
