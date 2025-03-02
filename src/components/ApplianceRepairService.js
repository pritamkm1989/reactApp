import React, { useState } from "react";
import { FiUpload } from "react-icons/fi";



const ApplianceRepairService = ({items,title} ) => {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedSubcategory, setSelectedSubcategory] = useState(null);
  const [selectedType, setSelectedType] = useState(null);
  const [selectedBrand, setSelectedBrand] = useState(null);
  const [uploadedImage, setUploadedImage] = useState(null);

  const categories = items;

  const handleCategoryClick = (categoryId) => {
    setSelectedCategory(categoryId === selectedCategory ? null : categoryId);
    setSelectedSubcategory(null);
    setSelectedType(null);
    setSelectedBrand(null); // Reset brand on category change
  };

  const handleSubcategoryClick = (subcategory) => {
    setSelectedSubcategory(subcategory);
    setSelectedType(null);
    setSelectedBrand(null); // Reset brand on subcategory change
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setUploadedImage(URL.createObjectURL(file));
    }
  };

  return (
    <div className="p-4 bg-gray-100 min-h-screen">
      <h1 className="text-center text-2xl font-semibold mb-4">{title}</h1>

      {/* Main Categories */}
      <div className="flex justify-around space-x-6 mb-6">
        {categories.map((category) => (
          <div
            key={category.id}
            onClick={() => handleCategoryClick(category.id)}
            className={`w-1/3 p-4 bg-white border rounded-lg shadow-lg cursor-pointer 
                        hover:bg-gray-200 transition-all ${
                          selectedCategory === category.id ? "border-blue-500" : ""
                        }`}
          >
            <h2 className="text-center text-xl font-medium">{category.name}</h2>
          </div>
        ))}
      </div>

      {/* Subcategories */}
      {selectedCategory && (
        <div className="flex justify-around space-x-6 mb-6">
          {categories
            .find((category) => category.id === selectedCategory)
            .subcategories.map((subcategory) => (
              <div
                key={subcategory.id}
                onClick={() => handleSubcategoryClick(subcategory)}
                className={`w-1/3 p-4 bg-white border rounded-lg shadow-lg cursor-pointer 
                            hover:bg-gray-200 transition-all ${
                              selectedSubcategory?.id === subcategory.id ? "border-blue-500" : ""
                            }`}
              >
                <img
                  src={subcategory.image}
                  alt={subcategory.name}
                  className="w-full h-44 object-cover rounded-lg mb-2"
                />
                <h3 className="text-center">{subcategory.name}</h3>
              </div>
            ))}
        </div>
      )}

      {/* Dropdown for selecting Service Type */}
      {selectedSubcategory && (
         <div className="mt-4 p-4 bg-white border rounded-lg shadow-lg">
         <h3 className="text-lg font-medium mb-2">{selectedSubcategory.name}</h3>
     
         {/* Flex Container for 2 Columns */}
         <div className="flex gap-4 flex-nowrap">
           {/* Service Type Dropdown (always present) */}
           <div className="flex-1">
             <label className="block text-gray-700 font-semibold mb-2">
               Select Type:
             </label>
             <select
               className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
               onChange={(e) => setSelectedType(e.target.value)}
               value={selectedType || ""}
             >
               <option value="" disabled>
                 Select an option
               </option>
               {selectedSubcategory.serviceTypes.map((type, index) => (
                 <option key={index} value={type}>
                   {type}
                 </option>
               ))}
             </select>
           </div>
     
           {/* Brand Dropdown (Only if available) */}
           {selectedSubcategory.brands.length > 0 && (
             <div className="flex-1">
               <label className="block text-gray-700 font-semibold mb-2">
                 Select Brand:
               </label>
               <select
                 className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                 onChange={(e) => setSelectedBrand(e.target.value)}
                 value={selectedBrand || ""}
               >
                 <option value="" disabled>
                   Select a brand
                 </option>
                 {selectedSubcategory.brands.map((brand, index) => (
                   <option key={index} value={brand}>
                     {brand}
                   </option>
                 ))}
               </select>
            </div>
         )}
         </div>
       </div>
        
      )}

      {/* Text Area & Upload Section */}
     {/* Text Area & Upload Section */}
{selectedType && (
  <div className="mt-4 p-6 bg-white border rounded-lg shadow-lg transition-all">
    <h3 className="text-xl font-medium mb-4">
      {selectedType} for {selectedSubcategory.name}
      {selectedBrand && ` - ${selectedBrand}`}
    </h3>

    {/* Grid Layout for Side-by-Side Arrangement */}
    <div className="grid grid-cols-2 gap-6">
      {/* Text Area */}
      <textarea
        className="w-full p-3 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all resize-none"
        placeholder="Describe your issue..."
        rows="4"
      />

      {/* Upload Section */}
      {/* Upload Section */}
      <div className="flex flex-col items-center">
        <label className="w-full flex items-center justify-center p-3 bg-blue-500 text-white rounded-lg cursor-pointer hover:bg-blue-600 transition-all shadow-md">
          <FiUpload className="mr-2 text-lg" />
          Upload Images
          <input
            type="file"
            className="hidden"
            multiple
            onChange={handleFileChange}
          />
        </label>

      
      
    </div>
    </div>
  </div>
)}

{/* Address Fields */}
<div className="grid grid-cols-2 gap-6 mt-6">
      <input
        type="text"
        placeholder="Street"
        className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
      />
      <input
        type="text"
        placeholder="Landmark"
        className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
      />
      <input
        type="text"
        placeholder="City"
        className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
      />
      <input
        type="text"
        placeholder="State"
        className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
      />
    </div>

    {/* Submit Button */}
    <button className="mt-6 w-full bg-green-500 text-white py-2 rounded-lg hover:bg-green-600 transition-all shadow-md">
      Submit Request
    </button>
    </div>
  );
};

export default ApplianceRepairService;
