import React from 'react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-50 border-t mt-8">
      <div className="max-w-5xl mx-auto px-4 py-8 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <span className="bg-emerald-100 rounded-full p-2"><span className="font-bold text-emerald-600">R</span></span>
          <span className="text-lg font-bold text-gray-900">ReWear</span>
        </div>
        <nav className="flex gap-4 text-sm">
          <Link to="/browse" className="text-gray-600 hover:text-emerald-600">Browse</Link>
          <Link to="/add-item" className="text-gray-600 hover:text-emerald-600">Add</Link>
          <Link to="/dashboard" className="text-gray-600 hover:text-emerald-600">Dashboard</Link>
        </nav>
        <div className="text-gray-400 text-xs">© 2024 ReWear</div>
      </div>
    </footer>
  );
};

export default Footer;