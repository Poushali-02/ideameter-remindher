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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-pink-50/30 to-purple-50/30 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_25%_25%,rgba(219,39,119,0.05)_0%,transparent_50%)]"></div>
        <div className="absolute bottom-0 right-0 w-full h-full bg-[radial-gradient(circle_at_75%_75%,rgba(147,51,234,0.05)_0%,transparent_50%)]"></div>
        
        {/* Floating geometric shapes */}
        <div className="absolute top-20 left-20 w-64 h-64 bg-gradient-to-br from-pink-100/40 to-transparent rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-32 right-32 w-80 h-80 bg-gradient-to-br from-purple-100/30 to-transparent rounded-full blur-3xl animate-pulse" style={{ animationDelay: '3s' }}></div>
      </div>

      {/* Mobile Top Navigation Bar */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-pink-100 shadow-sm">
        <div className="flex items-center justify-between px-4 py-3">
          {/* Mobile Toggle Button */}
          <button
            onClick={toggleSidebar}
            className="p-2.5 rounded-xl bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-lg hover:shadow-pink-500/25 transform hover:scale-105 transition-all duration-200"
            aria-label="Toggle sidebar"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          {/* Mobile Logo */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-pink-500 to-purple-600 rounded-lg flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
              </svg>
            </div>
            <span className="text-lg font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
              RemindHer
            </span>
          </div>
        </div>
      </div>

      <div className="relative z-10 flex min-h-screen">
        {/* Sidebar - Fixed positioning on mobile, relative on desktop */}
        <div className={`
          fixed lg:relative inset-y-0 left-0 z-40 transform transition-transform duration-300 ease-in-out
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}>
          <SideBar isOpen={isSidebarOpen} onToggle={toggleSidebar} />
        </div>

        {/* Main Content Area */}
        <div className={`
          flex-1 flex flex-col min-h-screen
          ${isSidebarOpen ? '' : 'lg:ml-0'}
          pt-16 lg:pt-0
        `}>
          {/* Main Content */}
          <main className="flex-1 p-4 sm:p-6 lg:p-8">
            {/* Content container with glass morphism */}
            <div className="min-h-[calc(100vh-8rem)]">
              {/* Bento grid layout wrapper */}
              <div className="relative">
                {/* Glassmorphism background */}
                {isSidebarOpen && (
                  <div className="absolute inset-0 bg-white/40 backdrop-blur-sm rounded-3xl border border-white/50 shadow-2xl shadow-pink-500/5"></div>
                )}

                {/* Content */}
                <div className="relative z-10 p-4 sm:p-6 lg:p-8 xl:p-10">
                  {children}
                </div>

                {/* Decorative elements */}
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-br from-pink-400 to-purple-500 rounded-full opacity-60 animate-ping"></div>
                <div className="absolute -bottom-2 -left-2 w-4 h-4 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full opacity-40 animate-ping" style={{ animationDelay: '1s' }}></div>
              </div>
            </div>
          </main>
        </div>
      </div>

      {/* Mobile Backdrop Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-30 lg:hidden transition-opacity duration-300"
          onClick={toggleSidebar}
          aria-label="Close sidebar"
        />
      )}
    </div>
  );
};

export default Dashboard;
