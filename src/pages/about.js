import React from "react";
import { motion } from "framer-motion";
import Layout from './layout';
import Testimonials from '../components/testimonials';
import { FiTool, FiShield, FiUsers, FiClock, FiAward } from "react-icons/fi";

const stats = [
  { icon: FiTool, label: "Services Offered", value: "50+" },
  { icon: FiUsers, label: "Happy Customers", value: "5,000+" },
  { icon: FiClock, label: "Years Experience", value: "8+" },
  { icon: FiAward, label: "Satisfaction Rate", value: "98%" },
 ];

const AboutPage = () => {
  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <h1 className="text-3xl sm:text-4xl font-bold text-surface-900 dark:text-white">About UrbEx</h1>
          <p className="text-surface-600 dark:text-surface-300 mt-4 text-lg leading-relaxed">
            At Urbex, we specialize in expert service and repair for a wide range of products and appliances, 
            ensuring quality and reliability. Our skilled technicians are dedicated to providing fast, efficient, 
            and customer-focused solutions.
          </p>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-16">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: i * 0.08 }}
              className="bg-white rounded-2xl p-6 text-center border border-surface-100 shadow-soft"
            >
              <div className="inline-flex items-center justify-center w-12 h-12 bg-primary-100 text-primary-600 rounded-xl mb-3">
                <stat.icon size={24} />
              </div>
              <p className="text-2xl font-bold text-surface-900">{stat.value}</p>
              <p className="text-sm text-surface-500 mt-1">{stat.label}</p>
            </motion.div>
          ))}
        </div>

        {/* Values */}
        <div className="bg-white rounded-2xl border border-surface-100 shadow-soft p-8 lg:p-12 mb-16">
          <h2 className="text-2xl font-bold text-surface-900 mb-6 text-center">Our Core Values</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: FiShield, title: "Quality Service", desc: "We stand behind every repair with a satisfaction guarantee." },
              { icon: FiClock, title: "Timely Response", desc: "Fast response times and on-schedule service visits." },
              { icon: FiUsers, title: "Customer First", desc: "Your satisfaction is our top priority, always." },
            ].map((v, i) => (
              <div key={i} className="text-center p-4">
                <div className="inline-flex items-center justify-center w-10 h-10 bg-surface-100 text-surface-600 rounded-lg mb-3">
                  <v.icon size={20} />
                </div>
                <h3 className="font-semibold text-surface-900">{v.title}</h3>
                <p className="text-sm text-surface-500 mt-1">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>

        <Testimonials />
      </div>
    </Layout>
  );
};

export default AboutPage;
