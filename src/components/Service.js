import { useState, useEffect } from "react";
import api from "../services/api";
import Appliance from "../components/ApplianceRepairService";

const Service = () => {
  const [selectedService, setSelectedService] = useState(null);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    api.getProducts()
      .then(data => {
        setCategories(data);
        const firstEnabled = data.find(c => c.homePageEnabled);
        if (firstEnabled) setSelectedService(firstEnabled.id);
      })
      .catch(err => console.error("Error fetching product:", err));
  }, []);

  const enabledCategories = categories.filter(cat => cat.homePageEnabled);

  if (enabledCategories.length === 0) {
    return (
      <div className="text-center py-12 text-surface-400">
        No services available right now.
      </div>
    );
  }

  return (
    <div>
      {/* Category Pills */}
      <div className="flex flex-wrap justify-center gap-2 mb-8">
        {enabledCategories.map(cat => (
          <button
            key={cat.id}
            onClick={() => setSelectedService(cat.id)}
            className={`px-4 py-2 text-sm font-medium rounded-xl transition-all ${
              selectedService === cat.id
                ? 'bg-primary-500 text-white shadow-soft'
                : 'bg-white text-surface-600 border border-surface-200 hover:border-primary-300 hover:text-primary-600'
            }`}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {/* Selected Service */}
      <div>
        {categories.map(value => {
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
