import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Trash2, CheckCircle, Search } from 'lucide-react';
import { toast } from 'react-toastify';

const AdminDashboard = () => {
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchInquiries = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const res = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/inquiries`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setInquiries(res.data);
      setLoading(false);
    } catch (error) {
      toast.error('Failed to fetch inquiries');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInquiries();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this inquiry?')) return;
    try {
      const token = localStorage.getItem('adminToken');
      await axios.delete(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/inquiries/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Inquiry deleted');
      fetchInquiries();
    } catch (error) {
      toast.error('Failed to delete');
    }
  };

  const handleMarkContacted = async (id) => {
    try {
      const token = localStorage.getItem('adminToken');
      await axios.put(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/inquiries/${id}`, { status: 'contacted' }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Marked as contacted');
      fetchInquiries();
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  const filteredInquiries = inquiries.filter(inv => 
    inv.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    inv.phone.includes(searchTerm) ||
    inv.selectedPlan.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="p-6 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h2 className="text-lg font-bold text-gray-900">Recent Inquiries</h2>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <input 
            type="text" 
            placeholder="Search inquiries..." 
            className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm w-full sm:w-64 focus:outline-none focus:ring-2 focus:ring-[#059669]/50 focus:border-[#059669]"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

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
    </div>
  );
};

export default AdminDashboard;
