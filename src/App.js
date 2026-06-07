import React from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import HomePage from './pages/home';
import AboutPage from './pages/about';
import ServicePage from './pages/ourservice';
import AdminPage from './pages/admin';
import Cart from './pages/cart';
import ContactPage from './pages/contact';
import NotFoundPage from './pages/404';
import { CartProvider } from './CartContext';
import { CityProvider } from './CityContext';
import { ThemeProvider } from './ThemeContext';

const pageVariants = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.3, ease: 'easeOut' } },
  exit: { opacity: 0, y: -12, transition: { duration: 0.2, ease: 'easeIn' } },
};

const AnimatedRoutes = () => {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <motion.div key={location.pathname} variants={pageVariants} initial="initial" animate="animate" exit="exit">
        <Routes location={location}>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/service" element={<ServicePage />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </motion.div>
    </AnimatePresence>
  );
};

const App = () => {
  return (
    <ThemeProvider>
      <CityProvider>
        <CartProvider>
          <Router>
            <AnimatedRoutes />
          </Router>
        </CartProvider>
      </CityProvider>
    </ThemeProvider>
  );
};

export default App;
