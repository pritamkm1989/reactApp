import React from "react";
import { renderStars } from './utils';



const ServiceList = ({ serviceDetail, serviceDetails, openModal }) => {

  
    return (

        

        <div className="mt-4 p-6 bg-white border rounded-lg shadow-lg transition-all">
            <div className="flex flex-col gap-6 md:flex-row">
                {/* Constant Section (Shows Selected Category & Subcategory Details) */}
                <div className="w-full md:w-1/3 bg-gray-100 p-4 rounded-lg shadow-md flex items-center gap-4">
                    <div className="flex-1">
                        {serviceDetail && (
                            <div className="mt-2">
                                <p className="font-medium break-words whitespace-normal">{serviceDetail.name}</p>
                                <p className="text-gray-500">Price: {serviceDetail.rate}</p>
                                <p className="text-yellow-500 font-semibold">Review: {renderStars(serviceDetail.rattings)} </p>
                                <ul className="list-disc pl-5 text-gray-700 mt-2">
                                    {serviceDetail?.aboutService?.length > 0 ? (
                                        serviceDetail.aboutService.slice(0, 2).map((service, idx) => (
                                            <li key={idx} className="break-words whitespace-normal w-[200px]">
                                                {service}

                                            </li>
                                        ))
                                    ) : (
                                        <p>No services available</p>
                                    )}
                                </ul>
                                <button
                                    onClick={() => openModal(serviceDetail)}
                                    className="mt-3 px-4 py-2 bg-[rgb(255,198,48)] text-white rounded-lg shadow-md transition"
                                >
                                    View More
            </button>
                            </div>
                        )}
                    </div>
                </div>
                

                {/* Scrollable Section (Responsive Layout) */}
                <div className="w-full md:w-2/3 h-[300px] p-2 bg-gray-50 rounded-lg shadow-md  overflow-y-auto md:overflow-x-auto">
                    <div  className="flex flex-col md:flex-row gap-2 whitespace-nowrap  space-y-4 md:space-y-0 md:space-x-4">
                        {serviceDetails?.map((item, index) => (
                            <div
                                key={index}
                                className="flex w-full items-center gap-4 bg-white border border-gray-200 rounded-lg shadow-lg p-2 flex-nowrap"
                            >
                                <div className="flex-1 min-w-0">
                                    <h3 className="text-lg font-bold text-gray-800">{item.name}</h3>
                                    <p className="text-gray-500">Price: {item.rate}</p>
                                    <p className="text-yellow-500 font-semibold">Review: {renderStars(item.rattings)}  </p>
                                    <ul className="list-disc pl-5 text-gray-700 mt-2">
                                        {item?.aboutService?.length > 0 ? (
                                            item.aboutService.slice(0, 2).map((service, idx) => (
                                                <li key={idx} className="break-words whitespace-normal w-[150px]">{service}1</li>
                                            ))
                                        ) : (
                                            <p>No services available</p>
                                        )}
                                    </ul>
                                    <button
                                        onClick={() => openModal(item)}
                                        className="mt-3 px-4 py-2 bg-[rgb(255,198,48)] text-white rounded-lg shadow-md transition"
                                    >
                                        View More
            </button>
                                </div>

                                {/* Image Section */}
                                <div className="flex-shrink-0 w-24 h-24 md:w-32 md:h-32 flex items-center justify-center">
                                    {item.imageUrl && (
                                        <img
                                            src={item.imageUrl}
                                            alt={item.name || "Service Image"}
                                            className="w-full h-full object-cover rounded-md"
                                            
                                        />
                                    ) }
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ServiceList;
