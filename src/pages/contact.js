import React from "react";
import { motion } from "framer-motion";
import Layout from './layout';
import { Input, Textarea, Button } from '../components/ui';
import { FiMapPin, FiPhone, FiMail, FiClock, FiSend } from "react-icons/fi";

const ContactPage = () => {
  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="text-center max-w-2xl mx-auto mb-12"
        >
          <h1 className="text-3xl sm:text-4xl font-bold text-surface-900 dark:text-white">Contact Us</h1>
          <p className="text-surface-600 dark:text-surface-300 mt-3">Get in touch for any inquiries or appointments.</p>
        </motion.div>

        <div className="grid lg:grid-cols-5 gap-8 max-w-5xl mx-auto">
          {/* Contact Info */}
          <div className="lg:col-span-2 space-y-4">
            {[
              { icon: FiMapPin, label: "Address", value: "Bhubaneswar, Odisha" },
              { icon: FiPhone, label: "Phone", value: "+91 12345 67890" },
              { icon: FiMail, label: "Email", value: "info@urbex.in" },
              { icon: FiClock, label: "Working Hours", value: "Mon–Sat, 9AM–8PM" },
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-3 bg-white rounded-xl p-4 border border-surface-100 shadow-soft">
                <div className="p-2.5 bg-primary-100 text-primary-600 rounded-lg shrink-0">
                  <item.icon size={18} />
                </div>
                <div>
                  <p className="text-xs font-medium text-surface-500 uppercase tracking-wider">{item.label}</p>
                  <p className="text-sm font-medium text-surface-900 mt-0.5">{item.value}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="lg:col-span-3 bg-white rounded-2xl p-6 sm:p-8 border border-surface-100 shadow-soft"
          >
            <h2 className="text-lg font-semibold text-surface-900 mb-6">Send us a message</h2>
            <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
              <div className="grid sm:grid-cols-2 gap-4">
                <Input label="Your Name" placeholder="John Doe" />
                <Input label="Your Email" type="email" placeholder="john@example.com" />
              </div>
              <Input label="Subject" placeholder="How can we help?" />
              <Textarea label="Message" placeholder="Tell us more about your inquiry..." rows={4} />
              <Button type="submit" variant="primary" size="lg" className="w-full">
                <FiSend size={16} />
                Send Message
              </Button>
            </form>
          </motion.div>
        </div>
      </div>
    </Layout>
  );
};

export default ContactPage;
