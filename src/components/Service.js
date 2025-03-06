

import { useState } from "react";
import Appliance from "../components/ApplianceRepairService";


import { homeServices, categories } from '../services/data';




const Service = () => {
    const [selectedService, setSelectedService] = useState("Appliance"); // Default selection
    

    return (
        <div className="flex flex-col items-center">
            {/* Service Selection Links */}
            <div className="flex gap-6 mb-6">
                {homeServices.map((service) => (
                    <button
                        key={service.id}
                        className={`text-xl font-semibold transition ${selectedService === service.id ? "text-blue-600 font-bold" : "text-gray-800"
                            }`}
                        onClick={() => setSelectedService(service.id)}
                    >
                        {service.name}
                    </button>
                ))}
            </div>

             {/* Display Only the Selected Component */}

             <div className="w-full">
             {Object.entries(categories).map(([key, value]) => {
                    const serviceId = key.replace("Categories", "");
                    if (selectedService === serviceId) {
                        return (
                            <Appliance
                                key={key}
                                items={value}
                                title={homeServices.find(service => service.id === serviceId).name}
                            />
                        );
                    }
                    return null;
                })}
            </div>


        </div>
    );
};

export default Service;