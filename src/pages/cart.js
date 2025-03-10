import React, { useContext } from 'react';
import { CartContext } from '../CartContext';
import Layout from './layout';

const Cart = () => {
    const { cart,removeItem } = useContext(CartContext);
    const cartArray = Array.isArray(cart) ? cart : [cart];
    
    const handleSelect = (index) => {
       alert("Removed from your cart !!!");
       removeItem(index)
      };
    


    return (
        <Layout>
            <div className="container mx-auto p-4">

                <h1 className="font-bold mb-4 text-[rgb(255,198,48)]">Your Cart</h1>


                <div >
                    <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-md scrollbar-hide">
                        <thead>
                            <tr className = "text-[rgb(255,198,48)] text-s font-bold text-cente">
                                <th className="py-2 px-4 border-b border-gray-200 ">Sl No</th>
                                <th className="py-2 px-4 border-b border-gray-200">Category</th>
                                <th className="py-2 px-4 border-b border-gray-200">Subcategory</th>
                                <th className="py-2 px-4 border-b border-gray-200">Type</th>
                                <th className="py-2 px-4 border-b border-gray-200">Brand</th>
                                <th className="py-2 px-4 border-b border-gray-200">Issue Description</th>
                                <th className="py-2 px-4 border-b border-gray-200">Uploaded Image</th>
                                <th className="py-2 px-4 border-b border-gray-200">Street</th>
                                <th className="py-2 px-4 border-b border-gray-200">Landmark</th>
                                <th className="py-2 px-4 border-b border-gray-200">City</th>
                                <th className="py-2 px-4 border-b border-gray-200">Pin </th>
                                <th className="py-2 px-4 border-b border-gray-200">Email</th>
                                <th className="py-2 px-4 border-b border-gray-200">Mobile</th>
                                <th className="py-2 px-4 border-b border-gray-200">Action</th>

                            </tr>
                        </thead>
                        <tbody>
                            {cartArray.map((item, index) => (
                                <tr key={index}>
                                    <td className="py-2 px-4 border-b border-gray-200">{index+1}</td>
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
                                    <td className="py-2 px-4 border-b border-gray-200">
                                        <input
                                            type="checkbox"
                                            onChange={() => handleSelect(index)}
                                        />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>



            </div>
        </Layout>
    );
};

export default Cart;
