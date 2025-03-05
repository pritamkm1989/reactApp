import React, { useState, useContext, useEffect } from "react";
import { CartContext } from "../CartContext";
import cartIcon from "../img/icons8-shopping-cart-48.png";
import { Link } from 'react-router-dom';
const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const { cart } = useContext(CartContext);
  
  useEffect(() => {
    console.log('Header cart update:', cart); // Debug log
  }, [cart]);

  return (
    <header>
      {/* Fixed nav with z-index for proper layering */}
      <nav className=" p-4 fixed top-0 left-0 w-full z-50 shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold"><Link to="/">UrbEx</Link></h1>
          <ul className={`md:flex md:space-x-6 ${isMenuOpen ? "block" : "hidden"} md:block ml-auto`}>
        
            <li><Link to="/service" className="hover:underline">Services</Link></li>
            <li><Link to="/about" className="hover:underline">Doctors</Link></li>
            <li><Link to="#" className="hover:underline">Contact</Link></li>
          </ul>
          {/* Cart information */}
          <div className="relative ml-4">
            <Link to="/cart" className="hover:underline flex items-center">
              <span className="material-icons"><img src={cartIcon}/></span>
              <span className="counter absolute -top-2 -right-2 px-2 py-1 text-xs font-bold text-white bg-red-600 rounded-full">
                {cart.length}
              </span>
            </Link>
          </div>
          <button
            className="md:hidden px-3 py-2 border rounded ml-4"
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
