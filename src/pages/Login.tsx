import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const Login: React.FC = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const { login, state } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/dashboard';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const success = await login(formData.email, formData.password);
    if (success) {
      navigate(from, { replace: true });
    } else {
      setError('Invalid email or password. Please try again.');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center py-8 px-4">
      <div className="w-full max-w-sm bg-white rounded-2xl shadow p-8">
        <div className="flex flex-col items-center mb-6">
          <span className="bg-emerald-100 rounded-full p-2 mb-2"><Mail className="h-7 w-7 text-emerald-600" /></span>
          <span className="text-xl font-bold text-gray-900">Sign in to ReWear</span>
        </div>
        <form className="space-y-5" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-md p-3 text-sm text-red-600 mb-2">{error}</div>
          )}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><Mail className="h-5 w-5 text-gray-400" /></span>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="block w-full pl-10 pr-3 py-2 rounded-full border border-gray-300 placeholder-gray-400 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 text-sm"
                placeholder="Enter your email"
              />
            </div>
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><Lock className="h-5 w-5 text-gray-400" /></span>
              <input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                required
                value={formData.password}
                onChange={handleChange}
                className="block w-full pl-10 pr-10 py-2 rounded-full border border-gray-300 placeholder-gray-400 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 text-sm"
                placeholder="Enter your password"
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                onClick={() => setShowPassword(!showPassword)}
                tabIndex={-1}
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                ) : (
                  <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                )}
              </button>
            </div>
          </div>
          <div className="flex items-center justify-between text-xs">
            <Link to="/forgot-password" className="text-emerald-600 hover:underline">Forgot password?</Link>
            <Link to="/signup" className="text-gray-500 hover:underline">Sign up</Link>
          </div>
          <button
            type="submit"
            disabled={state.loading}
            className="w-full py-2 rounded-full bg-emerald-600 text-white font-semibold text-base hover:bg-emerald-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {state.loading ? 'Signing in...' : 'Sign in'}
          </button>
        </form>
        <div className="mt-6 text-center text-xs text-gray-400">
          Demo: user@rewear.com / password<br />Admin: admin@rewear.com / password
        </div>
      </div>
    </div>
  );
};

export default Login;