import React from "react";
import Layout from './layout';
import Service from "../components/Service";

const ServicePage = () => {
  return (
    <Layout>
    <div className="font-sans">
      <main className="py-16 text-center">
        <h2 className="text-4xl font-bold">About Us</h2>
        <p className="text-gray-600 mt-4">We are a healthcare provider dedicated to your well-being.</p>
        <p className="text-gray-600 mt-2">
          Our mission is to deliver high-quality healthcare services to everyone.
        </p>
        <Service/>
      </main>
    </div>
    </Layout>
  );
};

export default ServicePage;
