import React from 'react';
import Header from '../components/header';
import Footer from '../components/footer';


const Layout = ({ children }) => {
  return (
    <div className="layout mt-20">
      <Header className="mt-6"/>
      <div className="content">
        <main>{children}</main>
      </div>
      <Footer />
    </div>
  );
};

export default Layout;
