import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './pages/home';
import AboutPage from './pages/about';
import { CartProvider } from './CartContext'

const App = () => {
  return (
    <CartProvider>
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
      </Routes>
    </Router>
    </CartProvider>
  );
};

export default App;
