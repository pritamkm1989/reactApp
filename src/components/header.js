import React, { useState, useContext, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useLocation } from "react-router-dom";
import { CartContext } from "../CartContext";
import { CityContext } from "../CityContext";
import { FiMapPin, FiBell, FiUser, FiMenu, FiX, FiMoon, FiSun } from "react-icons/fi";
import { useTheme } from '../ThemeContext';
import LoginModal from './LoginForm';
import urbex from "../img/urbex.png";
import urbexDark from "../img/urbex.png";

const navLinks = [
  { to: "/service", label: "Services" },
  { to: "/about", label: "About Us" },
  { to: "/contact", label: "Contact" },
  { to: "/admin", label: "Admin" },
];

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const { cart } = useContext(CartContext);
  const { cities, toggleShowCities, showCities, selectedCity, addCity } = useContext(CityContext);
  const { dark, toggleTheme } = useTheme();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setIsMenuOpen(false);
  }, [location]);

  const headerBg = scrolled
    ? 'bg-white/90 dark:bg-surface-900/90 backdrop-blur-md shadow-soft'
    : 'bg-white dark:bg-surface-900';

  return (
    <>
      <header className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${headerBg}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center gap-2 shrink-0">
              <img src={dark ? urbexDark : urbex} alt="UrbEx" className="w-10 h-10" />
            </Link>

            <nav className="hidden md:flex items-center gap-1">
              {navLinks.map(link => {
                const isActive = location.pathname === link.to;
                return (
                  <Link
                    key={link.to}
                    to={link.to}
                    className={`relative px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                      isActive
                        ? 'text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/30'
                        : 'text-surface-600 dark:text-surface-400 hover:text-surface-900 dark:hover:text-surface-100 hover:bg-surface-50 dark:hover:bg-surface-800'
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </nav>

            <div className="flex items-center gap-1">
              {/* City Selector */}
              <div className="relative">
                <button
                  onClick={toggleShowCities}
                  className="p-2 rounded-lg text-surface-500 dark:text-surface-400 hover:text-surface-700 dark:hover:text-surface-200 hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors"
                >
                  <FiMapPin size={18} />
                </button>
                <AnimatePresence>
                  {showCities && (
                    <motion.div
                      initial={{ opacity: 0, y: -8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 mt-2 w-44 bg-white dark:bg-surface-800 rounded-xl shadow-soft-lg border border-surface-100 dark:border-surface-700 py-1 z-50"
                    >
                      {cities.map((city, index) => (
                        <button
                          key={index}
                          onClick={() => addCity(city)}
                          className={`w-full text-left px-4 py-2 text-sm transition-colors hover:bg-surface-50 dark:hover:bg-surface-700 ${
                            selectedCity?.name === city.name
                              ? 'text-primary-600 dark:text-primary-400 font-medium'
                              : 'text-surface-700 dark:text-surface-300'
                          }`}
                        >
                          {city.name}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {selectedCity && (
                <span className="hidden sm:inline-flex items-center gap-1 text-xs font-medium text-surface-500 dark:text-surface-400 bg-surface-50 dark:bg-surface-800 px-2.5 py-1 rounded-full">
                  <FiMapPin size={12} />
                  {selectedCity.name}
                </span>
              )}

              {/* Theme Toggle */}
              <button
                onClick={toggleTheme}
                className="p-2 rounded-lg text-surface-500 dark:text-surface-400 hover:text-surface-700 dark:hover:text-surface-200 hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors"
                title={dark ? 'Switch to light mode' : 'Switch to dark mode'}
              >
                {dark ? <FiSun size={18} /> : <FiMoon size={18} />}
              </button>

              {/* Login */}
              <button
                onClick={() => setIsLoginModalOpen(true)}
                className="p-2 rounded-lg text-surface-500 dark:text-surface-400 hover:text-surface-700 dark:hover:text-surface-200 hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors"
              >
                <FiUser size={18} />
              </button>

              {/* Cart */}
              <Link to="/cart" className="relative p-2 rounded-lg text-surface-500 dark:text-surface-400 hover:text-surface-700 dark:hover:text-surface-200 hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors">
                <FiBell size={18} />
                {cart.length > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-4.5 h-4.5 flex items-center justify-center bg-primary-500 text-white text-[10px] font-bold rounded-full">
                    {cart.length}
                  </span>
                )}
              </Link>

              {/* Mobile menu toggle */}
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="md:hidden p-2 rounded-lg text-surface-500 dark:text-surface-400 hover:text-surface-700 dark:hover:text-surface-200 hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors"
              >
                {isMenuOpen ? <FiX size={20} /> : <FiMenu size={20} />}
              </button>
            </div>
          </div>
        </div>

        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="md:hidden overflow-hidden border-t border-surface-100 dark:border-surface-700 bg-white dark:bg-surface-900"
            >
              <div className="px-4 py-3 space-y-1">
                {navLinks.map(link => {
                  const isActive = location.pathname === link.to;
                  return (
                    <Link
                      key={link.to}
                      to={link.to}
                      className={`block px-3 py-2.5 text-sm font-medium rounded-lg transition-colors ${
                        isActive
                          ? 'text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/30'
                          : 'text-surface-600 dark:text-surface-400 hover:text-surface-900 dark:hover:text-surface-100 hover:bg-surface-50 dark:hover:bg-surface-800'
                      }`}
                    >
                      {link.label}
                    </Link>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      <LoginModal isOpen={isLoginModalOpen} onClose={() => setIsLoginModalOpen(false)} />
    </>
  );
};

export default Header;
