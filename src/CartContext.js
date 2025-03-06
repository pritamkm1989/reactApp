import React, { createContext, useState } from "react";

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const [cart, setCart] = useState([]);

    const addToCart = (service) => {
        console.log('Adding to cart:', service); 
        setCart((prevCart) => [...prevCart, service]);
    };

    const removeItem = (index) => {
        setCart((prevCart) => prevCart.filter((item, i) => i !== index));
      };

    return (
        <CartContext.Provider value={{ cart, addToCart, removeItem }}>
            {children}
        </CartContext.Provider>
    );
};
