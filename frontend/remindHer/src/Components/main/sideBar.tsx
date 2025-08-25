// import React from 'react';
interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
}

function Sidebar({ isOpen, onToggle }: SidebarProps) {
  return (
    <div 
      className={`h-screen text-black flex flex-col py-8 px-4 transition-all duration-500 ease-out relative overflow-hidden ${
        isOpen ? 'w-72' : 'w-20 lg:w-20'
      }`}
    >
      {/* Beautiful background with multiple layers */}
      <div className="absolute inset-0 bg-gradient-to-br from-pink-50 via-white to-purple-50"></div>
      <div className="absolute inset-0 bg-gradient-to-t from-pink-100/30 via-transparent to-purple-100/30"></div>
      
      {/* Floating background elements */}
      <div className="absolute top-10 right-4 w-32 h-32 bg-gradient-to-r from-pink-200/20 to-purple-200/20 rounded-full blur-2xl animate-pulse"></div>
      <div className="absolute bottom-20 left-2 w-28 h-28 bg-gradient-to-r from-purple-200/15 to-pink-200/15 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      
      {/* Frosted glass overlay */}
      <div className="absolute inset-0 backdrop-blur-sm bg-white/40 border-r border-pink-200/50 shadow-2xl shadow-pink-500/10"></div>
      
      {/* Content - relative to appear above background */}
      <div className="relative z-10 h-full flex flex-col">
        {/* Mobile close button - Only visible on mobile when sidebar is open */}
        <button
          onClick={onToggle}
          className="lg:hidden absolute top-2 right-4 p-2 rounded-xl bg-white/90 backdrop-blur-sm hover:bg-white border border-gray-200 text-gray-600 hover:text-gray-800 transition-all duration-200 shadow-lg z-20"
          aria-label="Close sidebar"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Logo Section with Integrated Toggle - Enhanced */}
        <div className="mb-10 mt-4">
          {/* Clickable Logo Icon with Toggle Functionality - Hidden on mobile */}
          <div className={`hidden lg:block transition-all duration-500 ${isOpen ? 'mb-4' : 'mb-0'}`}>
            <button
              onClick={onToggle}
              className="w-12 h-12 bg-gradient-to-br from-pink-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto shadow-xl shadow-pink-500/30 hover:shadow-pink-500/50 transition-all duration-300 transform hover:scale-110 focus:outline-none focus:ring-4 focus:ring-pink-300/50 group"
              aria-label="Toggle sidebar"
            >
              {/* Heart SVG with animation */}
              <svg 
                className="w-6 h-6 text-white transition-transform duration-300 group-hover:scale-110" 
                fill="currentColor" 
                viewBox="0 0 24 24"
              >
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
              </svg>
              
              {/* Pulse animation ring */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-pink-500 to-purple-600 opacity-0 group-hover:opacity-20 animate-ping"></div>
              
              {/* Toggle indicator - Shows direction */}
              <div className={`absolute -bottom-1 -right-1 w-4 h-4 bg-white rounded-full shadow-md flex items-center justify-center transition-transform duration-300 ${
                isOpen ? 'rotate-180' : 'rotate-0'
              }`}>
                <svg className="w-2 h-2 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7" />
                </svg>
              </div>
            </button>
          </div>

          {/* Mobile-only Static Logo */}
          <div className="lg:hidden mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto shadow-xl shadow-pink-500/30">
              <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
              </svg>
            </div>
          </div>

          {/* Brand Title */}
          <div className={`transition-all duration-500 transform ${
            isOpen 
              ? 'opacity-100 scale-100 translate-x-0' 
              : 'opacity-0 scale-75 -translate-x-4 h-0 overflow-hidden lg:h-auto lg:opacity-0'
          }`}>
            <h2 className="text-3xl font-black text-center mb-1">
              <span className="bg-gradient-to-r from-pink-600 via-purple-600 to-pink-700 bg-clip-text text-transparent drop-shadow-sm">
                REMINDHER
              </span>
            </h2>
            <div className="w-16 h-1 bg-gradient-to-r from-pink-500 to-purple-500 mx-auto rounded-full shadow-lg animate-pulse"></div>
          </div>
        </div>

        {/* Navigation Links - Enhanced */}
        <nav className="flex-1">
          <ul className="flex flex-col gap-3">
            <SidebarLink href="/" text="Home" isOpen={isOpen} icon="🏠" />
            <SidebarLink href="/pcod_tracker" text="Predict PCOD" isOpen={isOpen} icon="🔬" />
            <SidebarLink href="/menstrual_irregularity" text="Menstrual Irregularity" isOpen={isOpen} icon="📊" />
            <SidebarLink href="/education" text="Education" isOpen={isOpen} icon="📚" />
            <SidebarLink href="/get_doctors_nearby" text="Get Doctors nearby" isOpen={isOpen} icon="👩‍⚕️" />
            <SidebarLink href="/contact" text="Contact us" isOpen={isOpen} icon="💬" />
          </ul>
        </nav>

        {/* Bottom decoration */}
        <div className={`mt-auto transition-all duration-500 ${
          isOpen ? 'opacity-100' : 'opacity-0'
        }`}>
          <div className="text-center text-xs text-gray-500 space-y-2">
            <div className="flex items-center justify-center gap-2">
              <div className="w-2 h-2 bg-pink-400 rounded-full animate-pulse"></div>
              <span>Your Health Companion</span>
              <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Enhanced Helper component for sidebar links (unchanged)
interface SidebarLinkProps {
  href: string;
  text: string;
  isOpen: boolean;
  icon: string;
}

function SidebarLink({ href, text, isOpen, icon }: SidebarLinkProps) {
  return (
    <li className="relative group">
      <a 
        href={href} 
        className={`relative block px-4 py-4 rounded-2xl transition-all duration-300 group-hover:transform group-hover:scale-105 ${
          isOpen 
            ? 'hover:bg-gradient-to-r hover:from-pink-100 hover:to-purple-100 hover:shadow-lg' 
            : 'hover:bg-gradient-to-r hover:from-pink-200/50 hover:to-purple-200/50'
        } focus:outline-none focus:ring-2 focus:ring-pink-300/50 cursor-pointer`}
        title={!isOpen ? text : undefined}
      >
        {/* Background glow on hover */}
        <div className="absolute inset-0 bg-gradient-to-r from-pink-500/5 to-purple-500/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        
        <div className="relative flex items-center gap-4">
          {/* Icon */}
          <div className={`text-2xl transition-all duration-300 ${
            isOpen 
              ? 'transform group-hover:scale-110' 
              : 'mx-auto transform group-hover:scale-125 group-hover:rotate-12'
          }`}>
            {icon}
          </div>
          
          {/* Text */}
          <span className={`font-semibold text-gray-700 group-hover:text-gray-900 transition-all duration-300 ${
            isOpen 
              ? 'opacity-100 w-auto transform translate-x-0' 
              : 'opacity-0 w-0 overflow-hidden transform -translate-x-2'
          }`}>
            {text}
          </span>

          {/* Hover indicator */}
          <div className={`absolute right-0 top-1/2 transform -translate-y-1/2 w-1 h-0 bg-gradient-to-b from-pink-500 to-purple-500 rounded-full transition-all duration-300 group-hover:h-8 ${
            isOpen ? 'opacity-100' : 'opacity-0'
          }`}></div>
        </div>
      </a>

      {/* Enhanced Tooltip for collapsed state - Hidden on mobile */}
      {!isOpen && (
        <div className="hidden lg:block absolute left-20 top-1/2 transform -translate-y-1/2 bg-gradient-to-r from-pink-600 to-purple-600 text-white px-4 py-2 rounded-xl shadow-2xl text-sm font-medium opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none whitespace-nowrap z-30 scale-95 group-hover:scale-100">
          {text}
          {/* Tooltip arrow */}
          <div className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-1 w-2 h-2 bg-pink-600 rotate-45"></div>
        </div>
      )}

      {/* Active link indicator */}
      <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-pink-500 to-purple-500 rounded-r-full opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
    </li>
  );
}

export default Sidebar;
