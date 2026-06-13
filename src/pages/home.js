import React, { useState, useEffect, useContext } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import ImageBox from "../components/Animaton";
import AnimatedText from "../components/AnimatedText";
import Service from "../components/Service";
import Testimonials from "../components/testimonials";
import Layout from './layout';
import { CartContext } from "../CartContext";
import { useToast } from '../components/ui/Toast';
import { Button, Card, Badge, Img } from '../components/ui';
import { FiArrowRight, FiTool, FiShoppingCart, FiMinus, FiPlus, FiChevronRight } from "react-icons/fi";
import api from '../services/api';

const HomePage = () => {
  const [storeProducts, setStoreProducts] = useState([]);
  const addToast = useToast();
  const { cart, addToCart, updateQuantity } = useContext(CartContext);

  useEffect(() => {
    api.getStoreProducts().then(data => setStoreProducts(data || [])).catch(() => {});
  }, []);

  const activeProducts = storeProducts.filter(p => p.isActive).slice(0, 4);

  const discountedPrice = (price, discount) => {
    if (!discount) return price;
    return (price * (1 - discount / 100)).toFixed(0);
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

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-50/50 via-white dark:via-surface-900 to-surface-50 dark:to-surface-900 pointer-events-none" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
          <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
            {/* Left Content */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary-100 text-primary-700 text-xs font-medium rounded-full mb-4">
                <FiTool size={14} />
                Expert Service & Repair
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-surface-900 dark:text-white leading-tight text-balance">
                Your Trusted Partner for{" "}
                <span className="text-primary-500">Appliance Repair</span>
              </h1>
              <div className="mt-4 text-surface-600 text-base sm:text-lg leading-relaxed">
                <AnimatedText />
              </div>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  to="/service"
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary-500 text-white font-medium rounded-xl hover:bg-primary-600 transition-colors shadow-soft hover:shadow-soft-md"
                >
                  Book a Service
                  <FiArrowRight size={18} />
                </Link>
                <Link
                  to="/about"
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-white dark:bg-surface-800 text-surface-700 dark:text-surface-200 font-medium rounded-xl border border-surface-200 dark:border-surface-700 hover:border-surface-300 dark:hover:border-surface-600 hover:shadow-soft transition-all"
                >
                  Learn More
                </Link>
              </div>
            </motion.div>

            {/* Right Image Grid */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.15 }}
              className="flex justify-center"
            >
              <ImageBox />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl font-bold text-surface-900 dark:text-white">Our Services</h2>
            <p className="text-surface-500 dark:text-surface-400 mt-2 max-w-xl mx-auto">
              Browse our range of professional repair and maintenance services
            </p>
          </div>
          <Service />
        </div>
      </section>

      {/* Store Section */}
      <section className="py-16 lg:py-20 bg-surface-50/50 dark:bg-surface-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-10">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-surface-900 dark:text-white">Online Store</h2>
              <p className="text-surface-500 dark:text-surface-400 mt-2 max-w-xl">
                Shop genuine parts, accessories, and more
              </p>
            </div>
            <Link to="/store"
              className="hidden sm:inline-flex items-center gap-1 text-sm font-medium text-primary-600 hover:text-primary-500 transition-colors">
              View All <FiChevronRight size={16} />
            </Link>
          </div>

          {activeProducts.length === 0 ? (
            <div className="text-center py-12 text-surface-400 dark:text-surface-500">
              No products available yet. Check back later!
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {activeProducts.map((product) => (
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
                      {product.discount > 0 && (
                        <div className="absolute top-2 left-2">
                          <Badge variant="warning">{product.discount}% OFF</Badge>
                        </div>
                      )}
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
                              const idx = cart.findIndex(c => c.type === 'product' && c.productId === product.id);
                              if (idx !== -1) {
                                const current = cart[idx].quantity || 1;
                                if (current <= 1) {
                                  updateQuantity(idx, 0);
                                } else {
                                  updateQuantity(idx, current - 1);
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

          <div className="text-center mt-8 sm:hidden">
            <Link to="/store"
              className="inline-flex items-center gap-1 text-sm font-medium text-primary-600 hover:text-primary-500 transition-colors">
              View All Products <FiChevronRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <Testimonials />
    </Layout>
  );
};

export default HomePage;
