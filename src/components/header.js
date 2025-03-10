import React, { useState, useContext, useEffect } from "react";
import { CartContext } from "../CartContext";
import { CityContext } from "../CityContext";
import { FaMapMarkerAlt } from "react-icons/fa";
import { MdNotificationsActive } from "react-icons/md";
import { FaUserLock } from "react-icons/fa6";
import { Link } from "react-router-dom";
import LoginModal from './LoginForm'
import urbex from "../img/urbex.png";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
 
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  
  const openLoginModal = () => setIsLoginModalOpen(true);
  const closeLoginModal = () => setIsLoginModalOpen(false);


  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const { cart } = useContext(CartContext);
  const { cities,toggleShowCities ,showCities,selectedCity,addCity} = useContext(CityContext);

  useEffect(() => {
    console.log("Header cart update:", cart); // Debug log
  }, [cart]);
  
  

  return (
    <header>
      {/* Fixed nav with z-index for proper layering */}
      <nav className="p-1 fixed top-0 left-0 w-full z-50 shadow-md bg-white">
        <div className="container mx-auto flex justify-between items-center">
          {/* Logo */}
          <h1 className="text-2xl font-bold">
            <Link to="/"><img src={urbex} className = "w-16 h-16" /></Link>
          </h1>





          {/* Menu Items */}
          <ul
            className={`md:flex md:space-x-6  hidden md:block ml-auto`}
          >
            <li>
              <Link to="/service" className="">
                Services
              </Link>
            </li>
            <li>
              <Link to="/about" className="">
                About Us
              </Link>
            </li>
            <li>
              <Link to="/contact" className="">
                Contact
              </Link>
            </li>
          </ul>

          {/* Login Button */}
          <div className = "p-3">
            <FaUserLock className="text-xl" onClick={openLoginModal}/>
            </div>

          {/* Login Modal */}
          <LoginModal isOpen={isLoginModalOpen} onClose={closeLoginModal} />

          {/* Cart Information */}
          <div className="relative ml-4">
            <Link to="/cart" className="hover:underline flex items-center">
             
              <MdNotificationsActive className="p2 text-xl">
                </MdNotificationsActive> 
              <span className="counter absolute top-2 -right-2 px-2 py-1 text-xs font-bold text-white bg-[rgb(255,198,48)] rounded-full">
                {cart.length}
              </span>
            </Link>
          </div>

          {/* City Selector (Aligned to the right) */}
          <div className="relative ml-4">
            {showCities && (<button
              className="p-2 rounded-full hover:bg-gray-200"
              onClick={() => toggleShowCities()}
            >
              <FaMapMarkerAlt className="text-[rgb(255,198,48)] text-lg" />
            </button>)}

            {/* City List (Dropdown) */}
            {showCities && (
              <ul className="absolute right-0 mt-2 bg-white border shadow-lg rounded-lg w-40 z-50">
                {cities.map((city, index) => (
                  <li
                    key={index}
                    className="p-2 hover:bg-gray-100 cursor-pointer"
                    onClick={() => {
                      addCity(city);
                    }}
                  >
                    {city.name}
                  </li>
                ))}
              </ul>
            )}
          </div>


          {/* City Display for Desktop (Aligned to the right) */}
          {selectedCity && (
            <span className="md:block ml-4 text-gray-700 font-semibold" onClick={() => toggleShowCities()}>
              {selectedCity.name}
            </span>
          )}


          {/* Mobile Menu Toggle */}
          <div className="md:hidden relative ml-4">
            <button
              className=" px-3 py-2 border rounded ml-4"
              onClick={toggleMenu}
            >
              ☰
          </button>

            {isMenuOpen && (

              <ul
                className="absolute right-0 mt-2 bg-white border shadow-lg rounded-lg w-30 z-50"
              >
                <li>
                  <Link to="/service" className="px-1 py-1 text-s  rounded-lg  hover:bg-[rgb(255,198,48)] transition-all cursor-pointer">
                    Services
</Link>
                </li>
                <li>
                  <Link to="/about" className="px-1 py-1 text-s  rounded-lg  hover:bg-[rgb(255,198,48)] transition-all cursor-pointer">
                    About
</Link>
                </li>
                <li>
                  <Link to="/contact" className="px-1 py-1 text-s  rounded-lg  hover:bg-[rgb(255,198,48)] transition-all cursor-pointer">
                    Contact
</Link>
                </li>
              </ul>
            )}

          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;
