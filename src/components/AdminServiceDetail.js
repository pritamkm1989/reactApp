import React, { useState, useEffect } from "react";
import { FiUpload } from "react-icons/fi";
import { uploadImage } from '../services/ImageUpload'
const AdminServiceDetail = ({ serviceDetail, closeModal, serviceId }) => {
    const [uploadedImages, setUploadedImages] = useState({});
    const [loading, setLoading] = useState(false);
    
    const handleFileChange = async (event, index) => {
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
                    [index]: imagePath,
                }));
            }
        }
    };

    const [newServiceDetail, setNewServiceDetail] = useState({
        name: "",
        imageUrl: "",
        rate: "",
        discount: "",
        aboutService: [],
        howItWorks: [],
        faq: []
    });

    useEffect(() => {

        setNewServiceDetail(serviceDetail);

    }, [serviceDetail]);


    // Add About Service
    const addAboutService = () => {

        setNewServiceDetail((prev) => ({
            ...prev,
            aboutService: [...(prev?.aboutService || []), ""]
        }));

    };

    // Update About Service
    const updateAboutService = (index, value) => {
        const updatedAboutService = [...newServiceDetail.aboutService];
        updatedAboutService[index] = value;
        setNewServiceDetail((prev) => ({
            ...prev,
            aboutService: updatedAboutService
        }));
    };

    // Add FAQ
    const addFAQ = () => {
        setNewServiceDetail((prev) => ({
            ...prev,
            faq: [...prev?.faq || [], { question: "", answer: "" }]
        }));
    };

    // Update FAQ
    const updateFaq = (index, field, value) => {
        const updatedFAQ = [...newServiceDetail.faq];
        updatedFAQ[index][field] = value;
        setNewServiceDetail((prev) => ({
            ...prev,
            faq: updatedFAQ
        }));
    }

    // Add How It Works
    const addHowItWorks = () => {
        setNewServiceDetail((prev) => ({
            ...prev,
            howItWorks: [...(prev?.howItWorks || []),{ title: "", description: "",imageUrl:"" }]
        }));
    };

    // Update How It Works
    const updateHowItWorks = (index,field, value) => {
        const updatedHowItWorks = [...(newServiceDetail.howItWorks || [])];
        updatedHowItWorks[index][field] = value;
        setNewServiceDetail((prev) => ({
            ...prev,
            howItWorks: updatedHowItWorks
        }));
       // console.log('updateHowItWorks'+newServiceDetail?.howItWorks[1].title)
    };


    const handleChange = (e) => {
        const { name, value } = e.target;
        setNewServiceDetail((prev) => ({ ...prev, [name]: value }));
    };

    const submitDeatil = async () => {
        console.log(serviceId);
        setLoading(true)
        if (uploadedImages.details) {
            newServiceDetail.imageUrl = uploadedImages.details
        }

        Object.keys(uploadedImages).forEach((key, index) => {
            if (key.startsWith('hiw')) {

                const index = parseInt(key.replace('hiw', '')); // Extract the index (0, 1, 2, ...)

                // Ensure that the index exists in howItWorks and update the imageUrl
                if (newServiceDetail.howItWorks[index]) {
                    newServiceDetail.howItWorks[index].imageUrl = uploadedImages[key];
                }
            }
        })
        newServiceDetail.serviceId = serviceId;
        newServiceDetail.isActive = true;
        console.log(newServiceDetail);
        
        try {
            const response = await fetch(`${process.env.REACT_APP_BE_APP_API_BASE_URL}/api/service/${serviceId}/saveOrUpdatedetails`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(newServiceDetail),
            });
            setLoading(false)

            await response.json();
            closeModal();
        } catch (error) {
            console.error(`Error in API call: service detail`, error);
        } 
       
    };

    const changeStatus = async (serviceId, status, action) => {
        console.log(serviceId, status, action);
        setLoading(true);

        try {
            const response = await fetch(`${process.env.REACT_APP_BE_APP_API_BASE_URL}/api/product/saveOrUpdateServicType`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify( { id: serviceId, [action]: !status }),
            });
            console.log(await response.json());
            closeModal();
        } catch (error) {
            console.error(`Error in API call:` , error);
        } finally {
            setLoading(false);
        }

    }



    return (

      
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
              { loading && (
            <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50">
                <div className="w-16 h-16 border-4 border-[rgb(255,198,48)] border-t-transparent rounded-full animate-spin"></div>
            </div>
        )}
            <div className="bg-white rounded-lg shadow-lg p-6 w-11/12 md:w-1/2 max-h-[80vh] overflow-y-auto">
                {/* Modal Header */}
                <div className="flex justify-between items-center border-b pb-2">
                    <h2 className="text-2xl font-bold text-gray-800"> Manage Services Detail</h2>
                    {newServiceDetail.isActive ? (
                                        <span onClick={() => changeStatus(serviceId, newServiceDetail.isActive , 'isActive')}  className="text-green-500 bg-gray-200 px-2 py-1 rounded-full mr-1 hover:bg-[rgb(255,198,48)] cursor-pointer">Active</span>
                                    ) : (
                                        <span onClick={() => changeStatus(serviceId, newServiceDetail.isActive , 'isActive')} className="text-red-500 bg-gray-200 px-2 py-1 rounded-full mr-1 hover:bg-[rgb(255,198,48)] cursor-pointer">Inactive </span>
                                    )}
                    <button onClick={closeModal} className="text-gray-500 hover:text-gray-700 text-xl">
                        ✕
              </button>
                </div>

                <div className="flex-1">
                    <div className="">
                        <table className="min-w-full border border-gray-300">
                            <tbody>
                                {/* Service Name */}
                                <tr className="border-b">
                                    <td className="p-2 font-semibold border-r">Detail Name</td>
                                    <td className="p-2">
                                        <input
                                            type="text"
                                            name = "name"
                                            //onChange={handleChange}
                                            value = {newServiceDetail?.name ||  'Sub category & Service type name'}
                                            //placeholder={newServiceDetail?.name || 'Sub category & Service type name'}
                                            className="border p-2 w-full"
                                        />
                                    </td>
                                </tr>

                                {/* Image Upload */}
                                <tr className="border-b">
                                    <td className="p-2 font-semibold border-r">Dispaly Image</td>
                                    <td className="p-2">


                                        {newServiceDetail?.imageUrl && (
                                            <img
                                                src={newServiceDetail.imageUrl}
                                                alt={newServiceDetail.name}
                                                className="w-20 h-20 object-cover rounded-lg mt-2"
                                            />
                                        )}

                                        <label className="w-full flex items-center justify-center p-2  text-green-500 rounded-lg cursor-pointer hover:bg-[rgb(255,198,48)] transition-all shadow-md">
                                            <FiUpload className="mr-2 text-lg" />
                                         Change Dispaly Image
                                        <input
                                                type="file"
                                                className="hidden"
                                                multiple={false}
                                                onChange={(event) => handleFileChange(event, 'details')}
                                            />
                                        </label>

                                    </td>
                                </tr>

                                {/* Service Rate */}
                                <tr className="border-b">
                                    <td className="p-2 font-semibold border-r">Rate</td>
                                    <td className="p-2">
                                        <input
                                            type="number"
                                            name= 'rate'
                                            onChange={handleChange}
                                            value={newServiceDetail?.rate || "Enter rate"}
                                            className="border p-2 w-full"
                                        />
                                    </td>
                                </tr>

                                {/* Discount */}
                                <tr>
                                    <td className="p-2 font-semibold border-r">Discount</td>
                                    <td className="p-2">
                                        <input
                                            type="number"
                                            name="discount"
                                            value={newServiceDetail?.discount}
                                            onChange={handleChange}
                                            placeholder={newServiceDetail?.discount || "Enter discount"}
                                            className="border p-2 w-full"
                                        />
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>


                    <div>
                        <div>
                            <h2 className="text-2xl font-bold text-gray-800">About Service</h2>
                        </div>
                        <div>
                            <table className="min-w-full border border-gray-300">
                                <thead>
                                    <tr className="bg-gray-100">
                                        <th className="p-2 border">Sl No</th>
                                        <th className="p-2 border">About Service</th>


                                    </tr>
                                </thead>
                                <tbody>
                                    {newServiceDetail?.aboutService?.map((abt, index) => (
                                        <tr className="border">
                                            <td className="p-2 border">
                                                <div
                                                    key={index + 1}
                                                >{index + 1}</div>
                                            </td>
                                            <td className="p-2 border">
                                                <input
                                                    type="text"
                                                    className="border p-2 w-full"
                                                    value={abt}
                                                    placeholder={abt}
                                                    onChange={(e) => updateAboutService(index, e.target.value)}
                                                />
                                            </td>
                                        </tr>
                                    ))}
                                    <tr>
                                        <td className="p-2 border">
                                            <span onClick={addAboutService} className="bg-gray-200 px-2 py-1 rounded-full mr-1 text-green-500 hover:bg-[rgb(255,198,48)] cursor-pointer"> Add</span>
                                        </td>
                                        <td className="p-2 border">

                                        </td></tr>
                                </tbody>
                            </table>
                        </div>

                    </div>
                    <div>
                        <div><h2 className="text-2xl font-bold text-gray-800">How it works</h2></div>
                        <div>
                            <table className="min-w-full border border-gray-300">
                                <thead>
                                    <tr className="bg-gray-100">
                                        <th className="p-2 border">Sl No</th>
                                        <th className="p-2 border">Title</th>
                                        <th className="p-2 border">Description</th>
                                        <th className="p-2 border">Dispaly Iamge</th>

                                    </tr>
                                </thead>
                                <tbody>
                                    {newServiceDetail?.howItWorks?.map((howItWorks, index) => (
                                        <tr className="border">
                                            <td className="p-2 border">
                                                <div
                                                    key={index + 1}
                                                >{index + 1}</div>
                                            </td>
                                            <td className="p-2 border">
                                        
                                                
                                                <input
                                                    type="text"
                                                    className="border p-2 w-full"
                                                    placeholder={howItWorks.title}
                                                    value={howItWorks.title}
                                                    onChange={(e) => updateHowItWorks(index, "title", e.target.value)}
                                                />
                                            </td>
                                            <td className="p-2 border">
                                                
                                                <input
                                                    type="text"
                                                    className="border p-2 w-full"
                                                    placeholder={howItWorks.description}
                                                    value={howItWorks.description}
                                                    onChange={(e) => updateHowItWorks(index, "description", e.target.value)}
                                                />
                                            </td>
                                            <td className="p-2 border">
                                            {howItWorks.imageUrl && (
                                                <img
                                                    src={howItWorks.imageUrl}

                                                    className="w-20 h-20 object-cover rounded-lg mb-2"
                                                />
                                            )}

                                                <label className="w-full flex items-center justify-center p-2  text-green-500 rounded-lg cursor-pointer hover:bg-[rgb(255,198,48)] transition-all shadow-md">
                                                    <FiUpload className="mr-2 text-lg" />
                                         Change Dispaly Image
                                        <input
                                                        type="file"
                                                        className="hidden"
                                                        multiple={false}
                                                        onChange={(event) => handleFileChange(event,'hiw'+index)}
                                                    />
                                                </label>
                                            </td>
                                        </tr>))}

                                    <tr>
                                        <td className="p-2 border">
                                            <span onClick={addHowItWorks} className="bg-gray-200 px-2 py-1 rounded-full mr-1 text-green-500 hover:bg-[rgb(255,198,48)] cursor-pointer"> Add</span>
                                        </td>

                                        <td className="p-2 border">
                                          
                                                    </td>
                                        <td className="p-2 border">
                                           
                                                    </td>
                                        <td className="p-2 border">


                                          
                                        </td>
                                    </tr>
                                </tbody>
                            </table>

                        </div>
                    </div>

                    <div>
                        <div>
                            <h2 className="text-2xl font-bold text-gray-800">Frequently Asked Questions</h2>
                        </div>
                        <div>
                            <table className="min-w-full border border-gray-300">
                                <thead>
                                    <tr className="bg-gray-100">
                                        <th className="p-2 border">Sl No</th>
                                        <th className="p-2 border">Question</th>
                                        <th className="p-2 border">Answer</th>


                                    </tr>
                                </thead>
                                <tbody>
                                    {newServiceDetail?.faq?.map((fa, index) => (
                                        <tr className="border">
                                            <td className="p-2 border">
                                                <div
                                                    key={index + 1}
                                                >{index + 1}</div>
                                            </td>
                                            <td className="p-2 border">
                        
                                                <input
                                                    type="text"
                                                    className="border p-2 w-full"
                                                    placeholder={fa.question}
                                                    value = {fa.question}
                                                    onChange={(e) => updateFaq(index,'question', e.target.value)}
                                                />
                                            </td>
                                            <td className="p-2 border">

                                                <input
                                                    type="text"
                                                    className="border p-2 w-full"
                                                    value = {fa.answer}
                                                    placeholder={fa.answer}
                                                    onChange={(e) => updateFaq(index,'answer', e.target.value)}
                                                />
                                            </td>
                                        </tr>
                                    ))}
                                    <tr>
                                        <td className="p-2 border">
                                            <span onClick={addFAQ} className="bg-gray-200 px-2 py-1 rounded-full mr-1 text-green-500 hover:bg-[rgb(255,198,48)] cursor-pointer">
                                                Add
                                                    </span>
                                        </td>
                                        <td className="p-2 border">

                                        </td>
                                        <td className="p-2 border">

                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>

                    </div>
                </div>

                {/* Close Button */}
                <div className="mt-6 flex gap-4">
                    <button
                        onClick={closeModal}
                        className="mt-4 px-4 py-2 bg-red-500 text-white rounded-lg shadow-md hover:bg-red-600 transition w-full"
                    >
                        Close
         </button>

                    <button
                        onClick={submitDeatil}
                        className="mt-4 px-4 py-2 bg-[rgb(255,198,48)] text-white rounded-lg shadow-md hover:bg-[rgb(255,198,48)] transition w-full"
                    >
                        Submit
         </button>
                </div>
            </div>
        </div>
    );
};

export default AdminServiceDetail;