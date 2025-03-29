import React, { useState } from "react";
import { renderStars } from './utils';



const ServiceDetail = ({ selectedItem, closeModal }) => {
    const [openIndex, setOpenIndex] = useState(null);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };
    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white rounded-lg shadow-lg p-6 w-11/12 md:w-1/2 max-h-[80vh] overflow-y-auto">
                {/* Modal Header */}
                <div className="flex justify-between items-center border-b pb-2">
                    <h2 className="text-2xl font-bold text-gray-800">{selectedItem.name}</h2>
                    <button onClick={closeModal} className="text-gray-500 hover:text-gray-700 text-xl">
                        ✕
              </button>
                </div>

                {/* Modal Content - Image and Details Side by Side */}
                <div className="flex flex-col md:flex-row items-center gap-6 mt-4">
                    {/* Image Section */}
                    <img
                        src={selectedItem.imageUrl}
                        alt={selectedItem.name}
                        className="w-full md:w-1/2 h-48 object-cover rounded-lg"
                    />

                    {/* Details Section */}
                    <div className="flex-1">
                        <p className="text-gray-600 mt-2">Price: {selectedItem.rate} </p>  
                        <div className="mt-4 flex gap-4 mb-4">
                            <button
                                //onClick={addToCart(selectedItem.id)}
                                className="flex-1 bg-[rgb(255,198,48)] text-white py-2 rounded-lg transition-all shadow-md"
                            >
                                Add to Cart
  </button>
                        </div>
                        <p className="text-[rgb(255,198,48)]-500 font-semibold">Review:  {renderStars(selectedItem.rattings || [])} </p>
                        <ul className="list-disc pl-5 text-gray-700 mt-2">
                            {Array.isArray(selectedItem.aboutService) && selectedItem.aboutService.map((service, idx) => (
                                <li key={idx}>{service}</li>
                            ))}
                        </ul>
                    </div>
                </div>
                {/* howItWorks Section */}
                <div className="next-component mt-5 mb-5">
                    {/* Your next component content */}
                    <hr />
                </div>

                {selectedItem.howItWorks && (
                    <div className="space-y-6">
                        <h2 className="text-lg font-semibold text-gray-800">{selectedItem.howItWorks.length} Step process :</h2>
                        {selectedItem.howItWorks?.map((step, index) => (
                            <div
                                key={index}
                                className="flex flex-col md:flex-row items-center gap-6 bg-white p-4 border border-gray-200 rounded-lg shadow-lg"
                            >
                                {/* Image Section */}
                                { step.imageUrl && (
                                <img
                                    src={step.imageUrl}
                                    alt={step.title}
                                    className="w-32 h-32 object-cover rounded-md"
                                />
                                )}

                                {/* Text Section */}
                                <div className="flex-1">
                                    <h3 className="text-lg font-semibold text-gray-800">
                                        Step :{index+1} {step.title}
                                    </h3>
                                    <p className="text-gray-600">{step.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>


                )}

                  {/* faq Section */}
                  <div className="next-component mt-5 mb-5">
                    {/* Your next component content */}
                    <hr />
                </div>
                {selectedItem.faq && (
                    <div className="space-y-6">
                        <h2 className="text-lg font-semibold text-gray-800">Frequently Asked Questions</h2>
                        <div>
                            {selectedItem.faq?.map((faq, index) => (
                                <div key={index} className="mb-2 border rounded-lg shadow-md">
                                    <div
                                        className="flex justify-between items-center p-4 cursor-pointer bg-gray-100"
                                        onClick={() => toggleFAQ(index)}
                                    >
                                        <span className="font-semibold">{faq.question}</span>
                                        <span className={`transform transition-transform ${openIndex === index ? "rotate-180" : ""}`}
                                         style={{ color: "rgb(255,198,48)" }}>
                                             {openIndex === index ? "▲" : "▼"}
              </span>
                                    </div>
                                    {openIndex === index && (
                                        <div className="p-4 text-gray-700 border-t">{faq.answer}</div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                )}
                {/* Close Button */}
                <button
                    onClick={closeModal}
                    className="mt-4 px-4 py-2 bg-red-500 text-white rounded-lg shadow-md hover:bg-red-600 transition w-full"
                >
                    Close
            </button>
            </div>
        </div>
    );
};

export default ServiceDetail;
