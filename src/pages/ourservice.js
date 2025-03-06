import React from "react";
import Layout from './layout';
import Appliance from "../components/ApplianceRepairService";
import { useState } from "react";

import { services, categories } from '../services/data';

const ServicePage = () => {

  const [selectedService, setSelectedService] = useState("Appliance"); // Default selection


  return (
    <Layout>
      

      <div className="flex flex-col md:flex-row">
            {/* Side Menu */}
            <div className="flex md:flex-col gap-4 p-4 bg-gray-200 md:min-h-screen w-full md:w-1/4 overflow-x-auto hide-scrollbar">
                {services.map((service) => (
                    <button
                        key={service.id}
                        className={`px-4 py-2 text-xl  rounded-lg font-semibold   hover:bg-green-600 transition-all
                        ${selectedService === service.id ? "bg-blue-600 text-white" : "bg-white text-gray-800 hover:bg-green-600"
                        }`}
                        onClick={() => setSelectedService(service.id)}
                    >
                        {service.name}
                    </button>
                ))}
            </div>

          {/* Main Content */}
          <div className="w-full p-4">
            {/* Display Only the Selected Component */}
            {Object.entries(categories).map(([key, value]) => {
              const serviceId = key.replace("Categories", "");
              if (selectedService === serviceId) {
                return (
                  <Appliance
                    key={key}
                    items={value}
                    title={services.find(service => service.id === serviceId).name}
                  />
                );
              }
              return null;
            })}
          </div>

      </div>

    </Layout>
  );
};

export default ServicePage;
