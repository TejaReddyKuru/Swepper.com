import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, ArrowRight, Sparkles } from 'lucide-react';
import axios from 'axios';
import { toast } from 'react-toastify';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  useEffect(() => {
    // If user is already logged in, redirect to dashboard
    const userInfo = localStorage.getItem('userInfo');
    if (userInfo) {
      navigate('/dashboard');
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      return toast.error('Please enter all fields');
    }

    setIsLoading(true);
    try {
      const { data } = await axios.post(`${API_URL}/api/users/login`, {
        email,
        password,
      });

      localStorage.setItem('userInfo', JSON.stringify(data));
      toast.success(`Welcome back, ${data.name}!`);
      navigate('/dashboard');
    } catch (error) {
      const errorMsg = error.response?.data?.message || 'Invalid credentials';
      
      // If user exists but is not verified, take them to registration to finish verification
      if (error.response?.data?.unverified) {
        toast.info('Please verify your email to complete registration');
        navigate('/register', { state: { email, autoStep: 2 } });
      } else {
        toast.error(errorMsg);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-32 pb-20 px-4 flex flex-col justify-center items-center relative">
      <div className="w-full max-w-md">
        
        {/* Logo or Greeting */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-700 text-sm font-semibold mb-4">
            <Sparkles size={14} className="animate-pulse" />
            <span>Welcome to Spotless Living</span>
          </div>
          <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">
            Client <span className="text-[#059669]">Sign In</span>
          </h1>
          <p className="mt-2.5 text-slate-500 font-medium">
            Manage your cleanings and active subscriptions.
          </p>
        </div>

        {/* Glassmorphic Form Card */}
        <div className="bg-white/80 backdrop-blur-xl border border-slate-100/80 rounded-3xl p-8 shadow-[0_20px_50px_rgba(5,150,105,0.08)]">
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Email Field */}
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">
                Email Address
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-emerald-500 transition-colors">
                  <Mail size={18} />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full pl-11 pr-4 py-3 bg-white/50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 font-semibold text-slate-800 transition-all placeholder:text-slate-400 shadow-sm"
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-bold text-slate-700">
                  Password
                </label>
              </div>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-emerald-500 transition-colors">
                  <Lock size={18} />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-11 pr-4 py-3 bg-white/50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 font-semibold text-slate-800 transition-all placeholder:text-slate-400 shadow-sm"
                  required
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#059669] hover:bg-[#047857] text-white py-3.5 px-6 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all shadow-[0_6px_20px_rgba(5,150,105,0.25)] hover:shadow-[0_10px_25px_rgba(5,150,105,0.35)] active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none group"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-3 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>

          </form>

          {/* Registration Redirect Link */}
          <div className="mt-8 text-center border-t border-slate-100 pt-6">
            <p className="text-slate-500 font-semibold text-sm">
              New to SWEEPER.CO?{' '}
              <Link
                to="/register"
                className="text-[#059669] hover:text-[#047857] hover:underline"
              >
                Create an account
              </Link>
            </p>
          </div>

        </div>

      </div>
    </div>
  );
};

export default Login;
