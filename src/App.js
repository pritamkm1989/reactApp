import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './pages/home';
import AboutPage from './pages/about';
import ServicePage from './pages/ourservice';
import Cart from './pages/cart';
import ContactPage from './pages/contact'
import { CartProvider } from './CartContext'

const App = () => {
  return (
    <CartProvider>
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/service" element={<ServicePage />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/contact" element={<ContactPage />} />
      </Routes>
    </Router>
    </CartProvider>
  );
};

export default App;
