
import React from 'react';
import { useState } from "react";
import Layout from './layout';
import AdminProduct from '../components/AdminProduct'
import CartComp from '../components/CartComp'



const AdminPage = () => {

    const [activeTab, setActiveTab] = useState("admin"); // Default to AdminProduct const [activeTab, setActiveTab] = useState("admin"); // Default to AdminProduct

    return (
        <Layout>

            <div className="w-full mx-auto mt-5">
                {/* Scrollable Tab Buttons */}
                <div className="flex w-full overflow-x-auto scrollbar-hide border-b whitespace-nowrap">
                    <button
                        className={`py-2 px-4 flex-1 text-center ${activeTab === "admin"
                                ? "border-b-2 border-blue-500 font-semibold text-blue-500"
                                : "text-gray-500"
                            }`}
                        onClick={() => setActiveTab("admin")}
                    >
                        Admin Product
    </button>
                    <button
                        className={`py-2 px-4 flex-1 text-center ${activeTab === "cart"
                                ? "border-b-2 border-blue-500 font-semibold text-blue-500"
                                : "text-gray-500"
                            }`}
                        onClick={() => setActiveTab("cart")}
                    >
                        Cart
    </button>
                </div>

                {/* Tab Content */}
                <div className="p-4 border rounded-b-md shadow-md overflow-auto max-w-full break-words">
                    {activeTab === "admin" && <AdminProduct />}
                    {activeTab === "cart" && <CartComp isAdmin={true} />}
                </div>
            </div>


        </Layout>
    );
};

export default AdminPage;