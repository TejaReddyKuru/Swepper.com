import React from 'react';
import { Mail, Phone, MapPin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-slate-900 text-slate-300 pt-20 pb-10 border-t border-slate-800 relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Brand */}
          <div className="space-y-4">
            <h3 className="text-3xl font-black text-[#059669] tracking-tight">
              SWEEPER<span className="text-white">.CO</span>
            </h3>
            <p className="text-slate-400 max-w-xs leading-relaxed">
              Professional home cleaning subscriptions. We bring trust, safety, and spotless cleanliness to your home.
            </p>
            <div className="flex space-x-4 pt-2">
              <a href="#" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-[#059669] hover:text-white transition-all">
                <span className="text-sm font-bold">FB</span>
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-[#059669] hover:text-white transition-all">
                <span className="text-sm font-bold">X</span>
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-[#059669] hover:text-white transition-all">
                <span className="text-sm font-bold">IG</span>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-bold text-white mb-6 uppercase tracking-wider text-sm">Company</h4>
            <ul className="space-y-3">
              {['Home', 'Services', 'Pricing Plans', 'Testimonials', 'Contact Us'].map((item) => (
                <li key={item}>
                  <a href={`#${item.split(' ')[0].toLowerCase()}`} className="text-slate-400 hover:text-[#059669] transition-colors font-medium">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-lg font-bold text-white mb-6 uppercase tracking-wider text-sm">Services</h4>
            <ul className="space-y-3">
              {['Daily Sweeping & Mopping', 'Deep Home Cleaning', 'Bathroom Cleaning', 'Kitchen Cleaning', 'Dish Washing'].map((item) => (
                <li key={item}>
                  <a href="#services" className="text-slate-400 hover:text-[#059669] transition-colors font-medium">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-lg font-bold text-white mb-6 uppercase tracking-wider text-sm">Contact Us</h4>
            <ul className="space-y-4">
              <li className="flex items-start space-x-3 text-slate-400">
                <MapPin size={20} className="text-[#059669] flex-shrink-0 mt-1" />
                <span className="font-medium">123 Clean Street, Sector 56, Bangalore 560001</span>
              </li>
              <li className="flex items-center space-x-3 text-slate-400">
                <Phone size={20} className="text-[#059669] flex-shrink-0" />
                <span className="font-medium">+91 8317546078</span>
              </li>
              <li className="flex items-center space-x-3 text-slate-400">
                <Mail size={20} className="text-[#059669] flex-shrink-0" />
                <span className="font-medium">hello@sweeper.co</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-slate-500 font-medium">
          <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4 text-center md:text-left">
            <p>&copy; {new Date().getFullYear()} SWEEPER.CO. All rights reserved.</p>
            <span className="hidden md:inline text-slate-700">|</span>
            <p>Made by <a href="https://vantixtech.vercel.app/" target="_blank" rel="noreferrer" className="text-[#059669] hover:text-[#047857] transition-colors font-bold">Vantix Technologies</a></p>
          </div>
          <div className="flex space-x-6 mt-6 md:mt-0">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
            <a href="/admin/login" className="hover:text-[#059669] transition-colors">Admin Login</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
