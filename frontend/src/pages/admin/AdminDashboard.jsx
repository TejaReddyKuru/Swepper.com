import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Trash2, CheckCircle, Search, Users, MessageSquare, ChevronDown, ChevronUp, ShoppingBag, TrendingUp, DollarSign, Activity, RefreshCw } from 'lucide-react';
import { toast } from 'react-toastify';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('analytics');
  const [inquiries, setInquiries] = useState([]);
  const [users, setUsers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedUserId, setExpandedUserId] = useState(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('adminToken');
      const headers = { Authorization: `Bearer ${token}` };
      const baseUrl = import.meta.env.VITE_API_URL || (import.meta.env.PROD ? '' : 'http://localhost:5000');
      
      const [inqRes, usersRes, ordersRes] = await Promise.all([
        axios.get(`${baseUrl}/api/inquiries`, { headers }),
        axios.get(`${baseUrl}/api/users`, { headers }).catch(() => ({ data: [] })),
        axios.get(`${baseUrl}/api/orders`, { headers }).catch(() => ({ data: [] }))
      ]);
      
      setInquiries(inqRes.data);
      setUsers(usersRes.data);
      setOrders(ordersRes.data);
    } catch (error) {
      toast.error('Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 15000); // 15s real-time refresh
    return () => clearInterval(interval);
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this inquiry?')) return;
    try {
      const token = localStorage.getItem('adminToken');
      const baseUrl = import.meta.env.VITE_API_URL || (import.meta.env.PROD ? '' : 'http://localhost:5000');
      await axios.delete(`${baseUrl}/api/inquiries/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Inquiry deleted');
      fetchData();
    } catch (error) {
      toast.error('Failed to delete');
    }
  };

  const handleMarkContacted = async (id) => {
    try {
      const token = localStorage.getItem('adminToken');
      const baseUrl = import.meta.env.VITE_API_URL || (import.meta.env.PROD ? '' : 'http://localhost:5000');
      await axios.put(`${baseUrl}/api/inquiries/${id}`, { status: 'contacted' }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Marked as contacted');
      fetchData();
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  const handleToggleService = async (orderId) => {
    try {
      const token = localStorage.getItem('adminToken');
      const baseUrl = import.meta.env.VITE_API_URL || (import.meta.env.PROD ? '' : 'http://localhost:5000');
      const { data } = await axios.patch(`${baseUrl}/api/orders/toggle-service/${orderId}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success(data.message);
      fetchData();
    } catch (error) {
      toast.error('Failed to toggle service');
    }
  };

  const handleToggleUserService = async (userId) => {
    try {
      const token = localStorage.getItem('adminToken');
      const baseUrl = import.meta.env.VITE_API_URL || (import.meta.env.PROD ? '' : 'http://localhost:5000');
      const { data } = await axios.patch(`${baseUrl}/api/users/${userId}/toggle-service`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success(data.message);
      fetchData();
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || 'Failed to toggle user service');
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) return;
    try {
      const token = localStorage.getItem('adminToken');
      const baseUrl = import.meta.env.VITE_API_URL || (import.meta.env.PROD ? '' : 'http://localhost:5000');
      await axios.delete(`${baseUrl}/api/users/${userId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('User deleted successfully');
      fetchData();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete user');
    }
  };

  const filteredInquiries = inquiries.filter(inv => 
    inv.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    inv.phone.includes(searchTerm) ||
    inv.selectedPlan.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.phone.includes(searchTerm)
  );

  const totalRevenue = orders.reduce((sum, order) => sum + (order.totalAmount || 0), 0);
  const activeServices = users.filter(user => user.serviceStatus && (!user.serviceExpiryDate || new Date(user.serviceExpiryDate) > new Date())).length;
  const newInquiriesCount = inquiries.filter(inq => inq.status === 'new').length;
  const recentOrders = [...orders].sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Tabs */}
      <div className="flex space-x-4 border-b border-gray-200">
        <button
          onClick={() => setActiveTab('analytics')}
          className={`py-3 px-4 font-bold flex items-center gap-2 border-b-2 transition-colors ${activeTab === 'analytics' ? 'border-[#059669] text-[#059669]' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
        >
          <Activity size={18} /> Analytics Board
        </button>
        <button
          onClick={() => setActiveTab('inquiries')}
          className={`py-3 px-4 font-bold flex items-center gap-2 border-b-2 transition-colors ${activeTab === 'inquiries' ? 'border-[#059669] text-[#059669]' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
        >
          <MessageSquare size={18} /> Inquiries
        </button>
        <button
          onClick={() => setActiveTab('users')}
          className={`py-3 px-4 font-bold flex items-center gap-2 border-b-2 transition-colors ${activeTab === 'users' ? 'border-[#059669] text-[#059669]' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
        >
          <Users size={18} /> Users & Purchases
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h2 className="text-lg font-bold text-gray-900">
            {activeTab === 'analytics' ? 'Real-Time Analytics' : activeTab === 'inquiries' ? 'Recent Inquiries' : 'Registered Users'}
          </h2>
          {activeTab !== 'analytics' && (
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <input 
                type="text" 
                placeholder="Search..." 
                className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm w-full sm:w-64 focus:outline-none focus:ring-2 focus:ring-[#059669]/50 focus:border-[#059669]"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          )}
        </div>

        {activeTab === 'analytics' ? (
          <div className="p-6 space-y-6 bg-gray-50/50">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4 hover:shadow-md transition-shadow">
                <div className="p-3 bg-emerald-100 text-emerald-600 rounded-xl"><DollarSign size={24} /></div>
                <div>
                  <p className="text-sm text-gray-500 font-medium">Total Revenue</p>
                  <p className="text-2xl font-black text-gray-900">₹{totalRevenue.toLocaleString()}</p>
                </div>
              </div>
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4 hover:shadow-md transition-shadow">
                <div className="p-3 bg-blue-100 text-blue-600 rounded-xl"><Users size={24} /></div>
                <div>
                  <p className="text-sm text-gray-500 font-medium">Total Users</p>
                  <p className="text-2xl font-black text-gray-900">{users.length}</p>
                </div>
              </div>
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4 hover:shadow-md transition-shadow">
                <div className="p-3 bg-purple-100 text-purple-600 rounded-xl"><TrendingUp size={24} /></div>
                <div>
                  <p className="text-sm text-gray-500 font-medium">Active Services</p>
                  <p className="text-2xl font-black text-gray-900">{activeServices}</p>
                </div>
              </div>
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4 hover:shadow-md transition-shadow">
                <div className="p-3 bg-amber-100 text-amber-600 rounded-xl"><MessageSquare size={24} /></div>
                <div>
                  <p className="text-sm text-gray-500 font-medium">New Inquiries</p>
                  <p className="text-2xl font-black text-gray-900">{newInquiriesCount}</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2"><ShoppingBag size={18} className="text-emerald-600" /> Recent Orders</h3>
                <div className="space-y-3">
                  {recentOrders.length === 0 ? (
                    <p className="text-gray-500 italic text-sm text-center py-4">No recent orders</p>
                  ) : (
                    recentOrders.map(order => (
                      <div key={order._id} className="flex justify-between items-center p-3 hover:bg-gray-50 rounded-xl transition-colors border border-gray-50">
                        <div>
                          <p className="font-bold text-sm text-gray-900">Order #{order._id.slice(-6).toUpperCase()}</p>
                          <p className="text-xs text-gray-500">{new Date(order.createdAt).toLocaleString()}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-black text-emerald-600">₹{order.totalAmount}</p>
                          <p className="text-[10px] font-bold text-gray-400 uppercase">{order.paymentStatus}</p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
              
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                 <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2"><Activity size={18} className="text-blue-600" /> System Status</h3>
                 <div className="flex flex-col gap-4">
                    <div className="flex justify-between items-center bg-gray-50 p-4 rounded-xl border border-gray-100">
                      <span className="text-sm font-medium text-gray-600">Real-time Connection</span>
                      <span className="flex items-center gap-1.5 text-xs font-bold text-emerald-600 bg-emerald-100 px-3 py-1.5 rounded-full shadow-sm">
                        <span className="relative flex h-2 w-2">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                        </span>
                        Live Sync Active
                      </span>
                    </div>
                    <div className="flex justify-between items-center bg-gray-50 p-4 rounded-xl border border-gray-100">
                      <span className="text-sm font-medium text-gray-600">Update Frequency</span>
                      <span className="text-xs font-bold text-gray-500 flex items-center gap-1">
                        <RefreshCw size={14} className="text-gray-400 animate-spin-slow" /> Every 15s
                      </span>
                    </div>
                    <div className="mt-4 p-4 bg-blue-50 text-blue-800 rounded-xl text-sm border border-blue-100">
                      <p className="font-medium mb-1">💡 Data is continuously synced</p>
                      <p className="text-blue-600 text-xs">The dashboard will automatically update to reflect new orders, users, and inquiries as they arrive.</p>
                    </div>
                 </div>
              </div>
            </div>
          </div>
        ) : activeTab === 'inquiries' ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider">
                  <th className="p-4 font-medium">Date</th>
                  <th className="p-4 font-medium">Customer</th>
                  <th className="p-4 font-medium">Plan/Interest</th>
                  <th className="p-4 font-medium">Message</th>
                  <th className="p-4 font-medium">Status</th>
                  <th className="p-4 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-sm">
                {loading ? (
                  <tr><td colSpan="6" className="p-8 text-center text-gray-500">Loading inquiries...</td></tr>
                ) : filteredInquiries.length === 0 ? (
                  <tr><td colSpan="6" className="p-8 text-center text-gray-500">No inquiries found.</td></tr>
                ) : (
                  filteredInquiries.map((inq) => (
                    <tr key={inq._id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="p-4 text-gray-500">{new Date(inq.createdAt).toLocaleDateString()}</td>
                      <td className="p-4">
                        <div className="font-medium text-gray-900">{inq.name}</div>
                        <div className="text-gray-500 text-xs">{inq.email || 'N/A'}</div>
                        <div className="text-gray-400 text-[10px]">{inq.phone}</div>
                        {inq.address && (
                          <div className="text-gray-500 text-[10px] mt-1">
                            {inq.address}, Block {inq.blockNumber}, Apt {inq.apartmentNumber}
                          </div>
                        )}
                      </td>
                      <td className="p-4">
                        <span className="px-2.5 py-1 bg-emerald-50 text-emerald-600 rounded-md text-xs font-medium">
                          {inq.selectedPlan}
                        </span>
                      </td>
                      <td className="p-4 text-gray-600 max-w-xs truncate">{inq.message}</td>
                      <td className="p-4">
                        {inq.status === 'new' ? (
                          <span className="px-2.5 py-1 bg-yellow-50 text-yellow-600 rounded-full text-xs font-medium flex items-center w-max gap-1">
                            New
                          </span>
                        ) : (
                          <span className="px-2.5 py-1 bg-green-50 text-green-600 rounded-full text-xs font-medium flex items-center w-max gap-1">
                            <CheckCircle size={12} /> Contacted
                          </span>
                        )}
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {inq.status === 'new' && (
                            <button 
                              onClick={() => handleMarkContacted(inq._id)}
                              className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                              title="Mark Contacted"
                            >
                              <CheckCircle size={18} />
                            </button>
                          )}
                          <button 
                            onClick={() => handleDelete(inq._id)}
                            className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                            title="Delete"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider">
                  <th className="p-4 font-medium">Joined Date</th>
                  <th className="p-4 font-medium">Name</th>
                  <th className="p-4 font-medium">Email</th>
                  <th className="p-4 font-medium">Phone</th>
                  <th className="p-4 font-medium text-right">Purchases</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-sm">
                {loading ? (
                  <tr><td colSpan="5" className="p-8 text-center text-gray-500">Loading users...</td></tr>
                ) : filteredUsers.length === 0 ? (
                  <tr><td colSpan="5" className="p-8 text-center text-gray-500">No users found.</td></tr>
                ) : (
                  filteredUsers.map((user) => {
                    const userOrders = orders.filter(o => o.user?._id === user._id || o.user === user._id);
                    const isExpanded = expandedUserId === user._id;
                    const isServiceActive = user.serviceStatus && (!user.serviceExpiryDate || new Date(user.serviceExpiryDate) > new Date());

                    return (
                      <React.Fragment key={user._id}>
                        <tr 
                          onClick={() => setExpandedUserId(isExpanded ? null : user._id)}
                          className="hover:bg-gray-50/50 transition-colors cursor-pointer"
                        >
                          <td className="p-4 text-gray-500">{new Date(user.createdAt || Date.now()).toLocaleDateString()}</td>
                          <td className="p-4 font-medium text-gray-900">
                            <div className="flex items-center gap-2">
                              {user.name}
                              {isServiceActive && <span className="text-[9px] bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full font-bold tracking-wider">ACTIVE</span>}
                            </div>
                          </td>
                          <td className="p-4 text-gray-500">{user.email}</td>
                          <td className="p-4 text-gray-500">{user.phone}</td>
                          <td className="p-4 text-right">
                            <div className="flex items-center justify-end gap-3">
                              <button 
                                onClick={(e) => { e.stopPropagation(); handleToggleUserService(user._id); }}
                                className={`px-3 py-1 rounded-full text-[10px] font-bold transition-colors ${isServiceActive ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                              >
                                {isServiceActive ? 'Service: ON' : 'Service: OFF'}
                              </button>
                              
                              <button 
                                onClick={(e) => { e.stopPropagation(); handleDeleteUser(user._id); }}
                                className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                title="Delete User"
                              >
                                <Trash2 size={16} />
                              </button>
                              <div className="inline-flex items-center gap-1 text-emerald-600 font-bold ml-2 border-l border-gray-200 pl-3">
                                <ShoppingBag size={16} />
                                {userOrders.length}
                                {isExpanded ? <ChevronUp size={16} className="text-gray-400" /> : <ChevronDown size={16} className="text-gray-400" />}
                              </div>
                            </div>
                          </td>
                        </tr>
                        {isExpanded && (
                          <tr className="bg-gray-50/50">
                            <td colSpan="5" className="p-0 border-t border-gray-100">
                              <div className="p-4 px-8 flex flex-col md:flex-row gap-6">
                                <div className="flex-1 bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                                  <h3 className="font-bold text-gray-800 text-sm mb-3 border-b pb-2">Customer Details</h3>
                                  <div className="space-y-2 text-sm">
                                    <p className="text-gray-500"><span className="font-medium text-gray-700">Name:</span> {user.name}</p>
                                    <p className="text-gray-500"><span className="font-medium text-gray-700">Email:</span> {user.email}</p>
                                    <p className="text-gray-500"><span className="font-medium text-gray-700">Phone:</span> {user.phone}</p>
                                    <p className="text-gray-500"><span className="font-medium text-gray-700">Status:</span> {user.isVerified ? 'Verified' : 'Unverified'}</p>
                                    <div className="mt-3">
                                      <p className="font-medium text-gray-700 mb-1">Addresses:</p>
                                      {user.addresses && user.addresses.length > 0 ? (
                                        <div className="space-y-2 max-h-32 overflow-y-auto">
                                          {user.addresses.map((addr, idx) => (
                                            <div key={idx} className="bg-gray-50 p-2 rounded text-xs border border-gray-100">
                                              <p className="font-medium text-gray-800">{addr.isDefault ? '📍 Default' : 'Location'}</p>
                                              <p className="text-gray-600">{addr.addressLine1}</p>
                                              <p className="text-gray-600">{addr.city} - {addr.pincode}</p>
                                              {addr.landmark && <p className="text-gray-500 text-[10px]">Landmark: {addr.landmark}</p>}
                                            </div>
                                          ))}
                                        </div>
                                      ) : (
                                        <p className="text-gray-400 italic text-xs">No addresses saved.</p>
                                      )}
                                    </div>
                                  </div>
                                </div>
                                <div className="flex-[2]">
                                  <h3 className="font-bold text-gray-800 text-sm mb-3">Purchase History</h3>
                                  {userOrders.length === 0 ? (
                                    <p className="text-sm text-gray-500 italic bg-white p-4 rounded-xl border border-gray-100">No purchases yet.</p>
                                  ) : (
                                    <div className="space-y-3 max-h-64 overflow-y-auto pr-2">
                                      {userOrders.map(order => (
                                        <div key={order._id} className="bg-white p-3 rounded-xl border border-gray-100 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                                          <div>
                                            <div className="font-bold text-gray-800 text-sm">Order #{order._id.slice(-6).toUpperCase()}</div>
                                            <div className="text-xs text-gray-500">{new Date(order.createdAt).toLocaleDateString()}</div>
                                            <div className="mt-1 flex flex-wrap gap-1">
                                              {order.items.map((it, idx) => (
                                                <span key={idx} className="bg-emerald-50 text-emerald-700 text-[10px] font-bold px-2 py-0.5 rounded-full">
                                                  {it.planName}
                                                </span>
                                              ))}
                                            </div>
                                          </div>
                                          <div className="flex flex-col items-end gap-2">
                                            <div className="flex flex-col items-end">
                                              <div className="font-black text-emerald-600">₹{order.totalAmount}</div>
                                              <div className="text-[10px] text-gray-500 uppercase font-bold">{order.paymentStatus}</div>
                                            </div>
                                            <button 
                                              onClick={(e) => { e.stopPropagation(); handleToggleService(order._id); }}
                                              className={`px-3 py-1 rounded-full text-[10px] font-bold transition-colors ${order.serviceEligible ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}
                                            >
                                              Service Eligible: {order.serviceEligible ? 'ON ✅' : 'OFF ❌'}
                                            </button>
                                          </div>
                                        </div>
                                      ))}
                                    </div>
                                  )}
                                </div>
                              </div>
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;

