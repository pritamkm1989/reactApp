import React, { createContext, useState } from "react";

export const CityContext = createContext();



const cities = [{ name: "Bhubaneswar", pin : [751001,751002,751003,751004] },
  { name: "Puri", pin: [752001,752002,752003] },
  { name: "Cuttack", pin: [753001,753002] },
  { name: "Berhampur", pin: [760001,760002] }]

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
