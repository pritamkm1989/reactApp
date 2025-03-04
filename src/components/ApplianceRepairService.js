import React, { useState, useContext } from "react";
import { FiUpload } from "react-icons/fi";
import CartForm from './request/CartForm'

import { CartContext } from "../CartContext";

const ApplianceRepairService = ({ items, title }) => {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedSubcategory, setSelectedSubcategory] = useState(null);
  const [selectedType, setSelectedType] = useState(null);
  const [selectedBrand, setSelectedBrand] = useState(null);
  const [uploadedImage, setUploadedImage] = useState(null);
  const [issueDescription, setIssueDescription] = useState("");
  const [street, setStreet] = useState("");
  const [landmark, setLandmark] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [errors, setErrors] = useState([]);
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");

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

  const { addToCart } = useContext(CartContext)

  const getError = (field) => {
    const error = errors.find(error => error.field === field);
    return error ? error.message:'';
  };

  const hasError = (field) => {
    return errors.some(error => error.field === field);
  };
  

  const handleServiceSelection = (service) => {
    console.log('')
    const cartForm = new CartForm(
      selectedCategory,
      selectedSubcategory,
      selectedType,
      selectedBrand,
      issueDescription,
      uploadedImage,
      street,
      landmark,
      city,
      state,
      email,
      mobile
    );

    console.log("Service Data:", cartForm); 
    const validationErrors = cartForm.validate();
    console.log(validationErrors);
    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      return;
    }

    console.log("Service Data:", cartForm); // Debug log

    addToCart(cartForm);
  };

  const gridColumnsClass = categories.length === 2 ? 'grid-cols-2' : 
                          categories.length === 3 ? 'lg:grid-cols-3 xl:grid-cols-4' :
                          'sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4';
  return (
    <div className="p-4 bg-gray-100 min-h-screen">
      <h1 className="text-center text-2xl font-semibold mb-4">{title}</h1>

    {/* Main Categories */}
<div className={`grid gap-6 mb-6 ${gridColumnsClass}`}>
  {categories.map((category) => (
    <div
      key={category.id}
      onClick={() => handleCategoryClick(category.id)}
      className={`p-4 bg-white border rounded-lg shadow-lg cursor-pointer 
                  hover:bg-gray-200 transition-all ${selectedCategory === category.id ? "border-blue-500" : ""
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
                            hover:bg-gray-200 transition-all ${selectedSubcategory?.id === subcategory.id ? "border-blue-500" : ""
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
                onChange={(e) => {setSelectedType(e.target.value);setErrors(errors.filter(error => error.field !== 'type')); }}
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
              {errors.find(error => error.field === 'type') && (
                <span className="text-red-500">{errors.find(error => error.field === 'type').message}</span>
              )}
            </div>

            {/* Brand Dropdown (Only if available) */}
            {selectedSubcategory.brands.length > 0 && (
              <div className="flex-1">
                <label className="block text-gray-700 font-semibold mb-2">
                  Select Brand:
               </label>
                <select
                  className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  onChange=
                  {(e) => {
                    setSelectedBrand(e.target.value);
                    setErrors(errors.filter(error => error.field !== 'brand')); // Remove error on selection
                  }}
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
                {errors.find(error => error.field === 'brand') && (
                  <span className="text-red-500">{errors.find(error => error.field === 'brand').message}</span>
                )}
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
              placeholder={getError('issueDescription') || 'Comments'}
              style={{
                borderColor: hasError('issueDescription') ? 'red' : 'initial',
                borderWidth: hasError('issueDescription') ? '2px' : '0'
              }}
              rows="4"
              onChange={(e) => setIssueDescription(e.target.value)}
              onFocus={() => setErrors(errors.filter(error => error.field !== 'issueDescription'))} 
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

              {errors.find(error => error.field === 'uploadedImage') && (
                <span className="text-red-500">{errors.find(error => error.field === 'uploadedImage').message}</span>
              )}

            </div>
          </div>
        </div>
      )}

      {/* Address Fields */}
      <div className="grid grid-cols-2 gap-6 mt-6">
        <input
          type="text"
          placeholder={getError('street') || 'street'}
          style={{
            borderColor: hasError('street') ? 'red' : 'initial',
            borderWidth: hasError('street') ? '2px' : '0'
          }}
          className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
          onChange={(e) => setStreet(e.target.value)}
          onFocus={() => setErrors(errors.filter(error => error.field !== 'street'))} 
        />
      
        <input
          type="text"
          placeholder="Landmark"
          className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
          onChange={(e) => setLandmark(e.target.value)}
        />
       
        
        <input
          type="text"
          placeholder= {getError('city') || 'city'}
          style={{
            borderColor: hasError('city') ? 'red' : 'initial',
            borderWidth: hasError('city') ? '2px' : '0'
          }}
          className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
          onChange={(e) => setCity(e.target.value)}
          onFocus={() => setErrors(errors.filter(error => error.field !== 'city'))} 
        />
       
        <input
          type="text"
          placeholder={getError('state') || 'state'}
          style={{
            borderColor: getError('state') ? 'red' : 'initial',
            borderWidth: getError('state') ? '2px' : '0'
          }}
          className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
          onChange={(e) => setState(e.target.value)}
          onFocus={() => setErrors(errors.filter(error => error.field !== 'state'))} 
        />

        
        {/* email and mobile */}

        <input
          type="text"
          placeholder= {getError('email') || 'Email Address'}
          style={{
            borderColor: hasError('email') ? 'red' : 'initial',
            borderWidth: hasError('email') ? '2px' : '0'
          }}
          className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
          onChange={(e) => setEmail(e.target.value)}
          onFocus={() => setErrors(errors.filter(error => error.field !== 'email'))} 
        />
       
        <input
          type="text"
          placeholder={getError('mobile') || 'Mobile Number'}
          style={{
            borderColor: getError('mobile') ? 'red' : 'initial',
            borderWidth: getError('mobile') ? '2px' : '0'
          }}
          className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
          onChange={(e) => setMobile(e.target.value)}
          onFocus={() => setErrors(errors.filter(error => error.field !== 'mobile'))} 
        />
        
      </div>

      {/* Submit Button */}
      <button onClick={() => handleServiceSelection()} className="mt-6 w-full bg-blue-600 text-white  text-white py-2 rounded-lg hover:bg-green-600 transition-all shadow-md">
        Add to Cart !!!
    </button>
    </div>
  );
};

export default ApplianceRepairService;
