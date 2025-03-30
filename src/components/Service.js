
import { useState, useEffect } from "react";
import Appliance from "../components/ApplianceRepairService";
import { categories } from '../services/data';
import axios from "axios";


const Service = () => {
  const [selectedService, setSelectedService] = useState(1); // Default selection
  const [categories, setCategories] = useState([]);
  const allCategories = categories;
  const allCategories2 = categories;

  console.log("API BASE URL:", process.env.REACT_APP_BE_APP_API_BASE_URL);

  useEffect(() => {
    axios.get(`${process.env.REACT_APP_BE_APP_API_BASE_URL}/api/product`) // 🔹 Replace with your actual API endpoint
      .then(response => {
        // Ensure response.data is in the expected format
        console.log('fetch')
        const allCategories = response.data;
        setCategories(allCategories);
      })
      .catch(error => console.error("Error fetching product:", error));
  }, []);

  return (
    <div className="flex flex-col items-center mt-5">
      {/* Service Selection Links */}
      <div className={`w-full overflow-x-auto flex gap-2 mb-6 px-4    rounded-lg scrollable-container ${allCategories.filter(cat => cat.homePageEnabled).length > 5? 'lg:justify-start' : 'lg:justify-center'}`}>
      <div className="flex gap-6 whitespace-nowrap min-w-max">
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
      </div>
      {/* Display Only the Selected Component */}

      <div className="w-full">
        {allCategories2.map((value) => {

          if (selectedService === value.id) {
            return (
              <Appliance
                key={value.id}
                items={value.categories}
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