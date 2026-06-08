import React, { useState, useEffect, useContext } from "react";
import { motion } from "framer-motion";
import { CartContext } from "../CartContext";
import { useToast } from '../components/ui/Toast';
import Layout from './layout';
import { Button, Card, Badge, Img, SearchBar, Modal } from '../components/ui';
import { FiShoppingCart, FiEye, FiMinus, FiPlus } from 'react-icons/fi';
import api from '../services/api';

const StorePage = () => {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const addToast = useToast();
  const { cart, addToCart, updateQuantity: updateCartQty } = useContext(CartContext);

  useEffect(() => {
    api.getStoreProducts().then(data => setProducts(data || [])).catch(() => setProducts([]));
  }, []);

  const activeProducts = products.filter(p => p.isActive);

  const categories = ['All', ...new Set(activeProducts.map(p => p.category).filter(Boolean))];

  const filtered = activeProducts.filter(p => {
    const matchCat = activeCategory === 'All' || p.category === activeCategory;
    const matchSearch = !search || p.name.toLowerCase().includes(search.toLowerCase()) ||
      (p.description || '').toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  const openDetail = (product) => {
    setSelectedProduct(product);
    setQuantity(1);
  };

  const handleAddToCart = (product, qty = 1) => {
    const item = {
      type: 'product',
      productId: product.id,
      name: product.name,
      price: Number(product.price),
      discount: Number(product.discount || 0),
      imageUrl: product.imageUrl,
      quantity: qty,
      createdAt: new Date(),
    };
    addToCart(item);
    addToast(`${product.name} added to cart!`, 'success');
  };

  const getCartQty = (productId) => {
    const item = cart.find(c => c.type === 'product' && c.productId === productId);
    return item ? item.quantity : 0;
  };

  const discountedPrice = (price, discount) => {
    if (!discount) return price;
    return (price * (1 - discount / 100)).toFixed(0);
  };

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-surface-900 dark:text-white">Store</h1>
          <p className="text-surface-500 dark:text-surface-400 mt-2">Browse our products and order online</p>
        </div>

        {/* Search + Categories */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div className="flex gap-2 overflow-x-auto hide-scrollbar pb-1">
            {categories.map(cat => (
              <button key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`shrink-0 px-4 py-2 text-sm font-medium rounded-xl transition-all ${
                  activeCategory === cat
                    ? 'bg-primary-500 text-white shadow-soft'
                    : 'bg-white dark:bg-surface-800 text-surface-600 dark:text-surface-300 border border-surface-200 dark:border-surface-700 hover:border-primary-300 dark:hover:border-primary-600'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
          <SearchBar value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search products..." className="w-full sm:w-64" />
        </div>

        {/* Product Grid */}
        {filtered.length === 0 ? (
          <div className="text-center py-16 text-surface-400 dark:text-surface-500">
            {products.length === 0
              ? 'No products available yet. Check back later!'
              : `No products match "${search || activeCategory}"`
            }
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {filtered.map((product) => (
              <motion.div key={product.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
              >
                <Card padding={false} className="group h-full flex flex-col">
                  <div className="relative aspect-square overflow-hidden bg-surface-100 dark:bg-surface-700">
                    {product.imageUrl ? (
                      <Img src={product.imageUrl} alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-surface-300 dark:text-surface-600 text-sm">
                        No image
                      </div>
                    )}
                    <div className="absolute top-2 left-2 flex flex-col gap-1">
                      {product.discount > 0 && (
                        <Badge variant="warning">{product.discount}% OFF</Badge>
                      )}
                    </div>
                    <button onClick={() => openDetail(product)}
                      className="absolute top-2 right-2 p-1.5 bg-white/90 dark:bg-surface-800/90 rounded-lg text-surface-500 hover:text-primary-500 opacity-0 group-hover:opacity-100 transition-all shadow-soft"
                      title="View details">
                      <FiEye size={14} />
                    </button>
                  </div>
                  <div className="p-3 flex flex-col flex-1">
                    <p className="text-xs text-surface-500 dark:text-surface-400 uppercase tracking-wide">{product.category || 'Product'}</p>
                    <h3 className="font-medium text-surface-900 dark:text-white text-sm mt-0.5 line-clamp-2">{product.name}</h3>
                    <div className="flex items-baseline gap-1.5 mt-1.5">
                      <span className="text-lg font-bold text-primary-600">₹{discountedPrice(product.price, product.discount)}</span>
                      {product.discount > 0 && (
                        <span className="text-xs text-surface-400 line-through">₹{product.price}</span>
                      )}
                    </div>
                    <div className="mt-auto pt-3">
                      {getCartQty(product.id) > 0 ? (
                        <div className="flex items-center gap-2">
                          <button onClick={() => {
                            const existing = cart.findIndex(c => c.type === 'product' && c.productId === product.id);
                            if (existing !== -1) {
                              const current = cart[existing].quantity || 1;
                              if (current <= 1) {
                                updateCartQty(existing, 0);
                              } else {
                                updateCartQty(existing, current - 1);
                              }
                            }
                          }}
                            className="p-1.5 rounded-lg bg-surface-100 dark:bg-surface-700 text-surface-600 dark:text-surface-300 hover:bg-primary-100 dark:hover:bg-primary-900/30 hover:text-primary-600 transition-colors">
                            <FiMinus size={14} />
                          </button>
                          <span className="text-sm font-semibold text-surface-900 dark:text-white w-6 text-center">{getCartQty(product.id)}</span>
                          <button onClick={() => handleAddToCart(product, 1)}
                            className="p-1.5 rounded-lg bg-surface-100 dark:bg-surface-700 text-surface-600 dark:text-surface-300 hover:bg-primary-100 dark:hover:bg-primary-900/30 hover:text-primary-600 transition-colors">
                            <FiPlus size={14} />
                          </button>
                        </div>
                      ) : (
                        <Button variant="primary" size="sm" className="w-full" onClick={() => handleAddToCart(product, 1)}>
                          <FiShoppingCart size={14} /> Add
                        </Button>
                      )}
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Detail Modal */}
      <Modal isOpen={selectedProduct !== null} onClose={() => setSelectedProduct(null)}
        title={selectedProduct?.name || ''} size="md">
        {selectedProduct && (
          <div className="space-y-5">
            <div className="flex flex-col md:flex-row gap-6">
              {selectedProduct.imageUrl ? (
                <div className="md:w-1/2 shrink-0">
                  <Img src={selectedProduct.imageUrl} alt={selectedProduct.name}
                    className="w-full aspect-square object-cover rounded-xl" />
                </div>
              ) : null}
              <div className="flex-1 space-y-3">
                <p className="text-xs text-surface-500 uppercase tracking-wide">{selectedProduct.category || 'Product'}</p>
                <h3 className="text-xl font-bold text-surface-900 dark:text-white">{selectedProduct.name}</h3>
                {selectedProduct.description && (
                  <p className="text-sm text-surface-600 dark:text-surface-400">{selectedProduct.description}</p>
                )}
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-bold text-primary-600">₹{discountedPrice(selectedProduct.price, selectedProduct.discount)}</span>
                  {selectedProduct.discount > 0 && (
                    <>
                      <span className="text-sm text-surface-400 line-through">₹{selectedProduct.price}</span>
                      <Badge variant="warning">{selectedProduct.discount}% off</Badge>
                    </>
                  )}
                </div>
                {selectedProduct.stock && (
                  <p className="text-sm text-surface-500">Stock: {selectedProduct.stock} units</p>
                )}
                <div className="flex items-center gap-3 pt-2">
                  <div className="flex items-center gap-2 bg-surface-100 dark:bg-surface-800 rounded-xl px-3 py-1.5">
                    <button onClick={() => setQuantity(q => Math.max(1, q - 1))}
                      className="p-1 text-surface-600 dark:text-surface-300 hover:text-primary-600 transition-colors">
                      <FiMinus size={16} />
                    </button>
                    <span className="text-sm font-semibold text-surface-900 dark:text-white w-8 text-center">{quantity}</span>
                    <button onClick={() => setQuantity(q => q + 1)}
                      className="p-1 text-surface-600 dark:text-surface-300 hover:text-primary-600 transition-colors">
                      <FiPlus size={16} />
                    </button>
                  </div>
                  <Button variant="primary" className="flex-1" onClick={() => { handleAddToCart(selectedProduct, quantity); setSelectedProduct(null); }}>
                    <FiShoppingCart size={16} /> Add to Cart — ₹{Number(discountedPrice(selectedProduct.price, selectedProduct.discount)) * quantity}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </Layout>
  );
};

export default StorePage;
