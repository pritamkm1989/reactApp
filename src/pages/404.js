import React from "react";
import { Link } from "react-router-dom";
import Layout from './layout';
import { FiHome } from "react-icons/fi";

const NotFoundPage = () => (
  <Layout>
    <div className="flex flex-col items-center justify-center py-24 px-4 text-center">
      <div className="text-7xl font-bold text-primary-500 mb-4">404</div>
      <h1 className="text-2xl font-semibold text-surface-900 mb-2">Page not found</h1>
      <p className="text-surface-500 mb-8 max-w-md">The page you're looking for doesn't exist or has been moved.</p>
      <Link
        to="/"
        className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary-500 text-white font-medium rounded-xl hover:bg-primary-600 transition-colors"
      >
        <FiHome size={18} />
        Back to Home
      </Link>
    </div>
  </Layout>
);

export default NotFoundPage;
