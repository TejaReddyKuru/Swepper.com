import React, { useEffect, useState } from 'react';
import { X, Trash2, ShoppingCart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';

const CartDrawer = ({ isOpen, onClose }) => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const loadCart = () => {
    const items = JSON.parse(localStorage.getItem('cartItems')) || [];
    setCartItems(items);
  };

  useEffect(() => {
    if (isOpen) {
      loadCart();
    }
    
    const handleCartUpdate = () => {
      loadCart();
    };
    
    window.addEventListener('cartUpdated', handleCartUpdate);
    return () => window.removeEventListener('cartUpdated', handleCartUpdate);
  }, [isOpen]);

  const handleRemove = (indexToRemove) => {
    const updatedCart = cartItems.filter((_, index) => index !== indexToRemove);
    setCartItems(updatedCart);
    localStorage.setItem('cartItems', JSON.stringify(updatedCart));
    window.dispatchEvent(new Event('cartUpdated'));
    toast.info('Item removed from cart');
  };

  const totalAmount = cartItems.reduce((acc, item) => acc + item.price, 0);

  const handleCheckout = async () => {
    const userInfoStr = localStorage.getItem('userInfo');
    if (!userInfoStr) {
      toast.warn('Please login to continue checkout');
      onClose();
      navigate('/login');
      return;
    }

    const userInfo = JSON.parse(userInfoStr);
    const token = userInfo.token;

    setLoading(true);

    let addressString = 'N/A';
    
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      // Fetch user profile to get address
      const { data: profile } = await axios.get('/api/users/profile', config);
      const addressObj = profile.addresses?.find(a => a.isDefault) || profile.addresses?.[0];
      if (addressObj && addressObj.addressLine1) {
        addressString = `${addressObj.addressLine1}, ${addressObj.city}`;
      }

      const orderData = {
        items: cartItems.map(item => ({
          planName: item.planName,
          price: item.price,
          detail: item.detail,
          quantity: 1,
          bhkType: item.detail || 'N/A'
        })),
        subtotal: totalAmount,
        tax: 0,
        totalAmount: totalAmount,
        address: addressObj || { addressLine1: 'N/A', city: 'N/A', pincode: 'N/A' }
      };

      // Create order in backend
      await axios.post('/api/orders', orderData, config);
    } catch (error) {
      console.error('Backend operation failed, proceeding to WhatsApp anyway:', error);
    }

    // Generate WhatsApp message (Guaranteed to run)
    const plansList = cartItems.map(item => `Plan: ${item.planName}\nType: ${item.detail || 'N/A'}`).join('\n\n');
    
    const message = `Hello SWEEPER.CO,\n\nI want to book the following service:\n\n${plansList}\nAmount: ₹${totalAmount}\n\nCustomer Details:\nName: ${userInfo.name}\nPhone: ${userInfo.phone}\nAddress: ${addressString}\n\nPlease share the payment QR code.`;
    
    // Clear cart
    localStorage.removeItem('cartItems');
    setCartItems([]);
    window.dispatchEvent(new Event('cartUpdated'));
    onClose();

    // Open WhatsApp
    window.open(`https://wa.me/918317546078?text=${encodeURIComponent(message)}`, '_blank');
    
    setLoading(false);
    navigate('/dashboard');
  };

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-[60] transition-opacity"
          onClick={onClose}
        ></div>
      )}

      {/* Drawer */}
      <div 
        className={`fixed top-0 right-0 h-full w-full sm:w-[400px] bg-white z-[70] shadow-2xl transform transition-transform duration-300 ease-in-out flex flex-col ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-100">
          <div className="flex items-center gap-3 text-slate-900">
            <ShoppingCart size={24} className="text-[#059669]" />
            <h2 className="text-xl font-extrabold">Your Cart</h2>
          </div>
          <button 
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-900 bg-slate-50 hover:bg-slate-100 rounded-full transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {cartItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center space-y-4 opacity-70">
              <ShoppingCart size={64} className="text-slate-300" />
              <p className="text-lg text-slate-500 font-medium">Your cart is empty.</p>
            </div>
          ) : (
            cartItems.map((item, index) => (
              <div key={index} className="flex items-start justify-between p-4 bg-slate-50 border border-slate-100 rounded-2xl group hover:border-emerald-200 transition-colors">
                <div>
                  <h4 className="font-bold text-slate-900">{item.planName}</h4>
                  {item.detail && <p className="text-sm text-slate-500 mt-1">{item.detail}</p>}
                  <p className="text-[#059669] font-black mt-2">₹{item.price}</p>
                </div>
                <button 
                  onClick={() => handleRemove(index)}
                  className="text-slate-400 hover:text-rose-500 p-2 opacity-0 group-hover:opacity-100 transition-all"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            ))
          )}
        </div>

        {/* Footer / Checkout */}
        {cartItems.length > 0 && (
          <div className="p-6 border-t border-slate-100 bg-slate-50">
            <div className="space-y-3 mb-6">
              <div className="flex justify-between text-slate-600">
                <span>Plan Price</span>
                <span className="font-semibold">₹{totalAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-lg font-black text-slate-900 pt-3 border-t border-slate-200">
                <span>Total Amount</span>
                <span className="text-[#059669]">₹{totalAmount.toFixed(2)}</span>
              </div>
            </div>
            
            <button 
              onClick={handleCheckout}
              disabled={loading}
              className="w-full py-4 bg-[#059669] text-white rounded-xl font-bold hover:bg-[#047857] transition-colors shadow-lg shadow-[#059669]/30 disabled:opacity-70 flex justify-center items-center gap-2"
            >
              {loading ? 'Processing...' : 'Checkout / Book Now'}
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default CartDrawer;
