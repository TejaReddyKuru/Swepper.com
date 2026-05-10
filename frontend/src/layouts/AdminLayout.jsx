import React from 'react';
import { Outlet, Navigate, useNavigate } from 'react-router-dom';
import { LogOut, Home, Users, MessageSquare } from 'lucide-react';

const AdminLayout = () => {
  const token = localStorage.getItem('adminToken');
  const navigate = useNavigate();

  if (!token) {
    return <Navigate to="/admin/login" replace />;
  }

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    navigate('/admin/login');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className="w-64 bg-gray-900 text-white flex flex-col">
        <div className="p-6">
          <h2 className="text-2xl font-bold text-[#1DB954]">SWEEPER.CO</h2>
          <p className="text-xs text-gray-400 mt-1">Admin Dashboard</p>
        </div>
        
        <nav className="flex-1 px-4 py-6 space-y-2">
          <a href="#" className="flex items-center gap-3 px-4 py-3 bg-[#1DB954]/10 text-[#1DB954] rounded-xl font-medium">
            <MessageSquare size={20} />
            Inquiries
          </a>
          {/* Add more links if needed */}
        </nav>
        
        <div className="p-4 border-t border-gray-800">
          <button 
            onClick={handleLogout}
            className="flex items-center gap-3 text-gray-400 hover:text-white w-full px-4 py-2 transition-colors"
          >
            <LogOut size={20} />
            Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        <header className="bg-white shadow-sm h-16 flex items-center justify-between px-8">
          <h1 className="text-xl font-semibold text-gray-800">Dashboard</h1>
          <a href="/" className="flex items-center gap-2 text-sm text-gray-500 hover:text-[#1DB954]">
            <Home size={16} />
            View Website
          </a>
        </header>
        <main className="flex-1 p-8 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
