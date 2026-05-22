import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { User, Mail, Lock, Phone, ArrowRight, ShieldCheck, Sparkles, RefreshCw } from 'lucide-react';
import axios from 'axios';
import { toast } from 'react-toastify';

const Register = () => {
  const [step, setStep] = useState(1); // 1 = Info Form, 2 = OTP Verification
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  
  const [isLoading, setIsLoading] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0); // in seconds
  
  const navigate = useNavigate();
  const location = useLocation();
  const API_URL = import.meta.env.VITE_API_URL || (import.meta.env.PROD ? '' : 'http://localhost:5000');

  useEffect(() => {
    // Check if user is already logged in
    const userInfo = localStorage.getItem('userInfo');
    if (userInfo) {
      navigate('/dashboard');
      return;
    }

    // Handle auto-step redirection from login for unverified users
    if (location.state?.autoStep === 2 && location.state?.email) {
      setEmail(location.state.email);
      setStep(2);
      setResendCooldown(30);
      // Trigger OTP sending on mount for unverified redirection
      axios.post(`${API_URL}/api/users/resend-otp`, { email: location.state.email })
        .then(() => toast.info('A new OTP has been sent to your email.'))
        .catch(() => {});
    }
  }, [navigate, location.state, API_URL]);

  // Handle countdown timer for Resend OTP button
  useEffect(() => {
    let timer;
    if (resendCooldown > 0) {
      timer = setTimeout(() => setResendCooldown(prev => prev - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [resendCooldown]);

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    if (!name || !email || !phone || !password) {
      return toast.error('Please fill out all fields');
    }

    setIsLoading(true);
    try {
      const { data } = await axios.post(`${API_URL}/api/users/register`, {
        name,
        email,
        phone,
        password,
      });

      toast.success(data.message || 'OTP sent successfully!');
      setStep(2);
      setResendCooldown(60); // 60 seconds cooldown
    } catch (error) {
      toast.error(error.response?.data?.message || 'Registration failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifySubmit = async (e) => {
    e.preventDefault();
    if (!otp || otp.length !== 6) {
      return toast.error('Please enter the 6-digit verification code');
    }

    setIsLoading(true);
    try {
      const { data } = await axios.post(`${API_URL}/api/users/verify-otp`, {
        email,
        otp,
      });

      localStorage.setItem('userInfo', JSON.stringify(data));
      toast.success(`Welcome to SWEEPER.CO, ${data.name}!`);
      navigate('/dashboard');
    } catch (error) {
      toast.error(error.response?.data?.message || 'OTP verification failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOTP = async () => {
    if (resendCooldown > 0) return;
    
    setIsLoading(true);
    try {
      await axios.post(`${API_URL}/api/users/resend-otp`, { email });
      toast.success('A fresh OTP has been sent to your email address!');
      setResendCooldown(60);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Could not resend OTP');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-32 pb-20 px-4 flex flex-col justify-center items-center relative">
      <div className="w-full max-w-md">
        
        {/* Header Section */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-700 text-sm font-semibold mb-4">
            <Sparkles size={14} className="animate-pulse" />
            <span>Join SWEEPER.CO Today</span>
          </div>
          <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">
            {step === 1 ? <>Create <span className="text-[#059669]">Account</span></> : <>Email <span className="text-[#059669]">Verification</span></>}
          </h1>
          <p className="mt-2.5 text-slate-500 font-medium">
            {step === 1 
              ? 'Get instant pricing, verify your details, and book now.' 
              : `We sent a 6-digit code to ${email}`
            }
          </p>
        </div>

        {/* Glassmorphic Form Card */}
        <div className="bg-white/80 backdrop-blur-xl border border-slate-100/80 rounded-3xl p-8 shadow-[0_20px_50px_rgba(5,150,105,0.08)]">
          
          {step === 1 ? (
            /* ================= STEP 1: REGISTRATION INFO ================= */
            <form onSubmit={handleRegisterSubmit} className="space-y-5">
              
              {/* Full Name */}
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1.5">Full Name</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-emerald-500 transition-colors">
                    <User size={18} />
                  </div>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="John Doe"
                    className="w-full pl-11 pr-4 py-2.5 bg-white/50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 font-semibold text-slate-800 transition-all placeholder:text-slate-400 shadow-sm"
                    required
                  />
                </div>
              </div>

              {/* Email Address */}
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1.5">Email Address</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-emerald-500 transition-colors">
                    <Mail size={18} />
                  </div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="john@example.com"
                    className="w-full pl-11 pr-4 py-2.5 bg-white/50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 font-semibold text-slate-800 transition-all placeholder:text-slate-400 shadow-sm"
                    required
                  />
                </div>
              </div>

              {/* Phone Number */}
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1.5">Phone Number</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-emerald-500 transition-colors">
                    <Phone size={18} />
                  </div>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="919876543210"
                    className="w-full pl-11 pr-4 py-2.5 bg-white/50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 font-semibold text-slate-800 transition-all placeholder:text-slate-400 shadow-sm"
                    required
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1.5">Password</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-emerald-500 transition-colors">
                    <Lock size={18} />
                  </div>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Minimum 6 characters"
                    className="w-full pl-11 pr-4 py-2.5 bg-white/50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 font-semibold text-slate-800 transition-all placeholder:text-slate-400 shadow-sm"
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
                    <span>Generate Email OTP</span>
                    <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>

            </form>
          ) : (
            /* ================= STEP 2: OTP VERIFICATION ================= */
            <form onSubmit={handleVerifySubmit} className="space-y-6">
              
              <div className="text-center">
                <label className="block text-sm font-bold text-slate-700 mb-4">
                  Enter 6-Digit One-Time Password
                </label>
                
                {/* Styled single text input for simple, highly accessible numerical entry */}
                <div className="relative max-w-xs mx-auto">
                  <input
                    type="text"
                    maxLength={6}
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))} // only digits
                    placeholder="000000"
                    className="w-full text-center text-3xl font-extrabold tracking-[10px] pl-3 py-4 bg-emerald-50/50 border-2 border-dashed border-emerald-300 rounded-2xl text-emerald-800 focus:outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 transition-all shadow-sm"
                    required
                  />
                </div>
              </div>

              {/* Verify OTP Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-[#059669] hover:bg-[#047857] text-white py-3.5 px-6 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all shadow-[0_6px_20px_rgba(5,150,105,0.25)] active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none group"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-3 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <>
                    <ShieldCheck size={18} />
                    <span>Verify & Get Clean</span>
                  </>
                )}
              </button>

              {/* Resend OTP details */}
              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={handleResendOTP}
                  disabled={isLoading || resendCooldown > 0}
                  className="inline-flex items-center gap-2 text-sm font-bold text-slate-600 hover:text-emerald-600 disabled:opacity-50 disabled:hover:text-slate-600 transition-colors"
                >
                  <RefreshCw size={14} className={isLoading ? 'animate-spin' : ''} />
                  {resendCooldown > 0 
                    ? `Resend OTP in ${resendCooldown}s` 
                    : 'Resend Verification Code'
                  }
                </button>
              </div>

              {/* Back to Step 1 */}
              <div className="text-center">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="text-xs font-semibold text-slate-400 hover:text-slate-600 transition-colors"
                >
                  Need to change your details? Go back
                </button>
              </div>

            </form>
          )}

          {/* Login Redirect Link */}
          <div className="mt-8 text-center border-t border-slate-100 pt-6">
            <p className="text-slate-500 font-semibold text-sm">
              Already have an account?{' '}
              <Link
                to="/login"
                className="text-[#059669] hover:text-[#047857] hover:underline"
              >
                Sign In
              </Link>
            </p>
          </div>

        </div>

      </div>
    </div>
  );
};

export default Register;
