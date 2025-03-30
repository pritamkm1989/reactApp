import React from "react";
import '../reportWebVitals';  // Or './App.css' if you named it differently
import ImageCarousel from "../components/ImageCarousel";
import Service from "../components/Service";
import Layout from './layout';
import ImageBox from '../components/Animaton'
import Testimonials from '../components/testimonials'
import AnimatedText from '../components/AnimatedText'


const HomePage = () => {
  return (
    <Layout>
      <div className="font-sans">


        <section className="flex justify-center items-center gap-4 p-8 w-full bg-white">
          <div className="flex w-full sm:w-1/2 h-full">
            <ImageBox className="flex-1 h-full" />
          </div>
          <div className="flex w-full sm:w-1/2 h-full justify-end items-center">
            <AnimatedText className="flex-1 h-full" />
          </div>
        </section>

 {/* Next Component (add gap between sections) */}
 <div className="next-component">
        {/* Your next component content */}
        <hr />
      </div>



        {/* Services Section */}
        <section className="p-2 text-center">
          <div className = "">
          <h3 className="text-3xl font-semibold">Our Services</h3>
          <Service   /></div>
        </section>


        <Testimonials />

      </div>
    </Layout>
  );
};

export default HomePage;