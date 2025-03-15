import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './pages/home';
import AboutPage from './pages/about';
import ServicePage from './pages/ourservice';
import AdminPage from './pages/admin'
import Cart from './pages/cart';
import ContactPage from './pages/contact'
import { CartProvider } from './CartContext'
import { CityProvider } from './CityContext'

const App = () => {
  return (
    <CityProvider>
      <CartProvider>
        <Router>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/service" element={<ServicePage />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/admin" element={<AdminPage />} />
          </Routes>
        </Router>
      </CartProvider>
    </CityProvider>
  );
};

export default App;
