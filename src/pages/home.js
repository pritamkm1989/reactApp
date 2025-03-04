import React from "react";
import '../reportWebVitals';  // Or './App.css' if you named it differently
import Header from "../components/header";
import Footer from "../components/footer";
import ImageCarousel from "../components/ImageCarousel";
import Service from "../components/Service";


const HomePage = () => {
  return (
    <div className="font-sans">
      <Header /> {/* Including the Header component */}

      {/* Image Carousel */}
      <section className="py-16">
       
        <ImageCarousel /> {/* Carousel Component */}
      </section>

    
      
      {/* Services Section */}
      <section className="py-16 bg-white text-center">
        <h3 className="text-3xl font-semibold">Our Services</h3>
        <Service/>
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