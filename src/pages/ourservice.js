import React from "react";
import Layout from './layout';
import Appliance from "../components/ApplianceRepairService";
import { useState } from "react";

import { categories } from '../services/data';

const ServicePage = () => {

  const [selectedService, setSelectedService] = useState(1); // Default selection
  const allCategories = Object.values(categories).flat();
  const allCategories2 = Object.values(categories).flat();


  return (
    <Layout>


      <div className="flex flex-col md:flex-row">
        {/* Side Menu */}

        <div className="flex md:flex-col gap-4 p-4 bg-gray-200 md:min-h-screen w-full md:w-1/4 overflow-x-auto hide-scrollbar">

          {allCategories && allCategories.map((cat) => {
            if (cat.homePageEnabled) {
              return (<button
                key={cat.id}
                className={`px-4 py-2 text-xl  rounded-lg font-semibold    transition-all
                        ${selectedService === cat.id ? "bg-[rgb(255,198,48)] text-white" : "bg-white text-gray-800 "
                  }`}
                onClick={() => setSelectedService(cat.id)}
              >
                {cat.name}
              </button>)
            }
            return null;
          })}
        </div>

        {/* Main Content */}
        <div className="w-full p-4">
          {/* Display Only the Selected Component */}
          {allCategories2.map((value) => {
            if (selectedService === value.id) {
              return (
                <Appliance
                  key={value.id}
                  items={value.items}
                  title={value.name}
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
