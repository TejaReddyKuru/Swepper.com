import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, Star, Shield, Clock, ThumbsUp, Sparkles, MapPin, Phone, Mail, ChevronDown, CheckCircle, ShieldCheck, X, ShoppingCart } from 'lucide-react';
import { useForm, ValidationError } from '@formspree/react';
import axios from 'axios';
import { toast } from 'react-toastify';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const Typewriter = () => {
  const phrases = [
    { line1: "Ghar Saaf,", line2: "Dil Khush!" },
    { line1: "Clean Home,", line2: "Healthy Life!" }
  ];
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [currentLine1, setCurrentLine1] = useState('');
  const [currentLine2, setCurrentLine2] = useState('');

  useEffect(() => {
    const currentPhrase = phrases[phraseIndex];
    const fullText1 = currentPhrase.line1;
    const fullText2 = currentPhrase.line2;
    const fullText = fullText1 + fullText2;
    const currentFullText = currentLine1 + currentLine2;

    const timeout = setTimeout(() => {
      if (!isDeleting && currentFullText === fullText) {
        // Pause at the end before deleting
        setTimeout(() => setIsDeleting(true), 2000);
      } else if (isDeleting && currentFullText === '') {
        // Move to next phrase
        setIsDeleting(false);
        setPhraseIndex((prev) => (prev + 1) % phrases.length);
      } else {
        // Typing or deleting
        const nextCharIndex = isDeleting ? charIndex - 1 : charIndex + 1;
        setCharIndex(nextCharIndex);
        
        if (nextCharIndex <= fullText1.length) {
          setCurrentLine1(fullText1.substring(0, nextCharIndex));
          setCurrentLine2('');
        } else {
          setCurrentLine1(fullText1);
          setCurrentLine2(fullText2.substring(0, nextCharIndex - fullText1.length));
        }
      }
    }, isDeleting ? 50 : 100);

    return () => clearTimeout(timeout);
  }, [charIndex, isDeleting, phraseIndex, currentLine1, currentLine2, phrases]);

  return (
    <h1 className="text-5xl md:text-7xl font-extrabold text-slate-900 tracking-tight mb-6 leading-tight min-h-[140px] md:min-h-[180px]">
      {currentLine1} <br/>
      <span className="text-[#059669]">{currentLine2}</span>
      <span className="inline-block w-1 h-10 md:h-16 bg-[#059669] ml-2 animate-pulse align-middle"></span>
    </h1>
  );
};

const HomePage = () => {
  const containerRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.utils.toArray('.fade-up').forEach((elem) => {
        gsap.fromTo(elem, 
          { y: 50, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 1,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: elem,
              start: 'top 85%',
              toggleActions: 'play none none reverse'
            }
          }
        );
      });
    }, containerRef);
    
    return () => ctx.revert();
  }, []);

  const services = [
    { title: 'Daily Maid Service', desc: 'Reliable, everyday help for all your household chores.', icon: <ShieldCheck className="text-[#059669]" size={32} /> },
    { title: 'Floor Cleaning', desc: 'Daily sweeping and mopping for a dust-free home.', icon: <Sparkles className="text-[#059669]" size={32} /> },
    { title: 'Washroom Cleaning', desc: 'Hygienic deep cleaning of all bathroom fixtures.', icon: <CheckCircle className="text-[#059669]" size={32} /> },
    { title: 'Kitchen Cleaning', desc: 'Grease-free countertops and clean sinks.', icon: <CheckCircle className="text-[#059669]" size={32} /> },
    { title: 'Dish Washing', desc: 'Sparkling clean dishes every single day.', icon: <CheckCircle className="text-[#059669]" size={32} /> },
    { title: 'Deep Cleaning', desc: 'Intensive monthly cleaning for every corner.', icon: <Star className="text-[#059669]" size={32} /> },
    { title: 'Sofa Cleaning', desc: 'Professional vacuum and stain removal.', icon: <CheckCircle className="text-[#059669]" size={32} /> },
    { title: 'Move-in/Out Cleaning', desc: 'Complete sanitization before or after you move.', icon: <Clock className="text-[#059669]" size={32} /> },
  ];

  const basicPlanPrices = { '1 BHK': 2299, '2 BHK': 2899, '3 BHK': 3399 };
  const premiumPlanPrices = { '1 BHK': 2799, '2 BHK': 3499, '3 BHK': 4299 };

  const [basicBhk, setBasicBhk] = useState('1 BHK');
  const [premiumBhk, setPremiumBhk] = useState('1 BHK');

  const handleSubscribe = (planName, price, detail = '') => {
    const text = `Hi SWEEPER.CO,\nI want to book: ${planName}.\n\nPlan: ${planName}\nPrice: ₹${price}${detail ? `\nDetails: ${detail}` : ''}\n\nPlease contact me.`;
    const encodedText = encodeURIComponent(text);
    window.open(`https://wa.me/918317546078?text=${encodedText}`, '_blank');
  };

  const [showCustomerModal, setShowCustomerModal] = useState(false);
  const [cartPendingItem, setCartPendingItem] = useState(null);
  const [customerDetails, setCustomerDetails] = useState({ name: '', email: '', phone: '', address: '', blockNumber: '', apartmentNumber: '' });
  const [submittingCustomer, setSubmittingCustomer] = useState(false);

  const handleAddToCart = (planName, price, detail = '') => {
    setCartPendingItem({ planName, price, detail });
    setShowCustomerModal(true);
  };

  const confirmAddToCart = async (e) => {
    e.preventDefault();
    setSubmittingCustomer(true);
    try {
      const baseUrl = import.meta.env.VITE_API_URL || (import.meta.env.PROD ? '' : 'http://localhost:5000');
      await axios.post(`${baseUrl}/api/inquiries`, {
        name: customerDetails.name,
        email: customerDetails.email,
        phone: customerDetails.phone,
        address: customerDetails.address,
        blockNumber: customerDetails.blockNumber,
        apartmentNumber: customerDetails.apartmentNumber,
        message: `Customer added ${cartPendingItem.planName} to cart. Detail: ${cartPendingItem.detail}`,
        selectedPlan: cartPendingItem.planName
      });
    } catch (error) {
      console.error('Failed to register inquiry:', error);
    }
    
    const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
    cartItems.push(cartPendingItem);
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
    window.dispatchEvent(new Event('cartUpdated'));
    toast.success(`${cartPendingItem.planName} added to cart`);
    
    setSubmittingCustomer(false);
    setShowCustomerModal(false);
    setCartPendingItem(null);
    setCustomerDetails({ name: '', email: '', phone: '', address: '', blockNumber: '', apartmentNumber: '' });
  };

  const [formState, handleFormSubmit] = useForm('mgodplkj');

  return (
    <div ref={containerRef} className="bg-transparent pb-32">
      
      {/* Hero Section */}
      <section id="home" className="relative min-h-screen flex items-center pt-24 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full flex flex-col lg:flex-row items-center gap-12">
          
          {/* Left Side Text */}
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="w-full lg:w-[55%] text-left"
          >
            <div className="flex gap-4 mb-8">
              <span className="flex items-center gap-1.5 py-1.5 px-4 rounded-full bg-emerald-50 text-emerald-700 font-bold text-sm border border-emerald-100">
                <ShieldCheck size={16} /> 100% Background Verified
              </span>
              <span className="hidden md:flex items-center gap-1.5 py-1.5 px-4 rounded-full bg-blue-50 text-blue-700 font-bold text-sm border border-blue-100">
                <Star size={16} fill="currentColor" /> 4.9/5 Rating
              </span>
            </div>
            
            <Typewriter />

            <p className="text-xl text-slate-600 mb-10 max-w-lg leading-relaxed">
              Professional, reliable, and affordable home cleaning subscriptions. Book top-rated professionals for your daily cleaning needs.
            </p>
            <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-6">
              <button 
                onClick={() => handleSubscribe('General Inquiry', 'N/A')}
                className="w-full sm:w-auto px-8 py-4 bg-[#059669] text-white rounded-2xl font-extrabold text-lg hover:bg-[#047857] transition-all hover:shadow-[0_10px_25px_rgba(5,150,105,0.3)] hover:-translate-y-1 flex items-center justify-center gap-2"
              >
                Book on WhatsApp
              </button>
              <a href="#plans" className="w-full sm:w-auto px-8 py-4 bg-white border border-slate-200 text-slate-700 rounded-2xl font-bold text-lg hover:bg-slate-50 transition-all hover:shadow-lg hover:-translate-y-1 text-center">
                View Plans
              </a>
            </div>
          </motion.div>

          {/* Right Side Maid Image */}
          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
            className="w-full lg:w-[45%] hidden md:block"
          >
            <div className="relative w-full aspect-[4/5] max-h-[700px] rounded-[2.5rem] overflow-hidden shadow-[0_20px_50px_rgba(5,150,105,0.2)] border-8 border-white transition-transform duration-500 hover:scale-[1.02]">
              <img 
                src="/hero-maid.jpeg" 
                alt="Professional Maid Cleaning" 
                className="w-full h-full object-cover object-[80%_center]"
              />
              {/* Green Overlay Gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#059669]/60 via-transparent to-transparent"></div>
              
              {/* Floating Trust Card */}
              <div className="absolute bottom-6 left-6 right-6 bg-white/95 backdrop-blur-md p-4 rounded-2xl flex items-center gap-4 shadow-2xl">
                <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center text-[#059669] flex-shrink-0">
                  <Sparkles size={24} />
                </div>
                <div>
                  <p className="font-bold text-slate-900 text-lg leading-tight">Spotless Results</p>
                  <p className="text-sm text-slate-500 font-medium">Trusted by 5,000+ families</p>
                </div>
              </div>
            </div>
          </motion.div>

        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-24 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16 fade-up">
            <h2 className="text-sm font-bold text-[#059669] tracking-widest uppercase mb-2">Our Services</h2>
            <h3 className="text-4xl font-extrabold text-slate-900 mb-6">Expert Cleaning Solutions</h3>
            <p className="text-lg text-slate-600">Everything you need for a spotless home, delivered by trained professionals.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service, index) => (
              <motion.div 
                key={index} 
                initial={{ opacity: 0, y: 40, scale: 0.95 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.6, delay: index * 0.1, ease: "easeOut" }}
                whileHover={{ y: -8, scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleSubscribe(service.title, 'N/A')}
                className="trust-card p-8 cursor-pointer shadow-sm hover:shadow-[0_20px_40px_rgba(5,150,105,0.12)] border border-slate-100 transition-all duration-300 relative overflow-hidden group bg-white"
              >
                {/* Background glow effect on hover */}
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-50/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                
                <div className="relative z-10">
                  <div className="w-14 h-14 bg-emerald-50 rounded-2xl flex items-center justify-center mb-6 text-[#059669] group-hover:scale-110 group-hover:bg-[#059669] group-hover:text-white transition-all duration-500 shadow-sm group-hover:shadow-md">
                    {service.icon}
                  </div>
                  <h4 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-[#059669] transition-colors duration-300">{service.title}</h4>
                  <p className="text-slate-600 leading-relaxed text-sm">{service.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Plans Section */}
      <section id="plans" className="py-24 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16 fade-up">
            <h2 className="text-sm font-bold text-[#059669] tracking-widest uppercase mb-2">Pricing Plans</h2>
            <h3 className="text-4xl font-extrabold text-slate-900 mb-6">Simple, Transparent Pricing</h3>
            <p className="text-lg text-slate-600">Choose the perfect subscription for your home size. No hidden fees.</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* BASIC PLAN */}
            <div className="fade-up trust-card overflow-hidden flex flex-col group border-t-4 border-t-slate-300">
              <div className="bg-slate-50 p-8 text-center border-b border-slate-100 relative">
                <h4 className="text-2xl font-extrabold text-slate-900 uppercase tracking-wide">Basic Plan</h4>
                <div className="mt-4 flex items-baseline justify-center gap-1">
                  <span className="text-lg font-medium text-slate-500">Starting from</span>
                  <span className="text-5xl font-black text-[#059669]">₹{basicPlanPrices['1 BHK']}</span>
                </div>

                <div className="mt-6 flex justify-center gap-2">
                  {['1 BHK', '2 BHK', '3 BHK'].map((bhk) => (
                    <button
                      key={bhk}
                      onClick={() => setBasicBhk(bhk)}
                      className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${
                        basicBhk === bhk ? 'bg-[#059669] text-white shadow-md' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      {bhk}
                      <div className={`text-xs font-normal mt-0.5 ${basicBhk === bhk ? 'text-emerald-100' : 'text-slate-500'}`}>₹{basicPlanPrices[bhk]}</div>
                    </button>
                  ))}
                </div>
              </div>
              
              <div className="p-8 flex-grow">
                <h5 className="font-bold text-xs text-slate-700 bg-slate-100 inline-block px-3 py-1.5 rounded-lg mb-6 uppercase tracking-wider">Plan Includes</h5>
                <ul className="space-y-4 mb-8">
                  {[
                    'Floor cleaning and mopping',
                    'Dishes washing',
                    'Monthly two leaves for maid',
                    'Monthly once full house cleaning',
                    'Own liquids for cleaning',
                    'Sweeping/mopping selected rooms',
                    'Sweeping/mopping kitchen & dining',
                    'Dust removal after sweeping',
                    'Washing & removing utensils in morning',
                    'Cleaning dishwashing area'
                  ].map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-3 text-sm">
                      <CheckCircle2 className="text-[#059669] shrink-0 mt-0.5" size={18} />
                      <span className="text-slate-700">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="p-8 pt-0 mt-auto flex flex-col gap-3">
                <button
                  onClick={() => handleAddToCart('Basic Plan', basicPlanPrices[basicBhk], basicBhk)}
                  className="w-full py-4 bg-slate-900 text-white rounded-2xl font-bold transition-all hover:bg-slate-800 shadow-md flex items-center justify-center gap-2"
                >
                  <ShoppingCart size={18} /> Add {basicBhk} Basic to Cart
                </button>
                <button
                  onClick={() => handleSubscribe('Basic Plan', basicPlanPrices[basicBhk], basicBhk)}
                  className="w-full py-2 bg-transparent text-slate-600 rounded-xl font-bold transition-all hover:bg-slate-100 flex items-center justify-center gap-2 text-sm"
                >
                  Book via WhatsApp
                </button>
              </div>
            </div>

            {/* PREMIUM PLAN */}
            <div className="fade-up trust-card overflow-hidden flex flex-col relative transform lg:-translate-y-4 z-10 border-t-4 border-t-[#059669] shadow-[0_20px_40px_rgba(5,150,105,0.15)]">
              <div className="absolute top-0 right-0 bg-yellow-400 text-yellow-900 text-xs font-bold px-4 py-1.5 rounded-bl-xl uppercase tracking-wider shadow-sm">
                Most Popular
              </div>
              <div className="p-8 text-center border-b border-slate-100 relative bg-emerald-50/50">
                <h4 className="text-2xl font-extrabold text-slate-900 uppercase tracking-wide">Premium Plan</h4>
                <div className="mt-4 flex items-baseline justify-center gap-1">
                  <span className="text-lg font-medium text-slate-500">Starting from</span>
                  <span className="text-5xl font-black text-[#059669]">₹{premiumPlanPrices['1 BHK']}</span>
                </div>

                <div className="mt-6 flex justify-center gap-2">
                  {['1 BHK', '2 BHK', '3 BHK'].map((bhk) => (
                    <button
                      key={bhk}
                      onClick={() => setPremiumBhk(bhk)}
                      className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${
                        premiumBhk === bhk ? 'bg-[#059669] text-white shadow-md' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      {bhk}
                      <div className={`text-xs font-normal mt-0.5 ${premiumBhk === bhk ? 'text-emerald-100' : 'text-slate-500'}`}>₹{premiumPlanPrices[bhk]}</div>
                    </button>
                  ))}
                </div>
              </div>
              
              <div className="p-8 flex-grow">
                <h5 className="font-bold text-xs text-emerald-800 bg-emerald-100 inline-block px-3 py-1.5 rounded-lg mb-6 uppercase tracking-wider">Same as Basic Plus:</h5>
                <ul className="space-y-4 mb-8">
                  {[
                    'No holiday for maid',
                    'Monthly twice washroom cleaning',
                    'Monthly twice full house cleaning',
                    'Own liquids for cleaning'
                  ].map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-3 text-sm font-medium">
                      <Sparkles className="text-[#059669] shrink-0 mt-0.5" size={18} />
                      <span className="text-slate-800">{feature}</span>
                    </li>
                  ))}
                </ul>

                <h5 className="font-bold text-[10px] bg-red-50 text-red-600 inline-block px-2 py-1 rounded-md mb-4 uppercase tracking-wider">Does not include:</h5>
                <ul className="space-y-2">
                  {[
                    'Deep stain removal / hard scrubbing',
                    'Inside cupboards & storage units',
                    'Heavy appliances (fridge, oven, etc.)',
                    'Laundry, cooking, or babysitting'
                  ].map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-xs">
                      <X className="text-red-400 shrink-0 mt-0.5" size={14} />
                      <span className="text-slate-500">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="p-8 pt-0 mt-auto flex flex-col gap-3">
                <button
                  onClick={() => handleAddToCart('Premium Plan', premiumPlanPrices[premiumBhk], premiumBhk)}
                  className="w-full py-4 bg-[#059669] text-white rounded-2xl font-extrabold transition-all hover:bg-[#047857] shadow-lg shadow-[#059669]/30 flex items-center justify-center gap-2"
                >
                  <ShoppingCart size={18} /> Add {premiumBhk} Premium to Cart
                </button>
                <button
                  onClick={() => handleSubscribe('Premium Plan', premiumPlanPrices[premiumBhk], premiumBhk)}
                  className="w-full py-2 bg-transparent text-[#059669] rounded-xl font-bold transition-all hover:bg-emerald-50 flex items-center justify-center gap-2 text-sm"
                >
                  Book via WhatsApp
                </button>
              </div>
            </div>

            {/* CUSTOMISED PLAN */}
            <div className="fade-up trust-card overflow-hidden flex flex-col border-t-4 border-t-blue-400">
              <div className="bg-slate-50 p-8 text-center border-b border-slate-100">
                <h4 className="text-2xl font-extrabold text-slate-900 uppercase tracking-wide">Customised</h4>
                <p className="mt-4 text-slate-500 text-sm">Pick and choose individual services.</p>
              </div>
              
              <div className="p-6 flex-grow flex flex-col gap-4">
                <div className="p-4 border border-slate-200 bg-white rounded-2xl hover:border-[#059669] hover:shadow-md transition-all group cursor-pointer" onClick={() => handleAddToCart('Washroom Cleaning', 459, 'Per Washroom')}>
                  <div className="flex justify-between items-center mb-1">
                    <h5 className="font-bold text-slate-800 group-hover:text-[#059669] transition-colors">Washroom Cleaning</h5>
                    <span className="font-black text-slate-900">₹459/-</span>
                  </div>
                  <p className="text-xs text-slate-500">Per washroom</p>
                </div>

                <div className="p-4 border border-slate-200 bg-white rounded-2xl">
                  <h5 className="font-bold text-slate-800 mb-3">Only Cleaning & Mopping</h5>
                  <div className="space-y-2">
                    {[
                      { bhk: '1 BHK', p: 999 },
                      { bhk: '2 BHK', p: 1499 },
                      { bhk: '3 BHK', p: 1799 }
                    ].map((item) => (
                      <div key={item.bhk} className="flex justify-between items-center text-sm cursor-pointer hover:text-[#059669] hover:bg-emerald-50 p-2 rounded-lg transition-colors" onClick={() => handleAddToCart('Only Cleaning & Mopping', item.p, item.bhk)}>
                        <span className="text-slate-600 font-medium">{item.bhk}</span>
                        <span className="font-bold text-slate-900">₹{item.p}/-</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="p-4 border border-slate-200 bg-white rounded-2xl hover:border-[#059669] hover:shadow-md transition-all group cursor-pointer" onClick={() => handleAddToCart('Only Dishes', 1099)}>
                  <div className="flex justify-between items-center">
                    <h5 className="font-bold text-slate-800 group-hover:text-[#059669] transition-colors">Only Dishes</h5>
                    <span className="font-black text-slate-900">₹1099/-</span>
                  </div>
                </div>

                <div className="p-4 border border-slate-200 bg-white rounded-2xl hover:border-[#059669] hover:shadow-md transition-all group cursor-pointer" onClick={() => handleAddToCart('Deep Cleaning Full House', 2499, 'Single Time')}>
                  <div className="flex justify-between items-center mb-1">
                    <h5 className="font-bold text-slate-800 group-hover:text-[#059669] transition-colors">Deep Cleaning</h5>
                    <span className="font-black text-slate-900">₹2499/-</span>
                  </div>
                  <p className="text-xs text-slate-500">Full House (Single Time)</p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-24 relative z-10 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="fade-up relative">
              <div className="aspect-[4/3] rounded-[2rem] overflow-hidden shadow-2xl">
                <img src="https://images.unsplash.com/photo-1581578731548-c64695cc6952?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80" alt="Professional Cleaner" className="w-full h-full object-cover" />
              </div>
              <div className="absolute -bottom-6 -right-6 bg-white p-6 rounded-3xl shadow-xl flex items-center gap-4">
                <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center text-[#059669]">
                  <ShieldCheck size={32} />
                </div>
                <div>
                  <p className="text-2xl font-extrabold text-slate-900">100%</p>
                  <p className="text-slate-500 font-medium">Safe & Reliable</p>
                </div>
              </div>
            </div>
            
            <div className="fade-up">
              <h2 className="text-sm font-bold text-[#059669] tracking-widest uppercase mb-2">Why Choose Us</h2>
              <h3 className="text-4xl font-extrabold text-slate-900 mb-6">Trusted by thousands of homes</h3>
              <p className="text-lg text-slate-600 mb-10">
                We take the hassle out of finding reliable household help. Our professionals are thoroughly vetted, trained, and committed to excellence.
              </p>
              
              <div className="space-y-6">
                {[
                  { icon: <Shield size={24} />, title: 'Background Verified Maids', desc: 'Every professional undergoes a strict background check.' },
                  { icon: <Clock size={24} />, title: 'Punctual & Reliable', desc: 'We value your time. Our maids arrive on schedule.' },
                  { icon: <ThumbsUp size={24} />, title: 'Satisfaction Guaranteed', desc: 'Not happy with the clean? We will fix it.' },
                ].map((item, idx) => (
                  <div key={idx} className="flex gap-4 p-4 rounded-2xl hover:bg-slate-50 transition-colors">
                    <div className="flex-shrink-0 w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center text-[#059669]">
                      {item.icon}
                    </div>
                    <div>
                      <h4 className="text-xl font-bold text-slate-900 mb-1">{item.title}</h4>
                      <p className="text-slate-600 text-sm leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-24 relative z-10 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16 fade-up">
            <h2 className="text-sm font-bold text-[#059669] tracking-widest uppercase mb-2">Customer Reviews</h2>
            <h3 className="text-4xl font-extrabold text-slate-900 mb-6">What our customers say</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { name: 'Rahul Mehta', role: 'Office Manager', text: 'Excellent service by Sweeper! Their team cleaned our office perfectly and completed everything on time. Very professional and affordable.' },
              { name: 'Priya Sharma', role: 'Homeowner', text: 'I booked a deep cleaning service for my home and the results were amazing. The staff was friendly, polite, and very hardworking.' },
              { name: 'Aman Verma', role: 'Working Professional', text: 'Highly recommended! The booking process was simple and the cleaning quality exceeded my expectations.' },
              { name: 'Sneha Kapoor', role: 'Apartment Resident', text: 'Sweeper provided fast and reliable service. My apartment looks fresh and spotless now. Will definitely use their services again.' },
              { name: 'Karan Malhotra', role: 'Homeowner', text: 'Very satisfied with the professionalism and attention to detail. One of the best cleaning service platforms I have used.' },
              { name: 'Neha Reddy', role: 'Homeowner', text: 'The team arrived on time and did an excellent job with sofa and carpet cleaning. Great experience overall.' },
              { name: 'Arjun Patel', role: 'Working Professional', text: 'Affordable pricing with premium-quality service. Their staff handled everything carefully and efficiently.' },
              { name: 'Pooja Singh', role: 'Homeowner', text: 'Customer support was very responsive and helpful. The cleaning service was top-notch and worth every rupee.' },
              { name: 'Vikram Joshi', role: 'Homeowner', text: 'Sweeper made my home look brand new. The workers were skilled, professional, and completed the work quickly.' },
              { name: 'Anjali Desai', role: 'Working Professional', text: 'Amazing experience! I loved the quality of work and the easy online booking system. Highly trustworthy service.' }
            ].map((test, idx) => (
              <div key={idx} className="fade-up trust-card p-8">
                <div className="flex text-yellow-400 mb-6">
                  {[1,2,3,4,5].map(i => <Star key={i} size={16} fill="currentColor" />)}
                </div>
                <p className="text-slate-700 mb-8 leading-relaxed">"{test.text}"</p>
                <div className="flex items-center gap-4">
                  <div>
                    <h4 className="font-bold text-slate-900">{test.name}</h4>
                    <p className="text-xs text-slate-500 uppercase tracking-wider">{test.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-24 relative z-10 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 fade-up">
          <div className="text-center mb-12">
            <h2 className="text-sm font-bold text-[#059669] tracking-widest uppercase mb-2">FAQ</h2>
            <h3 className="text-4xl font-extrabold text-slate-900 mb-6">Frequently Asked Questions</h3>
          </div>
          <div className="space-y-4">
            {[
              { q: 'How does the subscription work?', a: 'You choose a plan, pay for the month, and our verified cleaner comes to your home every day (or based on the chosen frequency) to perform the selected services.' },
              { q: 'How do payments work?', a: 'Currently, we handle payments manually after you confirm your booking via WhatsApp. We accept UPI, Bank Transfer, and Credit/Debit cards via payment links.' },
              { q: 'Are your cleaners verified?', a: 'Yes, 100%. We conduct strict background checks, ID verification, and professional training for all our staff.' },
              { q: 'Can I cancel anytime?', a: 'Absolutely. There are no lock-in contracts. You can pause or cancel your subscription at the end of any billing cycle.' },
              { q: 'Do you provide deep cleaning?', a: 'Yes, deep cleaning is included in our Premium Plan, or you can request it as a standalone one-time service via WhatsApp.' },
            ].map((faq, idx) => (
              <details key={idx} className="group trust-card p-6 transition-all duration-300 cursor-pointer">
                <summary className="flex justify-between items-center font-bold text-lg text-slate-900 list-none">
                  {faq.q}
                  <span className="transition group-open:rotate-180 text-slate-400 bg-slate-50 p-2 rounded-full">
                    <ChevronDown size={20} />
                  </span>
                </summary>
                <p className="text-slate-600 mt-4 leading-relaxed pl-4 border-l-2 border-[#059669] text-sm">{faq.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-24 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 fade-up">
          <div className="bg-white rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-slate-100 overflow-hidden flex flex-col lg:flex-row">
            <div className="w-full lg:w-5/12 bg-slate-900 p-10 lg:p-16 text-white flex flex-col justify-between relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-[#059669] opacity-20 blur-[80px] rounded-full"></div>
              
              <div className="relative z-10">
                <h3 className="text-3xl font-extrabold mb-4">Get in touch</h3>
                <p className="text-slate-400 mb-12">Have a question or need a custom cleaning plan? We are here to help.</p>
                
                <div className="space-y-8">
                  <div className="flex items-center gap-6 group">
                    <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center">
                      <Phone className="text-[#059669]" />
                    </div>
                    <div>
                      <p className="text-xs text-slate-400 uppercase tracking-widest mb-1">Call Us</p>
                      <p className="font-bold text-lg">+91 8317546078</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-6 group">
                    <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center">
                      <Mail className="text-[#059669]" />
                    </div>
                    <div>
                      <p className="text-xs text-slate-400 uppercase tracking-widest mb-1">Email Us</p>
                      <p className="font-bold text-lg">Sweeper.admin@gmail.com</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-6 group">
                    <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center">
                      <MapPin className="text-[#059669]" />
                    </div>
                    <div>
                      <p className="text-xs text-slate-400 uppercase tracking-widest mb-1">Visit Us</p>
                      <p className="font-bold text-lg">Tech City, Bangalore</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="w-full lg:w-7/12 p-10 lg:p-16 bg-white">
              {formState.succeeded ? (
                <div className="flex flex-col items-center justify-center h-full space-y-4 py-12 text-center fade-up">
                  <div className="w-20 h-20 bg-emerald-100 text-[#059669] rounded-full flex items-center justify-center mb-4 shadow-lg shadow-emerald-100">
                    <CheckCircle2 size={40} />
                  </div>
                  <h3 className="text-3xl font-extrabold text-slate-900">Message Sent!</h3>
                  <p className="text-lg text-slate-600">Thanks for reaching out. We will get back to you shortly.</p>
                </div>
              ) : (
                <>
                  <h3 className="text-2xl font-extrabold text-slate-900 mb-8">Send us a message</h3>
                  <form onSubmit={handleFormSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">Your Name</label>
                        <input required id="name" name="name" type="text" className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:ring-2 focus:ring-[#059669] focus:border-transparent outline-none transition-all placeholder-slate-400" placeholder="John Doe" />
                        <ValidationError prefix="Name" field="name" errors={formState.errors} className="text-red-500 text-sm mt-1" />
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">Email Address</label>
                        <input required id="email" name="email" type="email" className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:ring-2 focus:ring-[#059669] focus:border-transparent outline-none transition-all placeholder-slate-400" placeholder="john@example.com" />
                        <ValidationError prefix="Email" field="email" errors={formState.errors} className="text-red-500 text-sm mt-1" />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">Phone Number</label>
                        <input required id="phone" name="phone" type="tel" className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:ring-2 focus:ring-[#059669] focus:border-transparent outline-none transition-all placeholder-slate-400" placeholder="+91 9876543210" />
                        <ValidationError prefix="Phone" field="phone" errors={formState.errors} className="text-red-500 text-sm mt-1" />
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">Service Needed</label>
                        <select id="selectedPlan" name="selectedPlan" className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:ring-2 focus:ring-[#059669] focus:border-transparent outline-none transition-all appearance-none cursor-pointer">
                          <option value="Basic Plan">Basic Plan</option>
                          <option value="Premium Plan">Premium Plan</option>
                          <option value="Customised Plan">Customised Plan</option>
                          <option value="Other">Other Inquiry</option>
                        </select>
                        <ValidationError prefix="Service" field="selectedPlan" errors={formState.errors} className="text-red-500 text-sm mt-1" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-2">Message</label>
                      <textarea required id="message" name="message" rows="4" className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:ring-2 focus:ring-[#059669] focus:border-transparent outline-none transition-all placeholder-slate-400 resize-none" placeholder="How can we help you?"></textarea>
                      <ValidationError prefix="Message" field="message" errors={formState.errors} className="text-red-500 text-sm mt-1" />
                    </div>
                    <button type="submit" disabled={formState.submitting} className="w-full py-4 bg-[#059669] hover:bg-[#047857] text-white rounded-xl font-bold transition-all shadow-lg shadow-[#059669]/30 text-lg disabled:opacity-70 disabled:cursor-not-allowed">
                      {formState.submitting ? 'Sending...' : 'Send Message'}
                    </button>
                  </form>
                </>
              )}
            </div>
          </div>
        </div>
      </section>
      
      {/* Floating WhatsApp Button */}
      <a 
        href="https://wa.me/918317546078?text=Hi%20SWEEPER.CO!"
        target="_blank"
        rel="noreferrer"
        className="fixed bottom-6 right-6 w-16 h-16 bg-[#25D366] text-white rounded-full flex items-center justify-center shadow-[0_10px_20px_rgba(37,211,102,0.4)] hover:scale-110 hover:-translate-y-1 transition-all z-50 animate-bounce"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" viewBox="0 0 16 16">
          <path d="M13.601 2.326A7.854 7.854 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.933 7.933 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.898 7.898 0 0 0 13.6 2.326zM7.994 14.521a6.573 6.573 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.557 6.557 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592zm3.615-4.934c-.197-.099-1.17-.578-1.353-.646-.182-.065-.315-.099-.445.099-.133.197-.513.646-.627.775-.114.133-.232.148-.43.05-.197-.1-.836-.308-1.592-.985-.59-.525-.985-1.175-1.103-1.372-.114-.198-.011-.304.088-.403.087-.088.197-.232.296-.346.1-.114.133-.198.198-.33.065-.134.034-.248-.015-.347-.05-.099-.445-1.076-.612-1.47-.16-.389-.323-.335-.445-.34-.114-.007-.247-.007-.38-.007a.729.729 0 0 0-.529.247c-.182.198-.691.677-.691 1.654 0 .977.71 1.916.81 2.049.098.133 1.394 2.132 3.383 2.992.47.205.84.326 1.129.418.475.152.904.129 1.246.08.38-.058 1.171-.48 1.338-.943.164-.464.164-.86.114-.943-.049-.084-.182-.133-.38-.232z"/>
        </svg>
      </a>

      {/* Customer Details Modal */}
      {showCustomerModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-[2rem] p-8 max-w-md w-full shadow-2xl relative"
          >
            <button 
              onClick={() => setShowCustomerModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-full p-2 transition-colors"
            >
              <X size={20} />
            </button>
            <h3 className="text-2xl font-extrabold text-slate-900 mb-2">Almost there!</h3>
            <p className="text-slate-600 mb-6 text-sm">Please provide your details before adding <span className="font-bold text-[#059669]">{cartPendingItem?.planName}</span> to your cart.</p>
            
            <form onSubmit={confirmAddToCart} className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Name</label>
                <input 
                  required 
                  type="text" 
                  value={customerDetails.name}
                  onChange={(e) => setCustomerDetails({...customerDetails, name: e.target.value})}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:ring-2 focus:ring-[#059669] outline-none transition-all placeholder-slate-400"
                  placeholder="Your Name" 
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Email</label>
                <input 
                  required 
                  type="email" 
                  value={customerDetails.email}
                  onChange={(e) => setCustomerDetails({...customerDetails, email: e.target.value})}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:ring-2 focus:ring-[#059669] outline-none transition-all placeholder-slate-400"
                  placeholder="Your Email" 
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Phone</label>
                <input 
                  required 
                  type="tel" 
                  value={customerDetails.phone}
                  onChange={(e) => setCustomerDetails({...customerDetails, phone: e.target.value})}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:ring-2 focus:ring-[#059669] outline-none transition-all placeholder-slate-400"
                  placeholder="Your Phone Number" 
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Address</label>
                <input 
                  required 
                  type="text" 
                  value={customerDetails.address}
                  onChange={(e) => setCustomerDetails({...customerDetails, address: e.target.value})}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:ring-2 focus:ring-[#059669] outline-none transition-all placeholder-slate-400"
                  placeholder="Street Address or Area" 
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">Block Number</label>
                  <input 
                    required 
                    type="text" 
                    value={customerDetails.blockNumber}
                    onChange={(e) => setCustomerDetails({...customerDetails, blockNumber: e.target.value})}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:ring-2 focus:ring-[#059669] outline-none transition-all placeholder-slate-400"
                    placeholder="Block No." 
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">Apartment Number</label>
                  <input 
                    required 
                    type="text" 
                    value={customerDetails.apartmentNumber}
                    onChange={(e) => setCustomerDetails({...customerDetails, apartmentNumber: e.target.value})}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:ring-2 focus:ring-[#059669] outline-none transition-all placeholder-slate-400"
                    placeholder="Apt No." 
                  />
                </div>
              </div>
              <button 
                type="submit" 
                disabled={submittingCustomer}
                className="w-full py-4 mt-2 bg-[#059669] hover:bg-[#047857] text-white rounded-xl font-bold transition-all shadow-lg shadow-[#059669]/30 disabled:opacity-70 flex items-center justify-center gap-2"
              >
                {submittingCustomer ? 'Processing...' : 'Continue to Cart'}
              </button>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default HomePage;
