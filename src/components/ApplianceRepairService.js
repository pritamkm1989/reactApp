import React, { useState, useContext, useEffect } from "react";
import { FiUpload } from "react-icons/fi";
import CartForm from './request/CartForm'
import ServiceList from "./ServiceList";
import ServiceDetail from "./ServiceDetails";
import { CityContext } from '../CityContext'
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { CartContext } from "../CartContext";

const ApplianceRepairService = ({ items, title }) => {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedCategoryName, setSelectedCategoryName] = useState(null);
  const [selectedSubcategory, setSelectedSubcategory] = useState(null);
  const [selectedType, setSelectedType] = useState(null);
  const [selectedBrand, setSelectedBrand] = useState(null);
  const [uploadedImage, setUploadedImage] = useState(null);
  const [issueDescription, setIssueDescription] = useState("");
  const [city, setCity] = useState("");
  const [errors, setErrors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [serviceDetails, setServiceDetails] = useState("");
  const [serviceDetail, setServiceDetail] = useState("");

  const navigate = useNavigate();


  const categories = items;

  const handleCategoryClick = (category) => {
    setSelectedCategory(category.id === selectedCategory ? null : category.id);
    setSelectedCategoryName(category.name === selectedCategoryName ? null : category.name);
    setSelectedSubcategory(null);
    setSelectedType(null);
    setSelectedBrand(null); // Reset brand on category change
    setServiceDetail(null)
  };

  const handleSubcategoryClick = (subcategory) => {
    setSelectedSubcategory(subcategory);
    setSelectedType(null);
    setSelectedBrand(null);
    setServiceDetail(null) // Reset brand on subcategory change
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setUploadedImage(URL.createObjectURL(file));
    }
  };

  const { addToCart } = useContext(CartContext)

  const { selectedCity, toggleShowCities } = useContext(CityContext)

  const getError = (field) => {
    const error = errors.find(error => error.field === field);
    return error ? error.message : '';
  };

  const hasError = (field) => {
    return errors.some(error => error.field === field);
  };

  useEffect(() => {
    if (selectedCity) {
      console.log("Selected city changed:", selectedCity.name);
      setCity(selectedCity.name)
    }
  }, [selectedCity]);

  const handleServiceSelection = (origin) => {
    console.log('handleServiceSelection')
    const cartForm = new CartForm(
      selectedCategoryName,
      selectedSubcategory,
      selectedType,
      selectedBrand,
      issueDescription,
      uploadedImage
    );

    console.log("Service Data:", city);
    const validationErrors = cartForm.validate();
    console.log(validationErrors);
    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      alert(validationErrors[0]?.message);
      return;
    }

    console.log("Service Data:", cartForm); // Debug log

    addToCart(cartForm);

    console.log(origin);
    if ('checkout' === origin) {
      navigate("/cart");
    }else{
      alert('Added to cart successfully.');
      setSelectedSubcategory(null);
      setSelectedType(null);
      setSelectedBrand(null); // Reset brand on category change
      setServiceDetail(null)
    }

  };


  const serviceTypeIds = items
    .flatMap((item) => item.subcategories) // Flatten subcategories
    .flatMap((sub) => sub.serviceTypes) // Flatten serviceTypes
    .map((serviceType) => serviceType.id); // Extract serviceTypeId

  //console.log(serviceTypeIds);

  useEffect(() => {
    if (serviceTypeIds.length === 0) return;
    setLoading(true); // Start loading before API call
    const serviceTypeQuery = serviceTypeIds.join(",");
    axios.get(`${process.env.REACT_APP_BE_APP_API_BASE_URL}/api/service/details?serviceIds=${serviceTypeQuery}`) // 🔹 Replace with your actual API endpoint
      .then(response => {
        // Ensure response.data is in the expected format
        console.log('service/details')
        console.log(response.data);
        setServiceDetails(response.data)
      })
      .catch(error => console.error("Error fetching service details:", error))
      .finally(() => setLoading(false)); // Stop loading after API call
  }, [selectedCategory]);

  const fetchServiceDetils = (serviceId) => {
    console.log('fetchServiceDetils-' + serviceId);
    setLoading(true); // Start loading before API call
    axios.get(`${process.env.REACT_APP_BE_APP_API_BASE_URL}/api/service/details?serviceIds=${serviceId}`) // 🔹 Replace with your actual API endpoint
      .then(response => {
        // Ensure response.data is in the expected format
        console.log('service/details')
        console.log(response.data);
        setServiceDetail(response?.data[0])
      })
      .catch(error => console.error("Error fetching service details:", error))
      .finally(() => setLoading(false)); // Stop loading after API call
  }

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  const openModal = (item) => {
    setSelectedItem(item);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedItem(null);
  };

  return (
    <div className="p-4 bg-gray-100 min-h-screen">
      { loading && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50">
          <div className="w-16 h-16 border-4 border-[rgb(255,198,48)] border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}
      <h1 className="text-center text-2xl font-semibold mb-4">{title}</h1>

      {/* Main Categories */}
      {/* Desktop: Scrollable Row | Mobile: Multi-row List */}
      <div className="w-full flex justify-center mb-8">
        <div className="w-full sm:w-auto">
          <div className="sm:flex sm:overflow-x-auto sm:whitespace-nowrap sm:scrollbar-hide sm:gap-6 sm:px-4">
            {/* Mobile view - Display as Full Width List */}
            <div className="flex flex-wrap gap-6 sm:gap-6 sm:mb-0">
              {categories.map((category) => (
                <div
                  key={category.id}
                  onClick={() => handleCategoryClick(category)}
                  className={`w-full sm:w-auto p-4 bg-white border rounded-lg shadow-lg cursor-pointer 
                  hover:bg-gray-200 transition-all ${selectedCategory === category.id ? "border-[rgb(255,198,48)]" : ""}`}
                >
                  <h2 className="text-center text-xl font-medium">{category.name}</h2>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Next Component (add gap between sections) */}
      <div className="next-component">
        {/* Your next component content */}
      </div>

      {selectedCategory && (
        <div className="w-full mb-6">
          {/* Mobile View - Scrollable */}
          <div className="block sm:hidden">
            <div className="flex justify-start overflow-x-auto scrollbar-hide">
              <div className="flex space-x-4 min-w-max">
                {categories
                  .find((category) => category.id === selectedCategory)
                  .subcategories.map((subcategory) => (
                    <div
                      key={subcategory.id}
                      onClick={() => handleSubcategoryClick(subcategory)}
                      className={`w-48 p-4 bg-white border rounded-lg shadow-lg cursor-pointer hover:bg-gray-200 transition-all ${selectedSubcategory?.id === subcategory.id
                        ? "border-[rgb(255,198,48)]"
                        : ""
                        }`}
                    >
                      <img
                        src={subcategory.imageUrl}
                        alt={subcategory.name}
                        className="w-full h-44 object-cover rounded-lg mb-2"
                      />
                      <h3 className="text-center">{subcategory.name}</h3>
                    </div>
                  ))}
              </div>
            </div>
          </div>

          {/* Desktop View - Scrollable with items visible */}
          <div className="hidden sm:block">
            <div className="flex justify-center overflow-x-auto scrollbar-hide">
              <div className="flex space-x-4 min-w-max">
                {categories
                  .find((category) => category.id === selectedCategory)
                  .subcategories.map((subcategory) => (
                    <div
                      key={subcategory.id}
                      onClick={() => handleSubcategoryClick(subcategory)}
                      className={`w-48 p-4 bg-white border rounded-lg shadow-lg cursor-pointer hover:bg-gray-200 transition-all ${selectedSubcategory?.id === subcategory.id
                        ? "border-[rgb(255,198,48)]"
                        : ""
                        }`}
                    >
                      <img
                        src={subcategory.imageUrl}
                        alt={subcategory.name}
                        className="w-full h-44 object-cover rounded-lg mb-2"
                      />
                      <h3 className="text-center">{subcategory.name}</h3>
                    </div>
                  ))}
              </div>
            </div>
          </div>
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
                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-[rgb(255,198,48)] focus:outline-none"
                onChange={(e) => { setSelectedType(e.target.value); setErrors(errors.filter(error => error.field !== 'type')); fetchServiceDetils(e.target.value) }}
                value={selectedType || ""}
              >
                <option value="" disabled>
                  Select an option
               </option>
                {selectedSubcategory.serviceTypes.map((type, index) => (
                  <option key={index} value={type.id}>
                    {type.serviceType}
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
                  className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-[rgb(255,198,48)] focus:outline-none"
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
                    <option key={index} value={brand.brandName}>
                      {brand.brandName}
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
      {selectedType && (
        <div className="mt-4 p-6 bg-white border rounded-lg shadow-lg transition-all">

          {serviceDetail && (<h3 className="text-xl font-medium mb-4">
            {serviceDetail.name}
            {selectedBrand && ` - ${selectedBrand}`}
          </h3>
          )}

          {/* Grid Layout for Side-by-Side Arrangement */}
          <div className="grid grid-cols-2 gap-6">
            {/* Text Area */}
            <textarea
              className="w-full p-3 border rounded-lg shadow-sm focus:ring-2 focus:ring-[rgb(255,198,48)] focus:outline-none transition-all resize-none"
              placeholder={getError('issueDescription') || 'Please provide a detailed description of issue you are facing.'}
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
              <label className="w-full flex items-center justify-center p-3 bg-[rgb(255,198,48)] text-white rounded-lg cursor-pointer hover:bg-[rgb(255,198,48)] transition-all shadow-md">
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

      {/* Next Component (add gap between sections) */}
      <div className="next-component">
        {/* Your next component content */}
        <hr />
      </div>

      <ServiceList
        serviceDetail={serviceDetail}
        serviceDetails={serviceDetails || []}
        openModal={openModal}
      />
      {/* Modal Popup */}
      {
        isModalOpen && selectedItem && (
          <ServiceDetail selectedItem={selectedItem}   closeModal={closeModal} />
        )
      }


      <div className="mt-6 flex gap-4">
        <button
          onClick={() => handleServiceSelection('addTocart')}
          className="flex-1 bg-[rgb(255,198,48)] text-white py-2 rounded-lg transition-all shadow-md"
        >
          Add to Cart
  </button>

        <button
          onClick={() => handleServiceSelection('checkout')}
          className="flex-1 bg-[rgb(255,198,48)] text-white py-2 rounded-lg transition-all shadow-md"
        >


          Check out

        </button>
      </div>
    </div >
  );
};

export default ApplianceRepairService;
