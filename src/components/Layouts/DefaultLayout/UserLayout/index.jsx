import React from 'react';
import Header from './Header';
import Footer from './Footer';

const UserLayout = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-primary-50 via-green-50 to-white-50">
      <Header />
      <main className="flex-1 min-h-0">
        <div className="min-h-full">
          {children}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default UserLayout;