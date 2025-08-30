// filepath: front/src/components/header/UserDropdown.tsx
import React from 'react';
import { Link } from 'react-router-dom';

const UserDropdown: React.FC = () => {
  return (
    <div className="relative">
      <button className="flex items-center text-gray-700 hover:text-gray-900">
        <span>User</span>
        <svg
          className="ml-1 w-4 h-4"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
        </svg>
      </button>
      <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-10">
        <Link to="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Profile</Link>
        <Link to="/settings" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Settings</Link>
        <Link to="/logout" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Logout</Link>
      </div>
    </div>
  );
};

export default UserDropdown;