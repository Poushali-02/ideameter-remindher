import React, { useState, type ReactNode } from 'react';
import SideBar from './sideBar';

interface DashboardLayoutProps {
  children: ReactNode;
}

const Dashboard: React.FC<DashboardLayoutProps> = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-tr from-pink-100 via-white to-purple-100">
      <SideBar isOpen={isSidebarOpen} onToggle={toggleSidebar} />
      <main 
        className={`flex-1 bg-white p-8 transition-all duration-300 ease-in-out rounded-2xl shadow-2xl border border-pink-100 mx-2 my-4 ${
          isSidebarOpen ? 'ml-0' : 'ml-0'
        }`}
      >
        {/* Toggle button for mobile/small screens */}
        {!isSidebarOpen && (
          <button
            onClick={toggleSidebar}
            className="fixed top-4 left-4 z-50 bg-purple-500 text-white p-2 rounded-full shadow-xl hover:bg-pink-600 focus:ring-2 focus:ring-pink-300 transition-colors lg:hidden border-2 border-white"
            aria-label="Open sidebar"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        )}
        {children}
      </main>
    </div>
  );
};

export default Dashboard;
