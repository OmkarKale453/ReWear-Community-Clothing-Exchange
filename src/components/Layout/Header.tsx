import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, User } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const Header: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { state: authState, logout } = useAuth();
  const location = useLocation();

  const navigation = [
    { name: 'Browse', href: '/browse' },
    { name: 'Add', href: '/add-item' },
    { name: 'Dashboard', href: '/dashboard' },
  ];

  const isActivePath = (path: string) => location.pathname === path;

  return (
    <header className="bg-white border-b sticky top-0 z-50 shadow-sm">
      <div className="max-w-5xl mx-auto px-4 flex justify-between items-center h-16">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <span className="bg-emerald-100 rounded-full p-2"><User className="h-6 w-6 text-emerald-600" /></span>
          <span className="text-xl font-bold text-gray-900">ReWear</span>
        </Link>
        {/* Desktop Nav */}
        <nav className="hidden md:flex gap-4 items-center">
          {navigation.map((item) => (
            <Link
              key={item.name}
              to={item.href}
              className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                isActivePath(item.href)
                  ? 'bg-emerald-100 text-emerald-700'
                  : 'text-gray-700 hover:bg-emerald-50 hover:text-emerald-700'
              }`}
            >
              {item.name}
            </Link>
          ))}
          {authState.isAuthenticated && authState.user?.isAdmin && (
            <Link
              to="/admin"
              className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                isActivePath('/admin')
                  ? 'bg-emerald-100 text-emerald-700'
                  : 'text-gray-700 hover:bg-emerald-50 hover:text-emerald-700'
              }`}
            >
              Admin
            </Link>
          )}
        </nav>
        {/* Auth/User */}
        <div className="hidden md:flex items-center gap-2">
          {authState.isAuthenticated ? (
            <button
              onClick={logout}
              className="bg-emerald-600 text-white px-4 py-1 rounded-full text-sm font-medium hover:bg-emerald-700 transition-colors"
            >
              Logout
            </button>
          ) : (
            <>
              <Link to="/login" className="text-gray-700 px-3 py-1 rounded-full text-sm hover:bg-emerald-50 hover:text-emerald-700">Sign in</Link>
              <Link to="/signup" className="bg-emerald-600 text-white px-4 py-1 rounded-full text-sm font-medium hover:bg-emerald-700 transition-colors">Sign up</Link>
            </>
          )}
        </div>
        {/* Mobile menu button */}
        <button
          className="md:hidden p-2 rounded-full hover:bg-emerald-50 text-gray-700"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>
      {/* Mobile Nav */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-t">
          <nav className="flex flex-col gap-1 px-4 py-2">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`px-3 py-2 rounded-full text-base font-medium ${
                  isActivePath(item.href)
                    ? 'bg-emerald-100 text-emerald-700'
                    : 'text-gray-700 hover:bg-emerald-50 hover:text-emerald-700'
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
            {authState.isAuthenticated && authState.user?.isAdmin && (
              <Link
                to="/admin"
                className={`px-3 py-2 rounded-full text-base font-medium ${
                  isActivePath('/admin')
                    ? 'bg-emerald-100 text-emerald-700'
                    : 'text-gray-700 hover:bg-emerald-50 hover:text-emerald-700'
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Admin
              </Link>
            )}
            {authState.isAuthenticated ? (
              <button
                onClick={() => {
                  logout();
                  setIsMobileMenuOpen(false);
                }}
                className="bg-emerald-600 text-white px-4 py-2 rounded-full text-base font-medium mt-2 hover:bg-emerald-700 transition-colors"
              >
                Logout
              </button>
            ) : (
              <>
                <Link to="/login" className="text-gray-700 px-3 py-2 rounded-full text-base hover:bg-emerald-50 hover:text-emerald-700" onClick={() => setIsMobileMenuOpen(false)}>Sign in</Link>
                <Link to="/signup" className="bg-emerald-600 text-white px-4 py-2 rounded-full text-base font-medium mt-2 hover:bg-emerald-700 transition-colors" onClick={() => setIsMobileMenuOpen(false)}>Sign up</Link>
              </>
            )}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;