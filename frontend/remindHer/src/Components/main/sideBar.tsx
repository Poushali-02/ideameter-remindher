// import React from 'react';

function Sidebar() {
  return (
    <div className="h-screen bg-gray-800 text-white w-60 flex flex-col gap-2 py-8 px-4">
      <h2 className="text-2xl font-bold mb-6">Dashboard</h2>
      <ul className="flex flex-col gap-4">
        <li className="hover:bg-gray-700 px-3 py-2 rounded cursor-pointer">Home</li>
        <li className="hover:bg-gray-700 px-3 py-2 rounded cursor-pointer">Profile</li>
        <li className="hover:bg-gray-700 px-3 py-2 rounded cursor-pointer">Settings</li>
      </ul>
    </div>
  );
}

export default Sidebar;
