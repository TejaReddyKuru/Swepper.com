import React, { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', href: '#home' },
    { name: 'Services', href: '#services' },
    { name: 'Plans', href: '#plans' },
    { name: 'Reviews', href: '#testimonials' },
    { name: 'FAQ', href: '#faq' },
    { name: 'Contact', href: '#contact' },
  ];

  const handleWhatsApp = () => {
    window.open('https://wa.me/918317546078?text=Hi%20SWEEPER.CO,%20I%20would%20like%20to%20know%20more%20about%20your%20services.', '_blank');
  };

  return (
    <nav className={`fixed w-full z-50 transition-all duration-300 ${isScrolled ? 'glass-nav py-4 shadow-sm' : 'bg-transparent py-6'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <a href="#home" className="text-2xl font-black text-[#059669] tracking-tight">
              SWEEPER<span className="text-slate-900">.CO</span>
            </a>
          </div>
          
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="text-slate-600 hover:text-[#059669] font-semibold transition-colors"
              >
                {link.name}
              </a>
            ))}
            <button
              onClick={handleWhatsApp}
              className="bg-[#059669] text-white px-6 py-2.5 rounded-xl font-bold hover:bg-[#047857] transition-all transform hover:-translate-y-0.5 shadow-[0_5px_15px_rgba(5,150,105,0.3)]"
            >
              Book Now
            </button>
          </div>

          <div className="md:hidden flex items-center">
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
              <a
                key={link.name}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className="block px-3 py-3 text-base font-semibold text-slate-700 hover:text-[#059669] hover:bg-emerald-50 rounded-xl transition-colors"
              >
                {link.name}
              </a>
            ))}
            <button
              onClick={handleWhatsApp}
              className="w-full mt-4 bg-[#059669] text-white px-6 py-3 rounded-xl font-bold hover:bg-[#047857] transition-colors shadow-md"
            >
              Book Now
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
