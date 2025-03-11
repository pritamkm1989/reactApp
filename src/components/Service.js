
import { useState } from "react";
import Appliance from "../components/ApplianceRepairService";
import { categories } from '../services/data';


const Service = () => {
    const [selectedService, setSelectedService] = useState(1); // Default selection
    const allCategories = Object.values(categories).flat();
    const allCategories2 = Object.values(categories).flat();

    return (
        <div className="flex flex-col items-center">
            {/* Service Selection Links */}
            <div className="flex gap-6 mb-6">
            {allCategories && allCategories.map((cat) => {
            if ( cat.homePageEnabled) {
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

             {/* Display Only the Selected Component */}

             <div className="w-full">
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
    );
};

export default Service;