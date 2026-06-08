import React, { createContext, useState, useCallback } from "react";
import api from './services/api';

const STORAGE_KEY = 'urbex-cart';

const loadCart = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      return parsed.map(item => ({
        ...item,
        createdAt: item.createdAt ? new Date(item.createdAt) : new Date(),
      }));
    }
  } catch (e) {
    console.warn('Failed to load cart from localStorage:', e);
  }
  return [];
};

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(loadCart);

  const persist = (newCart) => {
    setCart(newCart);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newCart));
    } catch (e) {
      console.warn('Failed to save cart to localStorage:', e);
    }
  };

  const addToCart = (item) => {
    setCart((prevCart) => {
      if (item.type === 'product' && item.productId) {
        const existing = prevCart.findIndex(c => c.type === 'product' && c.productId === item.productId);
        if (existing !== -1) {
          const updated = [...prevCart];
          updated[existing] = {
            ...updated[existing],
            price: Number(item.price),
            discount: Number(item.discount || 0),
            imageUrl: item.imageUrl,
            quantity: (updated[existing].quantity || 1) + (item.quantity || 1),
            createdAt: new Date(),
          };
          return updated;
        }
      }
      return [...prevCart, { ...item, createdAt: new Date() }];
    });
  };

  const removeItem = (index) => {
    setCart((prev) => {
      const updated = prev.filter((_, i) => i !== index);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
  };

  const updateQuantity = (index, qty) => {
    setCart((prev) => {
      const next = [...prev];
      if (qty <= 0) {
        const filtered = next.filter((_, i) => i !== index);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
        return filtered;
      }
      next[index] = { ...next[index], quantity: qty };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  };

  const clearCart = () => {
    persist([]);
  };

  const removeItems = (indices) => {
    setCart((prev) => {
      const indexSet = new Set(indices);
      const updated = prev.filter((_, i) => !indexSet.has(i));
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
  };

      const loadFromBackend = useCallback(async (userId) => {
    try {
      const [items, storeProducts] = await Promise.all([
        api.getCart(userId),
        api.getStoreProducts().catch(() => []),
      ]);
      if (items && items.length > 0) {
        const priceMap = {};
        for (const p of storeProducts) {
          priceMap[p.id] = { price: Number(p.price), discount: Number(p.discount || 0), imageUrl: p.imageUrl };
        }
        const mapped = items.map(i => {
          const fresh = i.productId ? priceMap[i.productId] : null;
          return {
            type: i.type,
            productId: i.productId,
            name: i.name,
            price: fresh ? fresh.price : Number(i.price),
            discount: fresh ? fresh.discount : (i.discount ? Number(i.discount) : 0),
            imageUrl: fresh ? fresh.imageUrl : i.imageUrl,
            quantity: i.quantity || 1,
            createdAt: new Date(i.createdAt),
          };
        });
        persist(mapped);
      }
    } catch {
      // Backend not available, keep local cart
    }
  }, []);

  const syncToBackend = useCallback(async (userId) => {
    try {
      await api.saveCart(userId, cart.map(i => ({
        type: i.type,
        productId: i.productId,
        name: i.name,
        price: i.price,
        discount: i.discount,
        imageUrl: i.imageUrl,
        quantity: i.quantity || 1,
      })));
    } catch {
      // Backend not available
    }
  }, [cart]);

  // ──────── Wishlist (service cart persistence via orders table) ────────
  const [wishlist, setWishlist] = useState([]);

  const addToWishlist = async (item, userId, userName) => {
    try {
      const cleanItem = {
        category: item.category,
        subcategory: item.subcategory,
        type: item.type,
        brand: item.brand,
        issueDescription: item.issueDescription,
        uploadedImage: item.uploadedImage,
        price: Number(item.price) || 0,
        discount: Number(item.discount) || 0,
        quantity: 1,
      };
      const result = await api.placeOrder({
        userId, userName, type: 'service',
        items: [cleanItem], total: Number(item.price) || 0,
        status: 'wishlist',
      });
      const wishItem = { ...cleanItem, orderId: result.id, createdAt: new Date() };
      setWishlist(prev => [...prev, wishItem]);
      return wishItem;
    } catch (e) {
      console.error('Failed to save wishlist:', e);
      return null;
    }
  };

  const removeFromWishlist = async (orderId) => {
    try {
      await api.updateOrderStatus(orderId, 'cancelled');
      setWishlist(prev => prev.filter(w => w.orderId !== orderId));
    } catch (e) {
      throw new Error('Failed to remove from wishlist');
    }
  };

  const hideFromWishlist = (orderId) => {
    setWishlist(prev => prev.filter(w => w.orderId !== orderId));
  };

  const loadWishlist = useCallback(async (userId) => {
    try {
      const orders = await api.getOrders(userId);
      const wishlistOrders = orders.filter(o => o.status === 'wishlist');
      const items = wishlistOrders.flatMap(order =>
        (order.items || []).map(item => ({
          ...item,
          orderId: order.id,
          createdAt: new Date(order.createdAt),
        }))
      );
      setWishlist(items);
      return items;
    } catch {
      return [];
    }
  }, []);

  const checkoutWishlist = async (address, contact) => {
    const current = wishlist;
    for (const item of current) {
      if (item.orderId) {
        try {
          await api.updateOrderStatus(item.orderId, 'pending', address, contact);
        } catch (e) {
          console.error(`Failed to checkout wishlist item ${item.orderId}:`, e);
        }
      }
    }
    setWishlist([]);
  };

  return (
    <CartContext.Provider value={{ cart, addToCart, removeItem, updateQuantity, clearCart, removeItems, loadFromBackend, syncToBackend,
      wishlist, addToWishlist, removeFromWishlist, hideFromWishlist, loadWishlist, checkoutWishlist }}>
      {children}
    </CartContext.Provider>
  );
};
