import React from 'react';
import Header from '../components/header';
import Footer from '../components/footer';


const Layout = ({ children }) => {
  return (
    <div className=" mt-20 bg-gray-100">
      <Header className="mt-6"/>
      <div className="content">
        <main>{children}</main>
      </div>
      <Footer />
    </div>
  );
};

export default Layout;
