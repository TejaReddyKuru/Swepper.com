import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import LenisWrapper from '../components/LenisWrapper';
import ThreeCanvas from '../components/ThreeCanvas';

const MainLayout = () => {
  return (
    <LenisWrapper>
      <div className="min-h-screen flex flex-col relative text-slate-900 bg-slate-50 overflow-hidden">
        {/* The 3D Canvas sits behind everything and is fixed */}
        <ThreeCanvas />
        
        <Navbar />
        
        {/* Main content sits on top of the 3D canvas */}
        <main className="flex-grow relative z-10">
          <Outlet />
        </main>
        
        <Footer />
      </div>
    </LenisWrapper>
  );
};

export default MainLayout;
