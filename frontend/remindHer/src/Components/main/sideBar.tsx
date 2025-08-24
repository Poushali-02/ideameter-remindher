// import React from 'react';
interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
}

function Sidebar({ isOpen, onToggle }: SidebarProps) {
  return (
    <div 
      className={`h-screen text-black flex flex-col py-10 px-3 transition-all duration-300 ease-in-out bg-gradient-to-b from-pink-100 via-white to-purple-50 border-r border-pink-200 shadow-xl ${
        isOpen ? 'w-64' : 'w-16'
      } relative`}
    >
      {/* Toggle Button */}
      <button
        onClick={onToggle}
        className="absolute -right-4 top-8 bg-white border-2 border-pink-400 text-pink-600 rounded-full p-1 hover:bg-pink-100 focus:ring-2 focus:ring-pink-300 transition-colors z-10 shadow-md"
        aria-label="Toggle sidebar"
      >
        <svg 
          className={`w-5 h-5 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      {/* Dashboard Title */}
      <h2 className={`text-2xl font-extrabold mb-8 text-pink-700 tracking-wide drop-shadow-md transition-all duration-300 ${
        isOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-90 w-0 overflow-hidden'
      }`}>
        REMINDHER
      </h2>

      {/* Navigation Links */}
      <ul className="flex flex-col gap-4">
        <SidebarLink href="/" text="Home" isOpen={isOpen} />
        <SidebarLink href="/pcod" text="Predict PCOD" isOpen={isOpen} />
        <SidebarLink href="/menstrual_irregularity" text="Menstrual Irregularity" isOpen={isOpen} />
        <SidebarLink href="/education" text="Education" isOpen={isOpen} />
        <SidebarLink href="/get_doctors_nearby" text="Get Doctors nearby" isOpen={isOpen} />
        <SidebarLink href="/contact" text="Contact us" isOpen={isOpen} />
      </ul>
    </div>
  );
}

// Helper component for sidebar links
interface SidebarLinkProps {
  href: string;
  text: string;
  isOpen: boolean;
}

function SidebarLink({ href, text, isOpen }: SidebarLinkProps) {
  return (
    <a 
      href={href} 
      className="relative hover:bg-pink-200 hover:text-pink-900 px-3 py-2 rounded-lg cursor-pointer transition-all duration-200 flex items-center gap-3 group font-medium text-pink-700 focus:outline-none focus:ring-2 focus:ring-pink-300"
      title={!isOpen ? text : undefined}
    >
      <span className={`transition-all duration-300 ${
        isOpen ? 'opacity-100 w-auto' : 'opacity-0 w-0 overflow-hidden'
      }`}>
        {text}
      </span>
      {/* Tooltip for collapsed state */}
      {!isOpen && (
        <div className="absolute left-16 bg-pink-700 text-white px-2 py-1 rounded shadow-lg text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-20">
          {text}
        </div>
      )}
    </a>
  );
}

export default Sidebar;
