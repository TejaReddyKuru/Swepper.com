import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, Calendar, PlusCircle, CheckCircle, Clock, Smartphone, Mail, User as UserIcon, Sparkles, ShoppingCart } from 'lucide-react';
import axios from 'axios';
import { toast } from 'react-toastify';

const UserDashboard = () => {
  const [user, setUser] = useState(null);
  const [inquiries, setInquiries] = useState([]);
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Form State for new inquiry
  const [selectedPlan, setSelectedPlan] = useState('Basic Plan');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL || (import.meta.env.PROD ? '' : 'http://localhost:5000');

  useEffect(() => {
    const userInfo = localStorage.getItem('userInfo');
    if (!userInfo) {
      toast.warn('Please login to access the dashboard');
      navigate('/login');
      return;
    }
    
    const parsedUser = JSON.parse(userInfo);
    setUser(parsedUser);
    
    // Fetch inquiries matching user email
    const fetchInquiries = async () => {
      try {
        const config = {
          headers: {
            Authorization: `Bearer ${parsedUser.token}`,
          },
        };
        const [inqRes, ordRes, profileRes] = await Promise.all([
          axios.get(`${API_URL}/api/inquiries/my`, config).catch(() => ({ data: [] })),
          axios.get(`${API_URL}/api/orders/my`, config).catch(() => ({ data: [] })),
          axios.get(`${API_URL}/api/users/profile`, config).catch(() => ({ data: parsedUser }))
        ]);
        setInquiries(inqRes.data);
        setOrders(ordRes.data);
        setUser({ ...parsedUser, ...profileRes.data });
      } catch (error) {
        console.error('Error fetching inquiries:', error);
        toast.error('Could not load inquiries');
      } finally {
        setIsLoading(false);
      }
    };

    fetchInquiries();
  }, [navigate, API_URL]);

  const handleLogout = () => {
    localStorage.removeItem('userInfo');
    toast.success('Logged out successfully');
    navigate('/login');
  };

  const handleInquirySubmit = async (e) => {
    e.preventDefault();
    if (!message) {
      return toast.error('Please enter a description for your cleaning inquiry');
    }

    setIsSubmitting(true);
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const payload = {
        name: user.name,
        email: user.email,
        phone: user.phone,
        selectedPlan,
        message,
      };

      const { data } = await axios.post(`${API_URL}/api/inquiries`, payload, config);
      
      toast.success('Inquiry submitted successfully!');
      setMessage('');
      // Refresh list
      setInquiries([data, ...inquiries]);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Could not submit inquiry');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading || !user) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-32 pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      
      {/* Warm Header Section */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-6 mb-12">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-700 text-sm font-semibold mb-3">
            <Sparkles size={14} className="animate-pulse" />
            <span>Welcome to your dashboard</span>
          </div>
          <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">
            Hello, <span className="text-[#059669]">{user.name}</span>!
          </h1>
          <p className="mt-1 text-slate-500 font-medium">
            Review your active clean-up requests and schedule new appointments.
          </p>
        </div>

        {/* User Card & Logout */}
        <div className="flex items-center gap-4 bg-white/70 backdrop-blur-md border border-slate-100 p-3 rounded-2xl shadow-sm">
          <div className="flex flex-col text-right hidden sm:flex">
            <span className="font-bold text-slate-800 text-sm">{user.email}</span>
            <span className="text-xs font-semibold text-slate-400">Phone: {user.phone}</span>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center justify-center gap-2 bg-rose-50 hover:bg-rose-100 text-rose-600 font-bold px-4 py-2.5 rounded-xl border border-rose-100 transition-colors shadow-sm active:scale-[0.98]"
          >
            <LogOut size={16} />
            <span>Logout</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Create new Inquiry */}
        <div className="lg:col-span-1">
          <div className="bg-white/80 backdrop-blur-xl border border-slate-100 rounded-3xl p-6 shadow-[0_10px_30px_rgba(5,150,105,0.04)]">
            <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
              <PlusCircle size={20} className="text-[#059669]" />
              <span>Book a Cleaning</span>
            </h2>
            
            <form onSubmit={handleInquirySubmit} className="space-y-4">
              
              {/* Name (Read-Only) */}
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Your Name</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <UserIcon size={16} />
                  </div>
                  <input
                    type="text"
                    value={user.name}
                    disabled
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-100/70 border border-slate-200 rounded-xl text-slate-500 font-semibold cursor-not-allowed"
                  />
                </div>
              </div>

              {/* Email (Read-Only) */}
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Your Email</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Mail size={16} />
                  </div>
                  <input
                    type="text"
                    value={user.email}
                    disabled
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-100/70 border border-slate-200 rounded-xl text-slate-500 font-semibold cursor-not-allowed"
                  />
                </div>
              </div>

              {/* Phone (Read-Only) */}
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Your Phone</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Smartphone size={16} />
                  </div>
                  <input
                    type="text"
                    value={user.phone}
                    disabled
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-100/70 border border-slate-200 rounded-xl text-slate-500 font-semibold cursor-not-allowed"
                  />
                </div>
              </div>

              {/* Selected Plan */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Subscription Plan</label>
                <select
                  value={selectedPlan}
                  onChange={(e) => setSelectedPlan(e.target.value)}
                  className="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 font-semibold text-slate-800 shadow-sm"
                >
                  <option value="Basic Plan">Basic Plan</option>
                  <option value="Premium Plan">Premium Plan</option>
                  <option value="Customised Plan">Customised Plan</option>
                </select>
              </div>

              {/* Message / Description */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Requirements & Details</label>
                <textarea
                  rows={4}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Tell us about your home (rooms, sq ft, special instructions, preferred schedule day, etc.)."
                  className="w-full p-3.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 font-semibold text-slate-800 transition-all placeholder:text-slate-400 shadow-sm text-sm"
                  required
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-[#059669] hover:bg-[#047857] text-white py-3 px-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-[0_4px_12px_rgba(5,150,105,0.2)] active:scale-[0.98] disabled:opacity-50"
              >
                {isSubmitting ? (
                  <div className="w-5 h-5 border-3 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <>
                    <span>Submit Inquiry</span>
                  </>
                )}
              </button>

            </form>
          </div>
        </div>

        {/* Right Column: Inquiries List */}
        <div className="lg:col-span-2 space-y-6">
          
          <div className="bg-white/80 backdrop-blur-xl border border-slate-100 rounded-3xl p-6 shadow-[0_10px_30px_rgba(5,150,105,0.04)] min-h-[400px]">
            <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
              <Calendar size={20} className="text-[#059669]" />
              <span>Inquiry History ({inquiries.length})</span>
            </h2>

            {inquiries.length === 0 ? (
              <div className="flex flex-col justify-center items-center py-20 text-center">
                <div className="w-16 h-16 bg-emerald-50 border border-emerald-100 rounded-full flex justify-center items-center text-emerald-600 mb-4 animate-bounce">
                  <Calendar size={28} />
                </div>
                <h3 className="font-bold text-slate-800 text-lg">No inquiries yet</h3>
                <p className="text-slate-400 text-sm font-semibold max-w-sm mt-1">
                  Ready for a sparkling clean home? Use the booking panel on the left to schedule your first request!
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {inquiries.map((inq) => (
                  <div
                    key={inq._id}
                    className="p-5 border border-slate-100 hover:border-emerald-100 bg-white/50 hover:bg-emerald-50/10 rounded-2xl transition-all shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4 hover:-translate-y-0.5"
                  >
                    
                    {/* Inquiry Info */}
                    <div className="space-y-1.5 max-w-lg">
                      <div className="flex items-center gap-2.5">
                        <span className="font-extrabold text-slate-800">{inq.selectedPlan}</span>
                        <span className="text-xs text-slate-400 font-semibold flex items-center gap-1">
                          <Clock size={12} />
                          {new Date(inq.createdAt).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric'
                          })}
                        </span>
                      </div>
                      <p className="text-slate-600 text-sm font-medium leading-relaxed italic">
                        "{inq.message}"
                      </p>
                    </div>

                    {/* Status Badge */}
                    <div>
                      {inq.status === 'new' ? (
                        <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-amber-50 border border-amber-200 text-amber-700 font-bold text-xs shadow-sm">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-ping"></span>
                          <span>Pending Approval</span>
                        </div>
                      ) : (
                        <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 font-bold text-xs shadow-sm">
                          <CheckCircle size={12} className="text-emerald-500" />
                          <span>Cleaner Scheduled!</span>
                        </div>
                      )}
                    </div>

                  </div>
                ))}
              </div>
            )}

          </div>

          {/* Purchase History */}
          <div className="bg-white/80 backdrop-blur-xl border border-slate-100 rounded-3xl p-6 shadow-[0_10px_30px_rgba(5,150,105,0.04)] min-h-[400px]">
            <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
              <ShoppingCart size={20} className="text-[#059669]" />
              <span>Service Status & Purchases ({orders.length})</span>
            </h2>

            {/* Global Service Status from Admin */}
            <div className={`mb-6 p-5 rounded-2xl border ${user?.serviceStatus && (!user?.serviceExpiryDate || new Date(user.serviceExpiryDate) > new Date()) ? 'bg-emerald-50 border-emerald-200' : 'bg-slate-50 border-slate-200'}`}>
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-bold text-slate-800">Current Subscription Status</h3>
                  <p className="text-xs font-semibold text-slate-500 mt-1">
                    {user?.serviceStatus && (!user?.serviceExpiryDate || new Date(user.serviceExpiryDate) > new Date()) 
                      ? `Active until ${new Date(user.serviceExpiryDate).toLocaleDateString()}` 
                      : 'No active subscription currently'}
                  </p>
                </div>
                {user?.serviceStatus && (!user?.serviceExpiryDate || new Date(user.serviceExpiryDate) > new Date()) ? (
                  <span className="px-3 py-1 bg-emerald-100 text-emerald-700 text-xs font-black rounded-full uppercase tracking-widest">
                    Active
                  </span>
                ) : (
                  <span className="px-3 py-1 bg-slate-200 text-slate-500 text-xs font-black rounded-full uppercase tracking-widest">
                    Inactive
                  </span>
                )}
              </div>
              {user?.serviceStatus && (!user?.serviceExpiryDate || new Date(user.serviceExpiryDate) > new Date()) && (
                <button 
                  onClick={() => {
                     const message = `Hello SWEEPER.CO,\n\nI want to book my eligible service!`;
                     window.open(`https://wa.me/918317546078?text=${encodeURIComponent(message)}`, '_blank');
                  }}
                  className="w-full mt-4 bg-[#059669] text-white py-2.5 rounded-xl font-bold hover:bg-[#047857] transition-colors flex items-center justify-center gap-2 text-sm shadow-sm"
                >
                  <CheckCircle size={16} /> Book Daily Service
                </button>
              )}
            </div>

            {orders.length === 0 ? (
              <div className="flex flex-col justify-center items-center py-20 text-center">
                <div className="w-16 h-16 bg-emerald-50 border border-emerald-100 rounded-full flex justify-center items-center text-emerald-600 mb-4 animate-bounce">
                  <ShoppingCart size={28} />
                </div>
                <h3 className="font-bold text-slate-800 text-lg">No purchases yet</h3>
                <p className="text-slate-400 text-sm font-semibold max-w-sm mt-1">
                  When you checkout a digital plan, your purchase history will appear here.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {orders.map((ord) => (
                  <div
                    key={ord._id}
                    className="p-5 border border-slate-100 bg-white rounded-2xl shadow-sm flex flex-col gap-4"
                  >
                    <div className="flex justify-between items-start">
                      <div className="space-y-1">
                        <span className="font-extrabold text-slate-800 block text-lg">Order #{ord._id.slice(-6).toUpperCase()}</span>
                        <span className="text-sm text-slate-500 font-medium flex items-center gap-1">
                          <Clock size={14} />
                          {new Date(ord.createdAt).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric'
                          })}
                        </span>
                      </div>
                      <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 font-bold text-xs shadow-sm">
                        <CheckCircle size={12} className="text-emerald-500" />
                        <span>{ord.paymentStatus}</span>
                      </div>
                    </div>

                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 space-y-2">
                      {ord.items.map((item, idx) => (
                        <div key={idx} className="flex justify-between items-center text-sm">
                          <span className="font-semibold text-slate-700">{item.planName} {item.detail && `(${item.detail})`}</span>
                          <span className="font-bold text-slate-900">₹{item.price}</span>
                        </div>
                      ))}
                    </div>

                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

      </div>

    </div>
  );
};

export default UserDashboard;
