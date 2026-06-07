import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import ImageBox from "../components/Animaton";
import AnimatedText from "../components/AnimatedText";
import Service from "../components/Service";
import Testimonials from "../components/testimonials";
import Layout from './layout';
import { FiArrowRight, FiTool } from "react-icons/fi";

const HomePage = () => {
  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-50/50 via-white dark:via-surface-900 to-surface-50 dark:to-surface-900 pointer-events-none" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
          <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
            {/* Left Content */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary-100 text-primary-700 text-xs font-medium rounded-full mb-4">
                <FiTool size={14} />
                Expert Service & Repair
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-surface-900 dark:text-white leading-tight text-balance">
                Your Trusted Partner for{" "}
                <span className="text-primary-500">Appliance Repair</span>
              </h1>
              <div className="mt-4 text-surface-600 text-base sm:text-lg leading-relaxed">
                <AnimatedText />
              </div>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  to="/service"
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary-500 text-white font-medium rounded-xl hover:bg-primary-600 transition-colors shadow-soft hover:shadow-soft-md"
                >
                  Book a Service
                  <FiArrowRight size={18} />
                </Link>
                <Link
                  to="/about"
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-white dark:bg-surface-800 text-surface-700 dark:text-surface-200 font-medium rounded-xl border border-surface-200 dark:border-surface-700 hover:border-surface-300 dark:hover:border-surface-600 hover:shadow-soft transition-all"
                >
                  Learn More
                </Link>
              </div>
            </motion.div>

            {/* Right Image Grid */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.15 }}
              className="flex justify-center"
            >
              <ImageBox />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl font-bold text-surface-900 dark:text-white">Our Services</h2>
            <p className="text-surface-500 dark:text-surface-400 mt-2 max-w-xl mx-auto">
              Browse our range of professional repair and maintenance services
            </p>
          </div>
          <Service />
        </div>
      </section>

      {/* Testimonials */}
      <Testimonials />
    </Layout>
  );
};

export default HomePage;
