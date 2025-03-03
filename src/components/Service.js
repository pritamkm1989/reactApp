

import { useState } from "react";
import Appliance from "../components/ApplianceRepairService";


import { AutomobileCategories, ApplianceCategories, KitchenCategories, HouseholdCategories } from '../services/data';



const services = [
    { id: "Appliance", name: "Appliance" },
    { id: "Automobile", name: "Automobile" },
    { id: "Kitchen", name: "Kitchen" },
    { id: "Household", name: "Household" }
];


const Service = () => {
    const [selectedService, setSelectedService] = useState("Appliance"); // Default selection

    

    return (
        <div className="flex flex-col items-center">
            {/* Service Selection Links */}
            <div className="flex gap-6 mb-6">
                {services.map((service) => (
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
                {selectedService === "Appliance" && <Appliance items={ApplianceCategories} title="Appliance Repair & Service" />}
                {selectedService === "Automobile" && <Appliance items={AutomobileCategories} title="Automobile Repair & Service" />}
                {selectedService === "Kitchen" && <Appliance items={KitchenCategories} title="Kitchen Repair & Service" />}
                {selectedService === "Household" && <Appliance items={HouseholdCategories} title="Household Repair & Service" />}
            </div>

        </div>
    );
};

export default Service;