import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import api from "../services/api";
import Layout from './layout';
import Appliance from "../components/ApplianceRepairService";
import { SearchBar } from '../components/ui';

const ServicePage = () => {
  const [categories, setCategories] = useState([]);
  const [selectedService, setSelectedService] = useState(null);
  const [search, setSearch] = useState('');

  useEffect(() => {
    api.getProducts()
      .then(data => {
        setCategories(data);
        const first = data.find(c => c.isActive);
        if (first) setSelectedService(first.id);
      })
      .catch(err => console.error("Error fetching product:", err));
  }, []);

  const activeCategories = categories.filter(c => c.isActive);
  const filteredCategories = search
    ? activeCategories.filter(c =>
        c.name.toLowerCase().includes(search.toLowerCase())
      )
    : activeCategories;

  const selected = categories.find(c => c.id === selectedService);

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        <div className="text-center mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-surface-900 dark:text-white">Our Services</h1>
          <p className="text-surface-500 dark:text-surface-400 mt-2">Select a category to explore available services</p>
        </div>

        {/* Search + Sidebar row */}
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar */}
          <div className="lg:w-64 shrink-0 space-y-3">
            <SearchBar
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search categories..."
            />
            <div className="flex lg:flex-col gap-2 overflow-x-auto hide-scrollbar pb-2 lg:pb-0">
              {filteredCategories.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedService(cat.id)}
                  className={`shrink-0 px-4 py-2.5 text-sm font-medium rounded-xl text-left transition-all whitespace-nowrap ${
                    selectedService === cat.id
                      ? 'bg-primary-500 text-white shadow-soft'
                      : 'bg-white dark:bg-surface-800 text-surface-600 dark:text-surface-300 border border-surface-200 dark:border-surface-700 hover:border-primary-300 dark:hover:border-primary-600 hover:text-primary-600 dark:hover:text-primary-400'
                  }`}
                >
                  {cat.name}
                </button>
              ))}
              {filteredCategories.length === 0 && (
                <p className="text-sm text-surface-400 dark:text-surface-500 py-4 text-center lg:text-left">
                  No categories match "{search}"
                </p>
              )}
            </div>
          </div>

          {/* Content */}
          <motion.div
            key={selectedService}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25 }}
            className="flex-1 min-w-0"
          >
            {selected && (
              <Appliance
                key={selected.id}
                items={selected.categories}
                title={selected.name}
              />
            )}
          </motion.div>
        </div>
      </div>
    </Layout>
  );
};

export default ServicePage;
