import React, { useContext } from 'react';
import { CartContext } from '../CartContext';



const CartComp = (isAdmin) => {
    const { cart, removeItem } = useContext(CartContext);
    const cartArray = Array.isArray(cart) ? cart : [cart];
    console.log("isAdmin value:", isAdmin);

    const handleRemove = (index) => {
        alert("Removed from your cart !!!");
        removeItem(index)
    };



    return (

        <div className="container mx-auto p-4">

            <h1 className="font-bold mb-4 text-[rgb(255,198,48)]">Your Cart</h1>


            <div className="p-4">
                {/* Desktop Table */}
                <div className="hidden md:block overflow-x-auto">
                    <table className="table-fixed w-full bg-white min-w-full border border-gray-200 rounded-lg shadow-md">
                        <thead>
                            <tr className="bg-gray-200 text-gray-700 font-bold text-center">
                                <th className="py-2 px-4 border">Sl No</th>
                                <th className="py-2 px-4 border">Category</th>
                                <th className="py-2 px-4 border">Subcategory</th>
                                <th className="py-2 px-4 border">Type</th>
                                <th className="py-2 px-4 border">Sub Type</th>
                                <th className="py-2 px-4 border w-2/12">Issue Description</th>
                                <th className="py-2 px-4 border w-1/12">Uploaded Image</th>
                                {isAdmin.isAdmin && (
                                    <>
                                        <th className="py-2 px-4 border w-2/12">Address</th>
                                        <th className="py-2 px-4 border">Email</th>
                                        <th className="py-2 px-4 border">Mobile</th>
                                        <th className="py-2 px-4 border">Created At</th>
                                    </>)}

                                {!isAdmin.isAdmin && (
                                    <>
                                        <th className="py-2 px-4 border">Action</th>
                                    </>)}
                            </tr>
                        </thead>
                        <tbody>
                            {cartArray.map((item, index) => (
                                <tr key={index} className="text-center">
                                    <td className="py-2 px-4 border">{index + 1}</td>
                                    <td className="py-2 px-4 border">{item.category}</td>
                                    <td className="py-2 px-4 border">{item.subcategory.name}</td>
                                    <td className="py-2 px-4 border">{item.type}</td>
                                    <td className="py-2 px-4 border">{item.brand}</td>
                                    <td className="py-2 px-4 border break-words">{item.issueDescription}</td>
                                    
                                    <td className="py-2 px-4 border">
                                        {item.uploadedImage && (  <img src={item.uploadedImage} alt="Uploaded" className="w-16 h-16 object-cover" />)}
                                    </td>
                                    {isAdmin.isAdmin && (
                                        <>
                                            <td className="py-2 px-4 border whitespace-normal break-words">
                                                <b>Street:</b> {item.address.street} <br />
                                                {item.address.landmark && <li><b>Landmark:</b> {item.address.landmark}</li>}
                                                <b>City:</b> {item.address.city} <br />
                                                <b>Pin:</b> {item.address.state}
                                            </td>
                                            <td className="py-2 px-4 border break-words">{item.address.email}</td>
                                            <td className="py-2 px-4 border break-words">{item.address.mobile}</td>
                                            <td className="py-2 px-4 border">{item.createdAt.toLocaleString()}</td>
                                           
                                        </>)}

                                    {!isAdmin.isAdmin && (
                                        <td className="py-2 px-4 border">

                                            <button onClick={() => handleRemove(index)} className="text-red-500 hover:text-red-700">
                                                ✖
                                    </button>
                                        </td>)}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Mobile View (Card Layout) */}
                <div className="md:hidden space-y-4">
                    {cartArray.map((item, index) => (
                        <div key={index} className="border p-4 rounded-lg shadow bg-white relative">
                            {/* Close Button */}
                            {!isAdmin.isAdmin && (


                                <span
                                    onClick={() => handleRemove(index)}
                                    className="absolute top-2 right-2 text-red-500 font-bold text-lg cursor-pointer hover:text-red-700 z-10"
                                >
                                    x
                                </span>
                            )}
                            <p><b>Category:</b> {item.category}</p>
                            <p><b>Subcategory:</b> {item.subcategory.name}</p>
                            <p><b>Type:</b> {item.type}</p>
                            <p><b>Sub Type:</b> {item.brand}</p>
                            <p><b>Issue Description:</b> {item.issueDescription}</p>
                            {isAdmin.isAdmin && (
                                <>
                                    <p><b>Email:</b> {item.address.email}</p>
                                    <p><b>Mobile:</b> {item.address.mobile}</p>
                                    <p><b>Created At:</b> {item.createdAt.toLocaleString()}</p>
                                    <p><b>Address : </b>

                                        <b>Street:</b> {item.address.street}
                                        {item.address.landmark && <><b>Landmark:</b> {item.address.landmark} <br /></>}
                                        <b> Pin:</b> {item.address.state}</p>

                                    <div className="flex items-center space-x-4 mt-2">
                                        <img src={item.uploadedImage} alt="Uploaded" className="w-16 h-16 object-cover rounded" />
                                    </div>
                                </>)}
                        </div>
                    ))}
                </div>
            </div>


        </div>

    );
};

export default CartComp;
