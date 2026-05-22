import React, { useState, useEffect } from 'react';
import { Menu, X, LogOut, User, Sparkles, ShoppingCart } from 'lucide-react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import CartDrawer from './CartDrawer';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [user, setUser] = useState(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  
  const location = useLocation();
  const navigate = useNavigate();

  const updateCartCount = () => {
    const items = JSON.parse(localStorage.getItem('cartItems')) || [];
    setCartCount(items.length);
  };

  useEffect(() => {
    updateCartCount();
    window.addEventListener('cartUpdated', updateCartCount);
    return () => window.removeEventListener('cartUpdated', updateCartCount);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Monitor route changes to keep the user authentication state in sync
  useEffect(() => {
    const info = localStorage.getItem('userInfo');
    if (info) {
      setUser(JSON.parse(info));
    } else {
      setUser(null);
    }
  }, [location]);

  const navLinks = [
    { name: 'Home', href: '#home', isHash: true },
    { name: 'Services', href: '#services', isHash: true },
    { name: 'Plans', href: '#plans', isHash: true },
    ...(user ? [{ name: 'Dashboard', href: '/dashboard', isHash: false }] : []),
    { name: 'Contact', href: '#contact', isHash: true },
  ];

  const handleWhatsApp = () => {
    window.open('https://wa.me/918317546078?text=Hi%20SWEEPER.CO,%20I%20would%20like%20to%20know%20more%20about%20your%20services.', '_blank');
  };

  const handleLogout = () => {
    localStorage.removeItem('userInfo');
    setUser(null);
    setIsOpen(false);
    toast.success('Logged out successfully');
    navigate('/login');
  };

  const getHref = (link) => {
    if (!link.isHash) return link.href;
    if (location.pathname === '/') return link.href;
    return `/${link.href}`;
  };

  return (
    <nav className={`fixed w-full z-50 transition-all duration-300 ${isScrolled ? 'glass-nav py-4 shadow-sm' : 'bg-transparent py-6'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="text-2xl font-black text-[#059669] tracking-tight">
              SWEEPER<span className="text-slate-900">.CO</span>
            </Link>
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              link.isHash ? (
                <a
                  key={link.name}
                  href={getHref(link)}
                  className="text-slate-600 hover:text-[#059669] font-semibold transition-colors"
                >
                  {link.name}
                </a>
              ) : (
                <Link
                  key={link.name}
                  to={link.href}
                  className="text-slate-600 hover:text-[#059669] font-semibold transition-colors"
                >
                  {link.name}
                </Link>
              )
            ))}

            {/* Authenticated user control */}
            <div className="flex items-center gap-4">
              <button 
                onClick={() => setIsCartOpen(true)}
                className="relative p-2 text-slate-600 hover:text-[#059669] transition-colors"
              >
                <ShoppingCart size={22} />
                {cartCount > 0 && (
                  <span className="absolute top-0 right-0 inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-bold leading-none text-white bg-rose-500 rounded-full">
                    {cartCount}
                  </span>
                )}
              </button>
            {user ? (
              <>
                <Link 
                  to="/dashboard" 
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-50 text-emerald-800 font-bold border border-emerald-100 hover:bg-emerald-100/50 transition-all text-sm"
                >
                  <Sparkles size={14} className="text-[#059669]" />
                  <span>Hi, {user.name.split(' ')[0]}</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="text-slate-500 hover:text-rose-600 transition-colors p-2"
                  title="Logout"
                >
                  <LogOut size={18} />
                </button>
              </>
            ) : (
              <>
                <Link 
                  to="/login" 
                  className="text-slate-700 hover:text-[#059669] font-bold text-sm transition-colors"
                >
                  Sign In
                </Link>
                <button
                  onClick={handleWhatsApp}
                  className="bg-[#059669] text-white px-6 py-2.5 rounded-xl font-bold hover:bg-[#047857] transition-all transform hover:-translate-y-0.5 shadow-[0_5px_15px_rgba(5,150,105,0.3)]"
                >
                  Book Now
                </button>
              </>
            )}
            </div>
          </div>

          {/* Mobile Menu & Cart Icons */}
          <div className="md:hidden flex items-center gap-4">
            <button 
              onClick={() => setIsCartOpen(true)}
              className="relative p-2 text-slate-600 hover:text-[#059669] transition-colors"
            >
              <ShoppingCart size={22} />
              {cartCount > 0 && (
                <span className="absolute top-0 right-0 inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-bold leading-none text-white bg-rose-500 rounded-full">
                  {cartCount}
                </span>
              )}
            </button>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-slate-600 hover:text-slate-900 focus:outline-none"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden bg-white absolute w-full top-full left-0 border-t border-slate-100 shadow-xl">
          <div className="px-4 pt-2 pb-6 space-y-2">
            {navLinks.map((link) => (
              link.isHash ? (
                <a
                  key={link.name}
                  href={getHref(link)}
                  onClick={() => setIsOpen(false)}
                  className="block px-3 py-3 text-base font-semibold text-slate-700 hover:text-[#059669] hover:bg-emerald-50 rounded-xl transition-colors"
                >
                  {link.name}
                </a>
              ) : (
                <Link
                  key={link.name}
                  to={link.href}
                  onClick={() => setIsOpen(false)}
                  className="block px-3 py-3 text-base font-semibold text-slate-700 hover:text-[#059669] hover:bg-emerald-50 rounded-xl transition-colors"
                >
                  {link.name}
                </Link>
              )
            ))}

            {/* Authenticated user mobile controls */}
            {user ? (
              <div className="pt-4 border-t border-slate-100 space-y-3">
                <Link
                  to="/dashboard"
                  onClick={() => setIsOpen(false)}
                  className="w-full flex items-center justify-center gap-2 bg-emerald-50 text-emerald-800 py-3 rounded-xl font-bold border border-emerald-100"
                >
                  <User size={16} />
                  <span>Go to Dashboard ({user.name.split(' ')[0]})</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full bg-rose-50 text-rose-600 py-3 rounded-xl font-bold border border-rose-100 flex items-center justify-center gap-2"
                >
                  <LogOut size={16} />
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              <div className="pt-4 border-t border-slate-100 space-y-3">
                <Link
                  to="/login"
                  onClick={() => setIsOpen(false)}
                  className="w-full flex items-center justify-center py-3 rounded-xl text-slate-700 font-bold border border-slate-200 hover:bg-slate-50 transition-colors"
                >
                  Sign In
                </Link>
                <button
                  onClick={handleWhatsApp}
                  className="w-full bg-[#059669] text-white px-6 py-3 rounded-xl font-bold hover:bg-[#047857] transition-colors shadow-md"
                >
                  Book Now
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Cart Drawer */}
      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </nav>
  );
};

export default Navbar;
