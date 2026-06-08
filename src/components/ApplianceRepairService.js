import React, { useState, useContext, useEffect, useMemo } from "react";
import { FiUpload, FiShoppingCart, FiArrowRight } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import CartForm from './request/CartForm';
import ServiceList from "./ServiceList";
import ServiceDetail from "./ServiceDetails";
import { CartContext } from "../CartContext";
import { useAuth } from "../AuthContext";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import { Button, Card, Textarea, Select, Spinner, Img } from './ui';
import Stepper from './ui/Stepper';
import { useToast } from './ui/Toast';

const ApplianceRepairService = ({ items, title }) => {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedCategoryName, setSelectedCategoryName] = useState(null);
  const [selectedSubcategory, setSelectedSubcategory] = useState(null);
  const [selectedType, setSelectedType] = useState(null);
  const [selectedBrand, setSelectedBrand] = useState(null);
  const [uploadedImage, setUploadedImage] = useState(null);
  const [issueDescription, setIssueDescription] = useState("");
  const [errors, setErrors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [serviceDetails, setServiceDetails] = useState([]);
  const [serviceDetail, setServiceDetail] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  const navigate = useNavigate();
  const addToast = useToast();
  const { user } = useAuth();
  const { addToCart, addToWishlist } = useContext(CartContext);

  const categories = items;

  const selectedSub = useMemo(() => {
    if (!selectedCategory || !selectedSubcategory) return null;
    return categories
      .find(c => c.id === selectedCategory)
      ?.subcategories.find(s => s.id === selectedSubcategory.id);
  }, [categories, selectedCategory, selectedSubcategory]);

  const hasServiceTypes = selectedSub?.serviceTypes?.length > 0;
  const hasBrands = selectedSub?.brands?.length > 0;

  const serviceTypeIds = useMemo(() => {
    if (hasServiceTypes) {
      return selectedSub.serviceTypes.map(st => st.id);
    }
    return [];
  }, [selectedSub, hasServiceTypes]);

  useEffect(() => {
    if (serviceTypeIds.length === 0) return;
    setLoading(true);
    api.getServiceDetails(serviceTypeIds)
      .then(data => setServiceDetails(data || []))
      .catch(err => console.error("Error fetching service details:", err))
      .finally(() => setLoading(false));
  }, [serviceTypeIds]);

  const fetchServiceDetail = (serviceId) => {
    setLoading(true);
    api.getServiceDetails([serviceId])
      .then(data => setServiceDetail(data?.[0] || null))
      .catch(err => console.error("Error fetching service detail:", err))
      .finally(() => setLoading(false));
  };

  const handleCategoryClick = (category) => {
    setSelectedCategory(cat => cat?.id === category.id ? null : category.id);
    setSelectedCategoryName(category.name);
    setSelectedSubcategory(null);
    setSelectedType(null);
    setSelectedBrand(null);
    setServiceDetail(null);
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) setUploadedImage(URL.createObjectURL(file));
  };

  const getError = (field) => errors.find(e => e.field === field)?.message || '';

  const handleAddToCart = () => {
    const cartForm = new CartForm(
      selectedCategoryName, selectedSubcategory, selectedType,
      selectedBrand, issueDescription, uploadedImage,
      undefined, undefined, undefined, undefined, undefined, undefined,
      serviceDetail?.rate ? Number(serviceDetail.rate) : 0,
      serviceDetail?.discount ? Number(serviceDetail.discount) : 0
    );
    const validationErrors = cartForm.validate();
    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      addToast(validationErrors[0]?.message, 'error');
      return;
    }
    if (user?.id) {
      addToWishlist(cartForm, user.id, user.name);
    } else {
      addToCart(cartForm);
    }
    addToast('Added to cart successfully.', 'success');
  };

  const handleCheckout = () => {
   
    navigate("/cart");
  };

  const openModal = (item) => { setSelectedItem(item); setIsModalOpen(true); };
  const closeModal = () => { setIsModalOpen(false); setSelectedItem(null); };

  const showDetails = selectedType || (!hasServiceTypes && selectedSubcategory);
  const showTypeBrand = selectedSubcategory && hasServiceTypes;

  return (
    <div className="space-y-6">
      {loading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/60 dark:bg-surface-900/60 backdrop-blur-sm">
          <Spinner size="lg" />
        </div>
      )}

      {title && (
        <h2 className="text-xl font-semibold text-surface-900 dark:text-white text-center">{title}</h2>
      )}

      <Stepper
        currentKey={
          !selectedCategory ? 'category'
          : !selectedSubcategory ? 'subcategory'
          : hasServiceTypes && !selectedType ? 'type'
          : 'details'
        }
        hideTypeStep={!hasServiceTypes}
      />

      {/* Categories */}
      <div className="flex flex-wrap justify-center gap-3">
        {categories.map(category => (
          <button
            key={category.id}
            onClick={() => handleCategoryClick(category)}
            className={`px-5 py-2.5 text-sm font-medium rounded-xl transition-all ${
              selectedCategory === category.id
                ? 'bg-primary-500 text-white shadow-soft'
                : 'bg-white dark:bg-surface-800 text-surface-600 dark:text-surface-300 border border-surface-200 dark:border-surface-700 hover:border-primary-300 dark:hover:border-primary-600 hover:text-primary-600 dark:hover:text-primary-400'
            }`}
          >
            {category.name}
          </button>
        ))}
      </div>

      {/* Subcategories */}
      <AnimatePresence>
        {selectedCategory && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.2 }}
          >
            <div className="flex gap-4 overflow-x-auto hide-scrollbar pb-2">
              {categories
                .find(c => c.id === selectedCategory)
                ?.subcategories.map(sub => (
                  <Card
                    key={sub.id}
                    hover
                    padding={false}
                    onClick={() => {
                      setSelectedSubcategory(sub);
                      setSelectedType(null);
                      setSelectedBrand(null);
                      setServiceDetail(null);
                    }}
                    className={`min-w-[160px] w-[160px] cursor-pointer ${
                      selectedSubcategory?.id === sub.id
                        ? 'ring-2 ring-primary-500 border-primary-500'
                        : ''
                    }`}
                  >
                      <div className="aspect-[4/3] overflow-hidden rounded-t-2xl bg-surface-100 dark:bg-surface-700">
                      <Img
                        src={sub.imageUrl}
                        alt={sub.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="p-3">
                      <p className="text-sm font-medium text-surface-700 dark:text-surface-300 text-center truncate">
                        {sub.name}
                      </p>
                    </div>
                  </Card>
                ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Service Type & Brand */}
      <AnimatePresence>
        {showTypeBrand && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            className="grid sm:grid-cols-2 gap-4"
          >
            <Select
              label="Service Type"
              value={selectedType || ""}
              error={getError('type')}
              onChange={(e) => {
                setSelectedType(e.target.value);
                setErrors(errors.filter(err => err.field !== 'type'));
                fetchServiceDetail(e.target.value);
              }}
            >
              <option value="" disabled>Select type</option>
              {selectedSubcategory.serviceTypes.map((type, i) => (
                <option key={i} value={type.id}>{type.serviceType}</option>
              ))}
            </Select>

            {hasBrands && (
              <Select
                label="Brand"
                value={selectedBrand || ""}
                error={getError('brand')}
                onChange={(e) => {
                  setSelectedBrand(e.target.value);
                  setErrors(errors.filter(err => err.field !== 'brand'));
                }}
              >
                <option value="" disabled>Select brand</option>
                {selectedSubcategory.brands.map((brand, i) => (
                  <option key={i} value={brand.brandName}>{brand.brandName}</option>
                ))}
              </Select>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Brand only (when no service types) */}
      <AnimatePresence>
        {selectedSubcategory && !hasServiceTypes && hasBrands && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            className="max-w-xs"
          >
            <Select
              label="Brand"
              value={selectedBrand || ""}
              error={getError('brand')}
              onChange={(e) => {
                setSelectedBrand(e.target.value);
                setErrors(errors.filter(err => err.field !== 'brand'));
              }}
            >
              <option value="" disabled>Select brand</option>
              {selectedSubcategory.brands.map((brand, i) => (
                <option key={i} value={brand.brandName}>{brand.brandName}</option>
              ))}
            </Select>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Description & Upload */}
      <AnimatePresence>
        {showDetails && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
          >
            <Card>
              {serviceDetail && (
                <h3 className="text-lg font-medium text-surface-900 dark:text-white mb-4">
                  {serviceDetail.name}
                  {selectedBrand && <span className="text-surface-500"> — {selectedBrand}</span>}
                </h3>
              )}
              <div className="grid sm:grid-cols-2 gap-4">
                <Textarea
                  label="Describe the issue"
                  placeholder="Please provide a detailed description of the issue you're facing."
                  rows={4}
                  value={issueDescription}
                  error={getError('issueDescription')}
                  onChange={(e) => {
                    setIssueDescription(e.target.value);
                    setErrors(errors.filter(err => err.field !== 'issueDescription'));
                  }}
                />
                <div className="flex flex-col items-center justify-center gap-3">
                  {uploadedImage && (
                    <Img
                      src={uploadedImage}
                      alt="Uploaded preview"
                      className="w-24 h-24 object-cover rounded-xl border border-surface-200 dark:border-surface-600"
                    />
                  )}
                  <label className="flex items-center gap-2 px-4 py-2.5 bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 text-sm font-medium rounded-xl cursor-pointer hover:bg-primary-100 dark:hover:bg-primary-900/50 transition-colors border border-primary-200 dark:border-primary-800">
                    <FiUpload size={16} />
                    Upload Image
                    <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
                  </label>
                  {getError('uploadedImage') && (
                    <p className="text-xs text-error">{getError('uploadedImage')}</p>
                  )}
                </div>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Service List */}
      {showDetails && (
        <ServiceList
          serviceDetail={serviceDetail}
          serviceDetails={serviceDetails || []}
          openModal={openModal}
        />
      )}

      {isModalOpen && selectedItem && (
        <ServiceDetail selectedItem={selectedItem} closeModal={closeModal} />
      )}

      {/* Action Buttons */}
      <div className="flex gap-3 pt-2">
        <Button variant="secondary" size="lg" className="flex-1" onClick={handleAddToCart}>
          <FiShoppingCart size={18} />
          Add to Cart
        </Button>
        <Button variant="primary" size="lg" className="flex-1" onClick={handleCheckout}>
          Checkout
          <FiArrowRight size={18} />
        </Button>
      </div>
    </div>
  );
};

export default ApplianceRepairService;
