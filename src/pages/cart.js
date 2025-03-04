import React, { useContext } from 'react';
import { CartContext } from '../CartContext';
import Header from "../components/header";
import Footer from "../components/footer";

const Cart = () => {
    const { cart } = useContext(CartContext);
    const cartArray = Array.isArray(cart) ? cart : [cart];
    console.log('cartArray'+cartArray+'size'+cartArray.length)
    return (
        <div className="container mx-auto p-4">
            <Header />
            <h1 className="text-2xl font-bold mb-4">Your Cart</h1>


            <div className="overflow-x-auto">
                <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-md">
                    <thead>
                        <tr>
                            <th className="py-2 px-4 border-b border-gray-200">Category</th>
                            <th className="py-2 px-4 border-b border-gray-200">Subcategory</th>
                            <th className="py-2 px-4 border-b border-gray-200">Type</th>
                            <th className="py-2 px-4 border-b border-gray-200">Brand</th>
                            <th className="py-2 px-4 border-b border-gray-200">Issue Description</th>
                            <th className="py-2 px-4 border-b border-gray-200">Uploaded Image</th>
                            <th className="py-2 px-4 border-b border-gray-200">Street</th>
                            <th className="py-2 px-4 border-b border-gray-200">Landmark</th>
                            <th className="py-2 px-4 border-b border-gray-200">City</th>
                            <th className="py-2 px-4 border-b border-gray-200">State</th>
                            <th className="py-2 px-4 border-b border-gray-200">Email</th>
                            <th className="py-2 px-4 border-b border-gray-200">Mobile</th>
                        </tr>
                    </thead>
                    <tbody>
                        {cartArray.map((item, index) => (
                            <tr key={index}>
                                <td className="py-2 px-4 border-b border-gray-200">{item.category}</td>
                                <td className="py-2 px-4 border-b border-gray-200">{item.subcategory.name}</td>
                                <td className="py-2 px-4 border-b border-gray-200">{item.type}</td>
                                <td className="py-2 px-4 border-b border-gray-200">{item.brand}</td>
                                <td className="py-2 px-4 border-b border-gray-200">{item.issueDescription}</td>
                                <td className="py-2 px-4 border-b border-gray-200">
                                    <img src={item.uploadedImage} alt="Uploaded" className="w-16 h-16 object-cover" />
                                </td>
                                <td className="py-2 px-4 border-b border-gray-200">{item.address.street}</td>
                                <td className="py-2 px-4 border-b border-gray-200">{item.address.landmark}</td>
                                <td className="py-2 px-4 border-b border-gray-200">{item.address.city}</td>
                                <td className="py-2 px-4 border-b border-gray-200">{item.address.state}</td>
                                <td className="py-2 px-4 border-b border-gray-200">{item.address.email}</td>
                                <td className="py-2 px-4 border-b border-gray-200">{item.address.mobile}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>



            <Footer /> {/* Including the Footer component */}
        </div>

    );
};

export default Cart;
