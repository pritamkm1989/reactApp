import React from 'react';
import Header from '../components/header';
import Footer from '../components/footer';
import { ToastProvider } from '../components/ui/Toast';
import { ScrollToTop, BackToTop } from '../components/ui';

const Layout = ({ children }) => {
  return (
    <ToastProvider>
      <ScrollToTop />
      <div className="min-h-screen flex flex-col bg-surface-50 dark:bg-surface-900 transition-colors">
        <Header />
        <main className="flex-1 pt-16">
          {children}
        </main>
        <Footer />
        <BackToTop />
      </div>
    </ToastProvider>
  );
};

export default Layout;
