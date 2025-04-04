import React from "react";
import { FiUpload } from "react-icons/fi";
import { useState, useEffect } from "react";
import axios from "axios";
import { uploadImage } from '../services/ImageUpload'
import AdminServiceDetail from './AdminServiceDetail'


const AdminProduct = () => {
    const [products, setProducts] = useState([]);
    const [isAlertOpen, setIsAlertOpen] = useState(false);
    const [inputValue, setInputValue] = useState("");
    const [newSubCategory, setNewSubCategory] = useState("");
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [selectedProductId, setSelectedProductId] = useState(null);
    const [action, setAction] = useState(null);
    const [refreshKey, setRefreshKey] = useState(0);
    const [loading, setLoading] = useState(false);
    const [subCategoryId, setSubCategoryId] = useState(null);
    const [uploadedImages, setUploadedImages] = useState({});
    const [isServiceDtlModalOpen, setisServiceDtlModalOpen] = useState(false);
    const [serviceDetail, setServiceDetail] = useState(null);
    const [serviceId, setServiceId] = useState(null);


    const openServiceModal = async (id) => {
        console.log('serviceid ' + id);
        setServiceId(id);
        console.log(id);
        const details = await apiGet(`${process.env.REACT_APP_BE_APP_API_BASE_URL}/api/service/${id}/details`)
        console.log('details' + details)
        
        setServiceDetail(details)
        setisServiceDtlModalOpen(true);
    };

    const closeModal = () => {
        setisServiceDtlModalOpen(false);
        setServiceDetail(null);
    };

    useEffect(() => {
        setLoading(true); // Start loading before API call
        axios.get(`${process.env.REACT_APP_BE_APP_API_BASE_URL}/api/product/all`) // 🔹 Replace with your actual API endpoint
            .then(response => {
                // Ensure response.data is in the expected format
                console.log('fetch')
                setProducts(response.data);
                console.log(response.data);
                if (selectedCategory) {
                    const updatedCategory = response.data
                        .find((p) => p.id === selectedProductId)
                        ?.categories.find((c) => c.id === selectedCategory.id);

                    setSelectedCategory(updatedCategory);
                }
            })
            .catch(error => console.error("Error fetching product:", error))
            .finally(() => setLoading(false)); // Stop loading after API call
    }, [refreshKey]);

    const apiPost = async (url, body) => {
        setLoading(true);
        console.log(body)
        try {
            const response = await fetch(url, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body),
            });
            return await response.json();
        } catch (error) {
            console.error(`Error in API call: ${url}`, error);
        } finally {
            setLoading(false);
        }
    };

    const apiGet = async (url) => {
        setLoading(true);
        try {
            const response = await axios.get(url);
            return response.data; // Return the response data
        } catch (error) {
            console.error("Error fetching product:", error);
            return null; // Optionally return null or a default value if there's an error
        } finally {
            setLoading(false); // Stop loading after API call
        }
    };

    const addNewCategory = async (categoryName) => {

        await apiPost(`${process.env.REACT_APP_BE_APP_API_BASE_URL}/api/product/saveOrUpdateCategory`, { name: categoryName, productId: selectedProductId });
        setRefreshKey((prevKey) => prevKey + 1); // Increment refreshKey

    };
    const viewCategory = (productId, categoryId) => {
        console.log(productId, categoryId);
        const product = products.find((pro) => pro.id === productId).categories;
        const category = product.find((cat) => cat.id === categoryId)
        setSelectedCategory(category);
        setSelectedProductId(productId);
    };

    const addNewProduct = async (value) => {
        await apiPost(`${process.env.REACT_APP_BE_APP_API_BASE_URL}/api/product/saveOrUpdateProduct`, { name: value }); // Pass the productName

        setRefreshKey((prevKey) => prevKey + 1); // Increment refreshKey

    };


    const openAlert = (action, productId) => {
        setAction(action);
        if ('CATEGORY' === action) {
            setSelectedProductId(productId);
        }
        setIsAlertOpen(true);
    };
    const closeAlert = () => {
        console.log("User Input:", inputValue); // Handle input value
        setIsAlertOpen(false);
        setAction(null);
        setInputValue(""); // Reset after closing
    };

    const submitAlert = () => {
        console.log("User Input:", inputValue);
        if (inputValue.length < 3 || inputValue.length > 50) {
            alert('Name should between  3 and 10 characters.');
            return;

        }

        if ('PRODUCT' === action) {
            addNewProduct(inputValue);
        }

        if ('CATEGORY' === action) {
            addNewCategory(inputValue);
        }

        if ('SERVICE_TYPE' === action) {
            addNewServiceType(inputValue);
        }

        if ('BRAND' === action) {
            addNewBrand(inputValue);
        }

        setIsAlertOpen(false);
        setInputValue("");
        setAction("");// Reset after closing
    };

    const changeStatus = async (productId, status, action) => {
        await apiPost(`${process.env.REACT_APP_BE_APP_API_BASE_URL}/api/product/saveOrUpdateProduct`, { id: productId, [action]: !status }); // Pass the productName

        setRefreshKey((prevKey) => prevKey + 1); // Increment refreshKey

    }
    const changeCategoryStatus = async (categoryId, status, action) => {
        await apiPost(`${process.env.REACT_APP_BE_APP_API_BASE_URL}/api/product/saveOrUpdateCategory`, { id: categoryId, [action]: !status }); // Pass the productName

        setRefreshKey((prevKey) => prevKey + 1); // Increment refreshKey

    }

    const handleFileChange = async (event, subcategoryId) => {
        const file = event.target.files[0];
        if (file) {
            //setUploadedImage(URL.createObjectURL(file));

            const validFormats = ["image/png", "image/jpeg", "image/jpg"];
            if (!validFormats.includes(file.type)) {
                alert("Invalid file type. Only PNG and JPEG are allowed.");
                return;
            }

            const imagePath = await uploadImage(file);
            console.log(imagePath)
            if (imagePath) {
                // Update only the specific subcategory's image
                setUploadedImages((prev) => ({
                    ...prev,
                    [subcategoryId]: imagePath,
                }));
            }
        }
    };


    const handleNewSubcategoryClick = async () => {
        console.log(newSubCategory);
        if (newSubCategory.length < 3 || newSubCategory.length > 50) {
            alert('Subcategory name should between  3 and 10 characters.');
            return;

        }
        await apiPost(`${process.env.REACT_APP_BE_APP_API_BASE_URL}/api/product/saveOrUpdateSubCategory`, { categoryId: selectedCategory.id, name: newSubCategory }); // Pass the productName
        setNewSubCategory('');
        setRefreshKey((prevKey) => prevKey + 1); // Increment refreshKey
    }

    const addNewServiceType = async (value) => {
        await apiPost(`${process.env.REACT_APP_BE_APP_API_BASE_URL}/api/product/saveOrUpdateServicType`, { serviceType: value, isActive: true, subCategoryId: subCategoryId }); // Pass the productName

        setRefreshKey((prevKey) => prevKey + 1); // Increment refreshKey

    };

    const addNewBrand = async (value) => {
        await apiPost(`${process.env.REACT_APP_BE_APP_API_BASE_URL}/api/product/saveOrUpdateBrand`, { brandName: value, isActive: true, subCategoryId: subCategoryId }); // Pass the productName

        setRefreshKey((prevKey) => prevKey + 1); // Increment refreshKey

    };


    const toggleSubCategory = async (subcategoryId, isActive) => {
        //vaidate all available then only make active 
        const subCategory = selectedCategory.subcategories.find((subcat) => subcat.id === subcategoryId)
        console.log(subCategory)
        if (!isActive && (subCategory.serviceTypes.length < 1 || subCategory.imageUrl == null)) {
            return alert("Add Some Service type & display image , before activating.")
        }

        await apiPost(`${process.env.REACT_APP_BE_APP_API_BASE_URL}/api/product/saveOrUpdateSubCategory`, { id: subcategoryId, isActive: !isActive }); // Pass the productName

        setRefreshKey((prevKey) => prevKey + 1); // Increment refreshKey
    }

    const updateImage = async (subcategoryId) => {
        console.log(uploadedImages[subcategoryId])
        await apiPost(`${process.env.REACT_APP_BE_APP_API_BASE_URL}/api/product/saveOrUpdateSubCategory`, { id: subcategoryId, imageUrl: uploadedImages[subcategoryId] }); // Pass the productName

        setRefreshKey((prevKey) => prevKey + 1); // Increment refreshKey
    }

    const Button = ({ onClick, children, className }) => (
        <button onClick={onClick} className={`px-4 py-2 rounded-full ${className}`}>
            {children}
        </button>
    );

    return (

        <diV>
            { loading && (
                <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50">
                    <div className="w-16 h-16 border-4 border-[rgb(255,198,48)] border-t-transparent rounded-full animate-spin"></div>
                </div>
            )}


            {/* Alert Modal */}
            {
                isAlertOpen && (
                    <div className="fixed inset-0 flex items-center justify-center bg-[rgb(255,198,48)] bg-opacity-50">
                        <div className="bg-white p-6 rounded shadow-lg w-96">
                            <h3 className="text-lg font-semibold mb-2">Enter your {action}</h3>
                            <input
                                type="text"
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                className="border p-2 w-full mb-4"
                                placeholder="Type here..."
                            />
                            <div className="flex justify-end space-x-2">
                                <Button onClick={closeAlert} className="px-4 py-2 bg-gray-500 text-white rounded">
                                    Close
              </Button>
                                <Button onClick={submitAlert} className="px-4 py-2 bg-blue-500 text-white rounded">
                                    OK
              </Button>
                            </div>
                        </div>
                    </div>
                )
            }

            <div className="p-6 bg-white">
                <h2 className="text-2xl font-semibold mb-4">Admin Panel</h2>

                <table className="min-w-full border border-gray-300">
                    <thead>
                        <tr className="bg-gray-100">
                            <th className="p-2 border">Sl No</th>
                            <th className="p-2 border">Product</th>
                            <th className="p-2 border">Home Page Enabled</th>
                            <th className="p-2 border">Category</th>
                            <th className="p-2 border">Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.map((product, index) => (
                            <tr key={product.id} className="border">
                                <td className="p-2 border">{index + 1}</td>
                                <td className="p-2 border">{product.name}</td>
                                <td className="p-2 border">
                                    {product.homePageEnabled ? (
                                        <span onClick={() => changeStatus(product.id, product.homePageEnabled, 'homePageEnabled')} className="text-green-500 bg-gray-200 px-2 py-1 rounded-full mr-1 hover:bg-[rgb(255,198,48)] cursor-pointer">Active</span>
                                    ) : (
                                        <span onClick={() => changeStatus(product.id, product.homePageEnabled, 'homePageEnabled')} className="text-red-500 bg-gray-200 px-2 py-1 rounded-full mr-1 hover:bg-[rgb(255,198,48)] cursor-pointer">Inactive </span>
                                    )}

                                </td>
                                <td className="p-2 border">
                                    {product.categories.map((sub) => (
                                        <span onClick={() => viewCategory(product.id, sub.id)} key={sub.id} className="inline-block bg-gray-200 px-3 py-1 rounded-full text-sm font-medium text-gray-700 m-1 hover:bg-[rgb(255,198,48)] cursor-pointer">
                                            {sub.name}
                                        </span>
                                    ))}
                                    {product.isActive ? (
                                        <span className="bg-gray-200 px-2 py-1 rounded-full mr-1 text-green-500 hover:bg-[rgb(255,198,48)] cursor-pointer">
                                            <Button onClick={() => openAlert('CATEGORY', product.id)}>Add </Button>
                                        </span>
                                    ) : ''}
                                </td>
                                <td className="p-2 border">
                                    {product.isActive ? (
                                        <span onClick={() => changeStatus(product.id, product.isActive, 'isActive')} className="text-green-500 bg-gray-200 px-2 py-1 rounded-full mr-1 hover:bg-[rgb(255,198,48)] cursor-pointer">Active</span>
                                    ) : (
                                        <span onClick={() => changeStatus(product.id, product.isActive, 'isActive')} className="text-red-500 bg-gray-200 px-2 py-1 rounded-full mr-1 hover:bg-[rgb(255,198,48)] cursor-pointer">Inactive </span>
                                    )}
                                </td>
                            </tr>
                        ))}
                        <tr>
                            <td className="p-2 border">{products.length + 1}</td>
                            <td className="p-2 border">
                                <span className="bg-gray-200 px-2 py-1 rounded-full mr-1 text-green-500 hover:bg-[rgb(255,198,48)] cursor-pointer">
                                    <Button onClick={() => openAlert('PRODUCT')}>Add </Button>
                                </span>
                            </td>
                            <td></td>
                            <td></td>
                            <td></td>
                        </tr>
                    </tbody>
                </table>

            </div>

            {/* Dropdown for selecting categories Type */}
            {
                selectedCategory && (
                    <div className="p-6">
                        <div className="flex">
                            <span> <h2 className="text-2xl font-semibold mb-4">Category : {selectedCategory.name}  </h2>  </span>
                            <span className='text-align right-0'> {selectedCategory.isActive ? (
                                <span onClick={() => changeCategoryStatus(selectedCategory.id, selectedCategory.isActive, 'isActive')} className="text-green-500 bg-gray-200 px-2 py-1 rounded-full mr-1  hover:bg-[rgb(255,198,48)] cursor-pointer">Active</span>
                            ) : (
                                <span onClick={() => changeCategoryStatus(selectedCategory.id, selectedCategory.isActive, 'isActive')} className="text-red-500 bg-gray-200 px-2 py-1 rounded-full mr-1  hover:bg-[rgb(255,198,48)] cursor-pointer">Inactive </span>
                            )}
                            </span>
                        </div>
                        <table className="min-w-full border border-gray-300">
                            <thead>
                                <tr className="bg-gray-100">
                                    <th className="p-2 border">Sl No</th>
                                    <th className="p-2 border">Subcategory Name </th>
                                    <th className="p-2 border">Service Type </th>
                                    <th className="p-2 border">Service Sub Type </th>
                                    <th className="p-2 border">Display Image</th>
                                    <th className="p-2 border">Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {selectedCategory.subcategories.map((subcategory, index) => (
                                    <tr className="border">
                                        <td className="p-2 border">
                                            <div
                                                key={subcategory.id}
                                            >{index + 1}</div>
                                        </td>
                                        <td className="p-2 border">{subcategory.name}</td>
                                        <td className="p-2 border ">

                                            {subcategory.serviceTypes.map((st) => (
                                                <span key={st.serviceType} className="inline-block bg-gray-200 px-3 py-1 rounded-full text-sm font-medium text-gray-700 m-1 hover:bg-[rgb(255,198,48)] cursor-pointer">
                                                    <Button onClick={() => { openServiceModal(st.id) }} >{st.serviceType}</Button>
                                                </span>
                                            ))}

                                            <span className="bg-gray-200 px-2 py-1 rounded-full mr-1 text-green-500 hover:bg-[rgb(255,198,48)]">
                                                <Button onClick={() => { openAlert('SERVICE_TYPE'); setSubCategoryId(subcategory.id); }} >Add </Button>
                                            </span>

                                          

                                        </td>
                                        <td className="p-2 border ">

                                            {subcategory.brands.map((brand) => (
                                                <span key={brand.brandName} className="inline-block bg-gray-200 px-3 py-1 rounded-full text-sm font-medium text-gray-700 m-1">
                                                    {brand.brandName}
                                                </span>

                                            ))}

                                            <span className="bg-gray-200 px-2 py-1 rounded-full mr-1 text-green-500 hover:bg-[rgb(255,198,48)] cursor-pointer">
                                                <Button onClick={() => { openAlert('BRAND'); setSubCategoryId(subcategory.id); }}>Add </Button>
                                            </span>



                                        </td>
                                        <td className="p-2 border">
                                            <img
                                                src={uploadedImages[subcategory.id] || subcategory.imageUrl}
                                                alt={subcategory.name}
                                                className="w-20 h-20 object-cover rounded-lg mb-2"
                                            />

                                            <label className="w-full flex items-center justify-center p-2  text-green-500 rounded-lg cursor-pointer hover:bg-[rgb(255,198,48)] transition-all shadow-md">
                                                <FiUpload className="mr-2 text-lg" />
                                         Change Dispaly Image
                                        <input
                                                    type="file"
                                                    className="hidden"
                                                    multiple={false}
                                                    onChange={(event) => handleFileChange(event, subcategory.id)}
                                                />
                                            </label>

                                        </td>
                                        <td className="p-2 border">{subcategory.isActive ? (
                                            <span className="bg-gray-200 px-2 py-1 rounded-full mr-1 text-green-500 hover:bg-[rgb(255,198,48)] cursor-pointer">
                                                <Button onClick={() => toggleSubCategory(subcategory.id, subcategory.isActive)}>Active</Button></span>
                                        ) : (
                                            <span className="bg-gray-200 px-2 py-1 rounded-full mr-1 text-red-500 hover:bg-[rgb(255,198,48)] cursor-pointer">
                                                <Button onClick={() => toggleSubCategory(subcategory.id, subcategory.isActive)}>Inactive</Button> </span>
                                        )}
                                            {uploadedImages[subcategory.id] && (<span className="bg-gray-200 px-2 py-1 rounded-full mr-1 text-green-500 hover:bg-[rgb(255,198,48)] cursor-pointer">
                                                <Button onClick={() => updateImage(subcategory.id)}>Update Image</Button></span>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                                <tr>
                                    <td className="p-2 border">{selectedCategory.subcategories.length + 1}</td>
                                    <td className="p-2 border"><input
                                        type="text"
                                        value={newSubCategory}
                                        onChange={(e) => setNewSubCategory(e.target.value)}
                                        className="border p-2 w-full mb-4"
                                        placeholder="Type Sub category name."
                                    /></td>
                                    <td className="p-2 border"></td>
                                    <td className="p-2 border"></td>
                                    <td className="p-2 border">

                                    </td>
                                    <td className="p-2 border"> <span className="bg-gray-200 px-2 py-1 rounded-full mr-1 text-green-500 hover:bg-[rgb(255,198,48)] cursor-pointer">
                                        <Button onClick={() => handleNewSubcategoryClick()}>Add </Button>
                                    </span></td>
                                </tr>
                            </tbody>
                        </table>
                    </div>




                )
            }
            {isServiceDtlModalOpen && (
                <AdminServiceDetail serviceDetail = {serviceDetail} closeModal = {closeModal} serviceId = {serviceId} />

            )}

        </diV>



    );
};

export default AdminProduct;