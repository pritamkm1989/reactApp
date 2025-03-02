import React, { useState } from "react";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <header>
      {/* Sticky nav with z-index for proper layering */}
      <nav className="bg-blue-600 p-4 text-white sticky top-0 z-50 shadow-md w-full">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">UrbEx</h1>
          <ul className={`md:flex space-x-6 ${isMenuOpen ? "block" : "hidden"}`}>
            <li><a href="/" className="hover:underline">Home</a></li>
            <li><a href="/about" className="hover:underline">Services</a></li>
            <li><a href="/about" className="hover:underline">Doctors</a></li>
            <li><a href="#" className="hover:underline">Contact</a></li>
          </ul>
          <button
            className="md:hidden px-3 py-2 border rounded"
            onClick={toggleMenu}
          >
            ☰
          </button>
        </div>
      </nav>
    </header>
  );
};

export default Header;
