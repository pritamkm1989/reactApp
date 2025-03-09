import React, { createContext, useState } from "react";

export const CityContext = createContext();



const cities = ["Bhuabaneswar", "Puri", "Cuttack", "Berhampur"];

export const CityProvider = ({ children }) => {
    const [selectedCity, setSelectedCity] = useState(null);

    const [showCities, setShowCities] = useState(true);

    const addCity = (city) => {
        console.log('Adding to city:', city);
        setSelectedCity(city);
        toggleShowCities();
       
    };

    const toggleShowCities = () => {
        setShowCities(prevShowCities => !prevShowCities);
      };


   



    return (
        <CityContext.Provider value={{ cities, toggleShowCities, showCities, selectedCity, addCity }}>
            {children}
        </CityContext.Provider>
    );
};
