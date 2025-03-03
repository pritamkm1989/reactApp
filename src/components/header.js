import React, { useState,useContext,useEffect  } from "react";
import { CartContext } from "../CartContext";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
 

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const { cart } = useContext(CartContext);
  
  useEffect(() => {
    console.log('Header cart update:', cart); // Debug log
}, [cart]);

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
           {/* Cart information */}
           <div className="relative">
              <a href="/cart" className="hover:underline">
                Cart
              </a>
              <span className="absolute top-0 right-0 mt-1 mr-1 px-2 py-1 text-xs font-bold text-white bg-red-600 rounded-full">
                {cart.length}
              </span>
            </div>
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
