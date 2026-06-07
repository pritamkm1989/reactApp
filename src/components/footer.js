import React from "react";
import { Link } from "react-router-dom";
import { FiMapPin, FiPhone, FiMail, FiClock } from "react-icons/fi";

const Footer = () => {
  return (
    <footer className="bg-surface-900 dark:bg-surface-950 text-surface-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand */}
          <div className="sm:col-span-2 lg:col-span-1">
            <h3 className="text-white text-lg font-bold mb-4">UrbEx</h3>
            <p className="text-sm leading-relaxed text-surface-400">
              Expert service and repair for a wide range of products and appliances. Quality and reliability guaranteed.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white text-sm font-semibold uppercase tracking-wider mb-4">Quick Links</h4>
            <ul className="space-y-2.5">
              {[
                { to: "/", label: "Home" },
                { to: "/service", label: "Services" },
                { to: "/about", label: "About Us" },
                { to: "/contact", label: "Contact" },
              ].map(link => (
                <li key={link.to}>
                  <Link to={link.to} className="text-sm text-surface-400 hover:text-primary-400 transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-white text-sm font-semibold uppercase tracking-wider mb-4">Services</h4>
            <ul className="space-y-2.5">
              {["AC Repair", "Washing Machine", "Refrigerator", "Microwave", "Home Appliances"].map(s => (
                <li key={s}>
                  <Link to="/service" className="text-sm text-surface-400 hover:text-primary-400 transition-colors">
                    {s}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white text-sm font-semibold uppercase tracking-wider mb-4">Contact</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-2.5 text-sm text-surface-400">
                <FiMapPin size={16} className="mt-0.5 shrink-0 text-primary-500" />
                <span>Bhubaneswar, Odisha</span>
              </li>
              <li className="flex items-center gap-2.5 text-sm text-surface-400">
                <FiPhone size={16} className="shrink-0 text-primary-500" />
                <span>+91 12345 67890</span>
              </li>
              <li className="flex items-center gap-2.5 text-sm text-surface-400">
                <FiMail size={16} className="shrink-0 text-primary-500" />
                <span>info@urbex.in</span>
              </li>
              <li className="flex items-center gap-2.5 text-sm text-surface-400">
                <FiClock size={16} className="shrink-0 text-primary-500" />
                <span>Mon–Sat, 9AM–8PM</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-surface-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-surface-500">
          <p>© 2025 UrbEx. All rights reserved.</p>
          <div className="flex gap-6">
            <Link to="/" className="hover:text-primary-400 transition-colors">Terms & Conditions</Link>
            <Link to="/" className="hover:text-primary-400 transition-colors">Privacy Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
