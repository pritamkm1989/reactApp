import React from "react";
import '../reportWebVitals';  // Or './App.css' if you named it differently
import Header from "../components/header";
import Footer from "../components/footer";
import ImageCarousel from "../components/ImageCarousel";


const HomePage = () => {
  return (
    <div className="font-sans">
      <Header /> {/* Including the Header component */}

      {/* Image Carousel */}
      <section className="py-16">
       
        <ImageCarousel /> {/* Carousel Component */}
      </section>

      {/* Hero Section */}
      <header className="bg-gray-100 py-20 text-center">
        <h2 className="text-4xl font-bold">Your Health is Our Priority</h2>
        <p className="text-gray-600 mt-2">Providing quality healthcare solutions for everyone.</p>
        <button className="mt-4 px-6 py-2 bg-blue-600 text-white rounded">Make an Appointment</button>
      </header>
      
      {/* Services Section */}
      <section className="py-16 bg-white text-center">
        <h3 className="text-3xl font-semibold">Our Services</h3>
        <p className="text-gray-600 mt-2">We offer a wide range of medical services</p>
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6 px-6">
          <div className="p-6 border rounded-lg shadow-md">
            <h4 className="text-xl font-bold">General Checkup</h4>
            <p className="text-gray-500 mt-2">Routine health assessments for all ages.</p>
          </div>
          <div className="p-6 border rounded-lg shadow-md">
            <h4 className="text-xl font-bold">Specialist Consultation</h4>
            <p className="text-gray-500 mt-2">Expert medical advice from specialists.</p>
          </div>
          <div className="p-6 border rounded-lg shadow-md">
            <h4 className="text-xl font-bold">Emergency Services</h4>
            <p className="text-gray-500 mt-2">24/7 medical emergency support.</p>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 bg-gray-100 text-center">
        <h3 className="text-3xl font-semibold">Contact Us</h3>
        <p className="text-gray-600 mt-2">Get in touch for any inquiries or appointments.</p>
        <form className="mt-6 max-w-lg mx-auto">
          <input type="text" placeholder="Your Name" className="w-full p-3 border rounded mb-4" />
          <input type="email" placeholder="Your Email" className="w-full p-3 border rounded mb-4" />
          <textarea placeholder="Your Message" className="w-full p-3 border rounded mb-4"></textarea>
          <button className="px-6 py-2 bg-blue-600 text-white rounded">Send Message</button>
        </form>
      </section>

      <Footer /> {/* Including the Footer component */}
    </div>
  );
};

export default HomePage;