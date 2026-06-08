import React from 'react';
import Header from '../components/header';
import Footer from '../components/footer';
import { ScrollToTop, BackToTop } from '../components/ui';

const Layout = ({ children }) => {
  return (
    <>
      <ScrollToTop />
      <div className="min-h-screen flex flex-col bg-surface-50 dark:bg-surface-900 transition-colors">
        <Header />
        <main className="flex-1 pt-16">
          {children}
        </main>
        <Footer />
        <BackToTop />
      </div>
    </>
  );
};

export default Layout;
