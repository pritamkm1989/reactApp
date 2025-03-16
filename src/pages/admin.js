import React from "react";
import Layout from './layout';
import { FiUpload } from "react-icons/fi";
import { useState, useEffect } from "react";
import axios from "axios";
import { uploadImage } from '../services/ImageUpload'


const AdminPage = () => {
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

    useEffect(() => {
        setLoading(true); // Start loading before API call
        axios.get("/api/product/all") // 🔹 Replace with your actual API endpoint
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


    const addNewCategory = async (categoryName) => {
        setLoading(true);
        try {
            const response = await fetch("/api/product/saveOrUpdateCategory", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ name: categoryName, productId: selectedProductId }), // Pass the productName
            });
            setRefreshKey((prevKey) => prevKey + 1); // Increment refreshKey
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };
    const viewCategory = (productId, categoryId) => {
        console.log(productId, categoryId);
        const product = products.find((pro) => pro.id === productId).categories;
        const category = product.find((cat) => cat.id === categoryId)
        setSelectedCategory(category);
        setSelectedProductId(productId);
    };

    const addNewProduct = async (value) => {
        console.log(value);
        setLoading(true);
        try {
            const response = await fetch("/api/product/saveOrUpdateProduct", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ name: value }), // Pass the productName
            });
            setRefreshKey((prevKey) => prevKey + 1); // Increment refreshKey
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
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
        if (inputValue.length < 3) {
            alert('shold be 3 or more chatacter.');
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
        setLoading(true);
        try {
            const response = await fetch("/api/product/saveOrUpdateProduct", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ id: productId, [action]: !status }), // Pass the productName
            });
            setRefreshKey((prevKey) => prevKey + 1); // Increment refreshKey
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }
    const changeCategoryStatus = async (categoryId, status, action) => {
        setLoading(true);
        try {
            const response = await fetch("/api/product/saveOrUpdateCategory", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ id: categoryId, [action]: !status }), // Pass the productName
            });
            setRefreshKey((prevKey) => prevKey + 1); // Increment refreshKey
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }

    const handleFileChange = async  (event) => {
        const file = event.target.files[0];
        if (file) {
            //setUploadedImage(URL.createObjectURL(file));
            const imagePath = await uploadImage(file);
            console.log(imagePath)
        }
    };


    const handleNewSubcategoryClick = async () => {
        console.log(newSubCategory);
        if (newSubCategory.length < 3) {
            alert('Subcategory shold be 3 or more chatacter.');
            return;

        }
        setLoading(true);
        try {
            const response = await fetch("/api/product/saveOrUpdateSubCategory", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ categoryId: selectedCategory.id, name: newSubCategory }), // Pass the productName
            });
            setRefreshKey((prevKey) => prevKey + 1); // Increment refreshKey
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }

    const addNewServiceType = async (value) => {
        console.log(value);
        setLoading(true);
        try {
            const response = await fetch("/api/product/saveOrUpdateServicType", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ serviceType: value, isActive: true, subCategoryId: subCategoryId }), // Pass the productName
            });
            setRefreshKey((prevKey) => prevKey + 1); // Increment refreshKey
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const addNewBrand = async (value) => {
        console.log(value);
        setLoading(true);
        try {
            const response = await fetch("/api/product/saveOrUpdateBrand", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ brandName: value, isActive: true, subCategoryId: subCategoryId }), // Pass the productName
            });
            setRefreshKey((prevKey) => prevKey + 1); // Increment refreshKey
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };


    const toggleSubCategory = async () => {
        //vaidate all available then only make active 
    }

    return (
        <Layout>

            {loading && (
                <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50">
                    <div className="w-16 h-16 border-4 border-[rgb(255,198,48)] border-t-transparent rounded-full animate-spin"></div>
                </div>
            )}

            {/* Alert Modal */}
            {isAlertOpen && (
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
                            <button onClick={closeAlert} className="px-4 py-2 bg-gray-500 text-white rounded">
                                Close
              </button>
                            <button onClick={submitAlert} className="px-4 py-2 bg-blue-500 text-white rounded">
                                OK
              </button>
                        </div>
                    </div>
                </div>
            )}

            <div className="p-6">
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
                                        <span onClick={() => changeStatus(product.id, product.homePageEnabled, 'homePageEnabled')} className="text-green-500 bg-gray-200 px-2 py-1 rounded mr-1 hover:bg-[rgb(255,198,48)] cursor-pointer">Active</span>
                                    ) : (
                                        <span onClick={() => changeStatus(product.id, product.homePageEnabled, 'homePageEnabled')} className="text-red-500 bg-gray-200 px-2 py-1 rounded mr-1 hover:bg-[rgb(255,198,48)] cursor-pointer">Inactive </span>
                                    )}

                                </td>
                                <td className="p-2 border">
                                    {product.categories.map((sub) => (
                                        <span onClick={() => viewCategory(product.id, sub.id)} key={sub.id} className="bg-gray-200 px-2 py-1 rounded mr-1 hover:bg-[rgb(255,198,48)] cursor-pointer">
                                            {sub.name}
                                        </span>
                                    ))}
                                    {product.isActive ? (
                                        <span className="bg-gray-200 px-2 py-1 rounded mr-1 text-green-500 hover:bg-[rgb(255,198,48)] cursor-pointer">
                                            <button onClick={() => openAlert('CATEGORY', product.id)}>Add </button>
                                        </span>
                                    ) : ''}
                                </td>
                                <td className="p-2 border">
                                    {product.isActive ? (
                                        <span onClick={() => changeStatus(product.id, product.isActive, 'isActive')} className="text-green-500 bg-gray-200 px-2 py-1 rounded mr-1 hover:bg-[rgb(255,198,48)] cursor-pointer">Active</span>
                                    ) : (
                                        <span onClick={() => changeStatus(product.id, product.isActive, 'isActive')} className="text-red-500 bg-gray-200 px-2 py-1 rounded mr-1 hover:bg-[rgb(255,198,48)] cursor-pointer">Inactive </span>
                                    )}
                                </td>
                            </tr>
                        ))}
                        <tr>
                            <td className="p-2 border">{products.length + 1}</td>
                            <td className="p-2 border">
                                <span className="bg-gray-200 px-2 py-1 rounded mr-1 text-green-500 hover:bg-[rgb(255,198,48)] cursor-pointer">
                                    <button onClick={() => openAlert('PRODUCT')}>Add </button>
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
            {selectedCategory && (
                <div className="p-6">
                    <div className="flex">
                        <span> <h2 className="text-2xl font-semibold mb-4">Category : {selectedCategory.name}  </h2>  </span>
                        <span className='text-align right-0'> {selectedCategory.isActive ? (
                            <span onClick={() => changeCategoryStatus(selectedCategory.id, selectedCategory.isActive, 'isActive')} className="text-green-500 bg-gray-200 px-2 py-1 rounded mr-1  hover:bg-[rgb(255,198,48)] cursor-pointer">Active</span>
                        ) : (
                            <span onClick={() => changeCategoryStatus(selectedCategory.id, selectedCategory.isActive, 'isActive')} className="text-red-500 bg-gray-200 px-2 py-1 rounded mr-1  hover:bg-[rgb(255,198,48)] cursor-pointer">Inactive </span>
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
                                    <td className="p-2 border">
                                        {subcategory.serviceTypes.map((st) => (
                                            <span className="bg-gray-200 px-2 py-1 rounded mr-1">
                                                {st.serviceType}
                                            </span>
                                        ))}

                                        <span className="bg-gray-200 px-2 py-1 rounded mr-1 text-green-500 hover:bg-[rgb(255,198,48)]">
                                            <button onClick={() => { openAlert('SERVICE_TYPE'); setSubCategoryId(subcategory.id); }} >Add </button>
                                        </span>

                                    </td>
                                    <td className="p-2 border">
                                        {subcategory.brands.map((brand) => (
                                            <span className="bg-gray-200 px-2 py-1 rounded mr-1">
                                                {brand.brandName}
                                            </span>
                                        ))}

                                        <span className="bg-gray-200 px-2 py-1 rounded mr-1 text-green-500 hover:bg-[rgb(255,198,48)] cursor-pointer">
                                            <button onClick={() => openAlert('BRAND')}>Add </button>
                                        </span>

                                    </td>
                                    <td className="p-2 border">
                                        <img
                                            src={subcategory.imageUrl}
                                            alt={subcategory.name}
                                            className="w-20 h-20 object-cover rounded-lg mb-2"
                                        />

                                        <label className="w-full flex items-center justify-center p-2  text-green-500 rounded-lg cursor-pointer hover:bg-[rgb(255,198,48)] transition-all shadow-md">
                                            <FiUpload className="mr-2 text-lg" />
                                         Change Dispaly Image
                                        <input
                                                type="file"
                                                className="hidden"
                                                multiple
                                                onChange={handleFileChange}
                                            />
                                        </label>

                                    </td>
                                    <td className="p-2 border">{subcategory.isActive ? (
                                        <span className="bg-gray-200 px-2 py-1 rounded mr-1 text-green-500 hover:bg-[rgb(255,198,48)] cursor-pointer">
                                            <button onClick={() => toggleSubCategory()}>Active</button></span>
                                    ) : (
                                        <span className="bg-gray-200 px-2 py-1 rounded mr-1 text-red-500 hover:bg-[rgb(255,198,48)] cursor-pointer">
                                            <button onClick={() => toggleSubCategory()}>Inactive</button> </span>
                                    )}</td>
                                </tr>
                            ))}
                            <tr>
                                <td className="p-2 border">{selectedCategory.subcategories.length + 1}</td>
                                <td className="p-2 border"><input
                                    type="text"
                                    onChange={(e) => setNewSubCategory(e.target.value)}
                                    className="border p-2 w-full mb-4"
                                    placeholder="Type Sub category name."
                                /></td>
                                <td className="p-2 border"></td>
                                <td className="p-2 border"></td>
                                <td className="p-2 border">
                                    <label className="w-full flex items-center justify-center p-2  text-green-500 rounded-lg cursor-pointer hover:bg-[rgb(255,198,48)] transition-all shadow-md">
                                        <FiUpload className="mr-2 text-lg" />
                                         Dispaly Image
                                        <input
                                            type="file"
                                            className="hidden"
                                            multiple
                                            onChange={handleFileChange}
                                        />
                                    </label>
                                </td>
                                <td className="p-2 border"> <span className="bg-gray-200 px-2 py-1 rounded mr-1 text-green-500 hover:bg-[rgb(255,198,48)] cursor-pointer">
                                    <button onClick={() => handleNewSubcategoryClick()}>Add </button>
                                </span></td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            )}



        </Layout>
    );
};

export default AdminPage;