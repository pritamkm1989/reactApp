import React from "react";
import Layout from './layout';
import Testimonials from '../components/testimonials'


const AboutPage = () => {
  return (
    <Layout>
      <div className="font-sans">
        <main className="py-16 text-center">
          <h2 className="text-4xl font-bold">About Us</h2>
          <p className="text-gray-600 mt-4">At Urbex, we specialize in expert service and repair for a wide range of products and appliances, ensuring quality and reliability. </p>
          <p className="text-gray-600 mt-2">
          Our skilled technicians are dedicated to providing fast, efficient, and customer-focused solutions..
        </p>
        <Testimonials/>
        </main>
      </div>
    </Layout>
  );
};

export default AboutPage;
