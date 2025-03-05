import React from 'react';
import Header from '../components/header';
import Footer from '../components/footer';


const Layout = ({ children }) => {
  return (
    <div className="layout">
      <Header />
      <div className="content">
        <main>{children}</main>
      </div>
      <Footer />
    </div>
  );
};

export default Layout;
