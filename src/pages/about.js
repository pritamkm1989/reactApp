import React from "react";
import Header from "../components/header";
import Footer from "../components/footer";
import ApplianceRepairService from "../components/Service";

const AboutPage = () => {
  return (
    <div className="font-sans">
      <Header />
      <main className="py-16 text-center">
        <h2 className="text-4xl font-bold">About Us</h2>
        <p className="text-gray-600 mt-4">We are a healthcare provider dedicated to your well-being.</p>
        <p className="text-gray-600 mt-2">
          Our mission is to deliver high-quality healthcare services to everyone.
        </p>
        <ApplianceRepairService/>
      </main>
      <Footer />
    </div>
  );
};

export default AboutPage;
