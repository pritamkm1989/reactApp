import React from "react";
import Layout from './layout';
import Appliance from "../components/ApplianceRepairService";
import { useState, useEffect } from "react";
import axios from "axios";


const AdminPage = () => {
    const [products, setProducts] = useState([]);
    const [isAlertOpen, setIsAlertOpen] = useState(false);
    const [inputValue, setInputValue] = useState("");
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [selectedSubcategory, setSelectedSubcategory] = useState(null);
    const [refreshKey, setRefreshKey] = useState(0);

    useEffect(() => {
        axios.get("/api/product/all") // 🔹 Replace with your actual API endpoint
            .then(response => {
                // Ensure response.data is in the expected format
                console.log('fetch')
                setProducts(response.data);
                console.log(response.data)
            })
            .catch(error => console.error("Error fetching product:", error));
    }, [refreshKey]);


    const addNewCategory = (productId) => {
        return alert(productId);
    };
    const viewCategory = (productId, categoryId) => {
        console.log(productId, categoryId);
        const product = products.find((pro) => pro.id === productId).categories;
        const category = product.find((cat) => cat.id === categoryId)
        setSelectedCategory(category)
    };

    const addNewProduct = async (value) => {
        console.log(value);
        try {
            const response = await fetch("/api/product/saveOrProduct", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ name : value }), // Pass the productName
            });
            setRefreshKey((prevKey) => prevKey + 1); // Increment refreshKey
        } catch (error) {
            console.error(error);
        }
    };

    const handleSubcategoryClick = (subcategoryId) => {
        console.log(subcategoryId)
    };

    const openAlert = () => setIsAlertOpen(true);
    const closeAlert = () => {
        console.log("User Input:", inputValue); // Handle input value
        setIsAlertOpen(false);
        setInputValue(""); // Reset after closing
    };

    const submitAlert = (act) => {
        console.log("User Input:", inputValue);
    
        addNewProduct(inputValue);
       
        setIsAlertOpen(false);
        setInputValue(""); // Reset after closing
    };

    const changeStatus = async (productId,status,action) =>{
        try {
            const response = await fetch("/api/product/saveOrProduct", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ id : productId, [action] : !status  }), // Pass the productName
            });
            setRefreshKey((prevKey) => prevKey + 1); // Increment refreshKey
        } catch (error) {
            console.error(error);
        }
    }


    return (
        <Layout>
            {/* Dropdown for selecting prodcut Type */}

            {/* Alert Modal */}
            {isAlertOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white p-6 rounded shadow-lg w-96">
                        <h3 className="text-lg font-semibold mb-2">Enter your text</h3>
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
                            <th className="p-2 border">ID</th>
                            <th className="p-2 border">Product</th>
                            <th className="p-2 border">Home Page Enabled</th>
                            <th className="p-2 border">Category</th>
                            <th className="p-2 border">Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.map((product) => (
                            <tr key={product.id} className="border">
                                <td className="p-2 border">{product.id}</td>
                                <td className="p-2 border">{product.name}</td>
                                <td className="p-2 border">
                                    {product.homePageEnabled ? (
                                        <span  onClick={() => changeStatus(product.id,product.homePageEnabled, 'homePageEnabled')} className="text-green-500 bg-gray-200 px-2 py-1 rounded mr-1">Active</span>
                                    ) : (
                                        <span onClick={() => changeStatus(product.id,product.homePageEnabled , 'homePageEnabled')} className="text-red-500 bg-gray-200 px-2 py-1 rounded mr-1">Inactive </span>
                                    )}

                                </td>
                                <td className="p-2 border">
                                    {product.categories.map((sub) => (
                                        <span onClick={() => viewCategory(product.id, sub.id)} key={sub.id} className="bg-gray-200 px-2 py-1 rounded mr-1">
                                            {sub.name}
                                        </span>
                                    ))}
                                    {product.isActive ? (
                                        <span className="bg-gray-200 px-2 py-1 rounded mr-1 text-green-500">
                                            <button onClick={() => addNewCategory(product.id)}>Add </button>
                                        </span>
                                    ) : ''}
                                </td>
                                <td className="p-2 border">
                                    {product.isActive ? (
                                        <span onClick={() => changeStatus(product.id,product.isActive, 'isActive')} className="text-green-500 bg-gray-200 px-2 py-1 rounded mr-1">Active</span>
                                    ) : (
                                        <span onClick={() => changeStatus(product.id,product.isActive, 'isActive')} className="text-red-500 bg-gray-200 px-2 py-1 rounded mr-1">Inactive </span>
                                    )}
                                </td>
                            </tr>
                        ))}
                        <tr>
                            <td className="p-2 border">{products.length + 1}</td>
                            <td className="p-2 border">
                                <span className="bg-gray-200 px-2 py-1 rounded mr-1 text-green-500">
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
                    <h2 className="text-2xl font-semibold mb-4">{selectedCategory.name}</h2>
                    <table className="min-w-full border border-gray-300">
                        <thead>
                            <tr className="bg-gray-100">
                                <th className="p-2 border">ID</th>
                                <th className="p-2 border">Subcategory Name </th>
                                <th className="p-2 border">Service Type </th>
                                <th className="p-2 border">Service Sub Type </th>
                                <th className="p-2 border">Display Image</th>
                                <th className="p-2 border">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {selectedCategory.subcategories.map((subcategory) => (
                                <tr className="border">
                                    <td className="p-2 border">
                                        <div
                                            key={subcategory.id}
                                            onClick={() => handleSubcategoryClick(subcategory.id)}
                                        >{subcategory.id}</div>
                                    </td>
                                    <td className="p-2 border">{subcategory.name}</td>
                                    <td className="p-2 border">
                                        {subcategory.serviceTypes.map((st) => (
                                            <span className="bg-gray-200 px-2 py-1 rounded mr-1">
                                                {st.serviceType}
                                            </span>
                                        ))}
                                        {subcategory.isActive ? (
                                            <span className="bg-gray-200 px-2 py-1 rounded mr-1 text-green-500">
                                                <button >Add </button>
                                            </span>
                                        ) : ''}
                                    </td>
                                    <td className="p-2 border">
                                        {subcategory.brands.map((brand) => (
                                            <span className="bg-gray-200 px-2 py-1 rounded mr-1">
                                                {brand.brandName}
                                            </span>
                                        ))}
                                        {subcategory.isActive ? (
                                            <span className="bg-gray-200 px-2 py-1 rounded mr-1 text-green-500">
                                                <button >Add </button>
                                            </span>
                                        ) : ''}
                                    </td>
                                    <td className="p-2 border">
                                        <img
                                            src={subcategory.imageUrl}
                                            alt={subcategory.name}
                                            className="w-20 h-20 object-cover rounded-lg mb-2"
                                        />

                                    </td>
                                    <td className="p-2 border">{subcategory.isActive ? (
                                        <span className="text-green-500">Active</span>
                                    ) : (
                                        <span className="text-red-500">Inactive </span>
                                    )}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}



        </Layout>
    );
};

export default AdminPage;