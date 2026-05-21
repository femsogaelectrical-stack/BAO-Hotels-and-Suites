import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Phone, 
  MapPin, 
  Share2, 
  Heart, 
  Star, 
  Wifi, 
  Zap, 
  ShieldCheck, 
  Coffee, 
  Calendar, 
  ChevronRight, 
  Compass, 
  Users, 
  AlertCircle, 
  Copy, 
  Check, 
  Clock, 
  Award,
  ChevronLeft,
  X,
  Sparkles,
  ExternalLink
} from 'lucide-react';

import { Room, Review, GalleryItem, Booking } from './types';
import { ROOMS, PRELOADED_REVIEWS, GALLERY_ITEMS, HOTEL_DETAILS } from './data';

import RoomCard from './components/RoomCard';
import BookingForm from './components/BookingForm';
import ReviewsSection from './components/ReviewsSection';
import GallerySection from './components/GallerySection';

export default function App() {
  const [activeTab, setActiveTab] = useState<'rooms' | 'overview' | 'reviews' | 'photos'>('rooms');
  const [selectedRoomId, setSelectedRoomId] = useState<string>(ROOMS[0].id);
  
  // Interactive triggers
  const [isSaved, setIsSaved] = useState<boolean>(() => {
    return localStorage.getItem('bao_saved') === 'true';
  });
  
  const [showShareToast, setShowShareToast] = useState(false);
  const [showCallModal, setShowCallModal] = useState(false);
  const [showMapModal, setShowMapModal] = useState(false);
  const [bookingHistory, setBookingHistory] = useState<Booking[]>([]);

  const bookingFormRef = useRef<HTMLDivElement>(null);

  const toggleSave = () => {
    const nextSaved = !isSaved;
    setIsSaved(nextSaved);
    localStorage.setItem('bao_saved', nextSaved ? 'true' : 'false');
  };

  const handleShare = () => {
    const appUrl = window.location.href;
    navigator.clipboard.writeText(appUrl);
    setShowShareToast(true);
    setTimeout(() => {
      setShowShareToast(false);
    }, 3000);
  };

  const handleSelectBookingFromCard = (roomId: string) => {
    setSelectedRoomId(roomId);
    
    // Smooth scroll to booking form on mobile/tablet
    setTimeout(() => {
      bookingFormRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 100);
  };

  const handleBookingComplete = (newBooking: Booking) => {
    setBookingHistory([newBooking, ...bookingHistory]);
  };

  return (
    <div className="min-h-screen bg-art-beige flex flex-col font-sans text-art-charcoal" id="bao-hotel-app">
      {/* Top Banner Navigation Header */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-black/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="w-10 h-10 bg-[#1a1a1a] text-[#f5f2ed] flex items-center justify-center font-serif font-bold text-sm border border-black">
              B
            </span>
            <div>
              <h1 className="font-serif font-semibold text-lg text-[#1a1a1a] tracking-wide leading-none uppercase">
                BAO HOTELS
              </h1>
              <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-art-accent font-bold">
                & Suites • Ishara
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <a 
              href={`tel:${HOTEL_DETAILS.phone}`}
              className="text-slate-800 hover:text-art-accent p-2 px-4 text-[10px] font-bold uppercase tracking-wider hidden sm:flex items-center gap-1.5 border border-black/10 bg-white hover:border-black transition-all"
            >
              <Phone className="w-3.5 h-3.5 text-art-accent" />
              <span>{HOTEL_DETAILS.phone}</span>
            </a>
            
            <button
              onClick={toggleSave}
              className={`p-3 border transition-all cursor-pointer rounded-none ${
                isSaved 
                  ? 'bg-rose-50 border-rose-200 text-rose-600' 
                  : 'bg-white border-black/10 text-slate-400 hover:text-rose-500 hover:border-black/30'
              }`}
              title="Save Hotel"
            >
              <Heart className={`w-4 h-4 ${isSaved ? 'fill-rose-600' : ''}`} />
            </button>
          </div>
        </div>
      </header>

      {/* Hero Presentation Header Area */}
      <section className="bg-white border-b border-black/10 py-8 sm:py-12" id="hero-presentation">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Banner info */}
            <div className="lg:col-span-7 space-y-5">
              <div className="flex flex-wrap items-center gap-3 text-xs">
                <span className="bg-[#1a1a1a] text-[#f5f2ed] font-bold text-[9px] px-3 py-1 uppercase tracking-widest">
                  Top Rated Selection
                </span>
                <div className="flex items-center gap-1 bg-[#f5f2ed] border border-black/10 text-[#1a1a1a] py-1 px-3 text-[10px] font-bold uppercase tracking-wider">
                  <Star className="w-3 h-3 fill-art-accent text-art-accent" />
                  <span>{HOTEL_DETAILS.rating}</span>
                  <span className="opacity-60 font-sans font-medium text-[9px] lowercase italic">({HOTEL_DETAILS.reviewCount} reviews)</span>
                </div>
                <span className="text-[#1a1a1a]/40">•</span>
                <span className="text-slate-600 font-sans text-xs flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-art-accent" />
                  Ishara, Ogun State
                </span>
              </div>

              <h2 className="font-serif font-medium text-3xl sm:text-5xl text-[#1a1a1a] tracking-wide leading-tight">
                BAO Hotels And Suites
              </h2>

              <p className="text-slate-600 text-sm sm:text-base leading-relaxed max-w-2xl font-sans font-light">
                {HOTEL_DETAILS.description}
              </p>

              {/* Interaction Callouts */}
              <div className="flex flex-wrap items-center gap-3 pt-3" id="quick-action-strip">
                <button
                  onClick={() => setShowCallModal(true)}
                  className="flex items-center gap-2 bg-[#1a1a1a] text-white hover:bg-art-accent font-bold text-[10px] uppercase tracking-widest py-3.5 px-6 rounded-none transition-colors border border-black cursor-pointer"
                  id="action-btn-call"
                >
                  <Phone className="w-4 h-4 text-art-accent" />
                  <span>Call Concierge</span>
                </button>

                <button
                  onClick={() => setShowMapModal(true)}
                  className="flex items-center gap-2 bg-white hover:bg-slate-50 text-[#1a1a1a] border border-black/15 font-bold text-[10px] uppercase tracking-widest py-3.5 px-6 rounded-none transition-all cursor-pointer"
                  id="action-btn-directions"
                >
                  <Compass className="w-4 h-4 text-art-accent" />
                  <span>Access Directions</span>
                </button>

                <a
                  href={`https://wa.me/${HOTEL_DETAILS.whatsapp}?text=Hello!%20I'm%20inquiring%20about%20booking%20at%20BAO%20Hotels%20and%20Suites,%20Ogun%20State.`}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="flex items-center gap-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-[10px] uppercase tracking-widest py-3.5 px-6 rounded-none transition-colors border border-emerald-800 cursor-pointer"
                  id="action-btn-whatsapp"
                >
                  <svg className="w-4 h-4 fill-white" viewBox="0 0 24 24">
                    <path d="M12.012 2c-5.506 0-9.989 4.478-9.99 9.984a9.96 9.96 0 0 0 1.333 4.993L2 22l5.233-1.371a9.936 9.936 0 0 0 4.777 1.224h.005c5.505 0 9.989-4.478 9.99-9.986 0-2.67-1.037-5.178-2.922-7.062C17.198 3.02 14.69 2 12.012 2zm5.835 14.072c-.321.902-1.859 1.764-2.56 1.834-.64.062-1.472.083-2.316-.188-1.018-.328-2.285-.97-3.238-1.381-4.04-1.748-6.666-5.856-6.868-6.126-.2-.271-1.505-2.001-1.505-3.818 0-1.817.944-2.711 1.282-3.051.338-.34.743-.425.99-.425.247 0 .494.002.71.012.227.01.524-.04 1.107 1.365.193.465.385.928.57 1.372.185.443.284.686.118 1.018-.166.332-.331.52-.497.712-.166.192-.352.4-.503.543-.166.155-.34.325-.147.659.193.332.859 1.416 1.841 2.292.836.746 1.542.977 1.88 1.144.338.167.538.14.739-.093.2-.232.858-1.002 1.088-1.347.23-.346.46-.29.77-.174.312.115 1.974.93 2.313 1.1.338.169.564.254.646.395.083.14.083.813-.238 1.715z" />
                  </svg>
                  <span>WhatsApp Terminal</span>
                </a>

                <button
                  onClick={handleShare}
                  className="flex items-center gap-1.5 bg-slate-50 hover:bg-slate-100 text-slate-600 py-3.5 px-4 rounded-none text-[10px] uppercase font-bold tracking-widest border border-black/10 transition-colors cursor-pointer"
                  id="action-btn-share"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  <span>Share URL</span>
                </button>
              </div>
            </div>

            {/* Immersive Photo Preview Column Container */}
            <div className="lg:col-span-5 h-[260px] sm:h-[320px] rounded-none overflow-hidden relative group cursor-pointer border border-black/15">
              <img
                src="/src/assets/images/hotel_lobby_1779356860605.png"
                alt="BAO lobby front"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-700"
              />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent flex flex-col justify-end p-6">
                <span className="bg-art-accent text-white font-mono text-[9px] font-bold tracking-[0.25em] uppercase px-2 py-0.5 w-fit mb-2">
                  CONCIERGE & ENTRANCE Lobby
                </span>
                <p className="text-white text-base font-serif font-normal leading-tight">
                  Welcome to premium Ogun tranquility outside Lagos.
                </p>
                <button
                  onClick={() => setActiveTab('photos')}
                  className="text-art-accent text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 mt-2.5 hover:underline"
                >
                  <span>Explore Gallery</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Floating Share Toast Confirmation */}
      <AnimatePresence>
        {showShareToast && (
          <motion.div
            initial={{ opacity: 0, y: 30, x: '-50%' }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 15 }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-[#1a1a1a] text-[#f5f2ed] px-5 py-3.5 rounded-none shadow-xl flex items-center gap-3 border border-black"
            id="share-notification-toast"
          >
            <div className="bg-art-accent rounded-none p-1 text-white">
              <Check className="w-3.5 h-3.5" />
            </div>
            <span className="text-[11px] font-bold uppercase tracking-wide">Registry Link Copied</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Interactive Dial Mock Phone Drawer */}
      <AnimatePresence>
        {showCallModal && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.98, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.98, opacity: 0 }}
              className="bg-white rounded-none p-8 max-w-sm w-full border border-black/25 shadow-2xl relative text-center text-[#1a1a1a]"
              id="desk-calling-modal"
            >
              <button 
                onClick={() => setShowCallModal(false)}
                className="absolute top-4 right-4 text-slate-400 hover:text-[#1a1a1a] cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="w-12 h-12 bg-[#f5f2ed] rounded-none flex items-center justify-center mx-auto mb-4 border border-black/10 text-[#1a1a1a]">
                <Phone className="w-5 h-5 text-art-accent" />
              </div>

              <h4 className="font-serif font-medium text-xl text-[#1a1a1a] mb-2">Concierge Registry</h4>
              <p className="text-xs text-slate-500 mb-6 leading-relaxed">
                Connect with our front desk team in Ishara for bespoke arrangements, dining reservations, or custom requests.
              </p>

              <div className="bg-[#f5f2ed] p-4 rounded-none mb-6 border border-black/10">
                <p className="text-[9px] text-[#1a1a1a]/60 font-mono tracking-widest uppercase mb-1">FRONT DESK TERMINAL</p>
                <p className="font-serif font-bold text-art-accent text-lg hover:underline">
                  <a href={`tel:${HOTEL_DETAILS.phone}`}>{HOTEL_DETAILS.phone}</a>
                </p>
                <span className="text-[9px] text-slate-500 uppercase tracking-widest mt-1.5 block">Concierge Active 24 Hours</span>
              </div>

              <div className="space-y-2">
                <a
                  href={`tel:${HOTEL_DETAILS.phone}`}
                  className="w-full flex items-center justify-center gap-2 bg-[#1a1a1a] hover:bg-art-accent text-white font-bold text-[10px] uppercase tracking-widest py-3.5 rounded-none cursor-pointer border border-[#1a1a1a]"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>Initiate Phone Call</span>
                </a>
                <button
                  onClick={() => setShowCallModal(false)}
                  className="w-full text-[10px] uppercase tracking-wide text-slate-500 hover:text-black font-bold py-2"
                >
                  Dismiss Terminal
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Interactive Map Layout Drawer */}
      <AnimatePresence>
        {showMapModal && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.98, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.98, opacity: 0 }}
              className="bg-white rounded-none p-6 sm:p-8 max-w-2xl w-full border border-black/25 shadow-2xl relative text-[#1a1a1a]"
              id="google-maps-directions-modal"
            >
              <button 
                onClick={() => setShowMapModal(false)}
                className="absolute top-4 right-4 text-slate-400 hover:text-[#1a1a1a] cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>

              <h4 className="font-serif font-medium text-xl text-[#1a1a1a] mb-1.5 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-art-accent" />
                <span>Geographic & Travel Coordinates</span>
              </h4>
              <p className="text-xs text-slate-500 mb-5 leading-relaxed">
                Situated at <strong>Barin Epega St, Ishara 121108, Ogun State, Nigeria</strong>.
              </p>

              {/* Map Outline Frame */}
              <div className="bg-slate-100 aspect-video rounded-none border border-black/15 overflow-hidden relative mb-5">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3958.8251264871927!2d3.6895!3d6.9942!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNsKwNTknMzkuMSJOIDPCsDQxJzIyLjIiRQ!5e0!3m2!1sen!2sng!4v1700000000000!5m2!1sen!2sng"
                  className="w-full h-full border-0 absolute inset-0"
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer"
                />

                <div className="absolute top-3 left-3 bg-white/95 border border-black/10 shadow-sm p-4 rounded-none max-w-xs text-[11px] leading-relaxed hidden sm:block">
                  <p className="font-serif font-medium text-[#1a1a1a] mb-1 flex items-center gap-1">
                    <span>Traveler Note:</span>
                  </p>
                  <p className="text-slate-500 font-sans leading-normal">
                    Located about 5 minutes from the Sagamu-Benin Expressway bypass, close to Babcock University. Secure, gated block.
                  </p>
                </div>
              </div>

              {/* Directions Link CTA */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-[#f5f2ed] p-4 rounded-none border border-black/10">
                <div className="text-left text-xs bg-transparent">
                  <p className="font-bold uppercase text-[10px] tracking-wider text-[#1a1a1a]">Satellite Navigation</p>
                  <p className="text-slate-500 text-[11px] mt-0.5">Route GPS directives directly into native maps.</p>
                </div>
                <div className="flex gap-2 w-full sm:w-auto shrink-0">
                  <a
                    href="https://maps.google.com/?q=BAO+HOTELS+AND+SUITES+Barin+Epega+St+Ishara+Ogun+State"
                    target="_blank"
                    rel="noreferrer noopener"
                    className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 bg-[#1a1a1a] hover:bg-art-accent text-[#f5f2ed] hover:text-white font-bold text-[10px] uppercase tracking-wider py-2.5 px-4 rounded-none cursor-pointer border border-[#1a1a1a]"
                  >
                    <span>Launch GPS Navigation</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                  <button
                    onClick={() => setShowMapModal(false)}
                    className="border border-black/15 bg-white hover:bg-slate-50 text-[#1a1a1a] font-bold text-[10px] uppercase tracking-wider py-2.5 px-4 rounded-none cursor-pointer"
                  >
                    Dismiss
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Main Grid: Body Navigation Tabs Left & Floating Booking System Right */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 flex-grow w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Main Pillar Details (Tabs controller & Tab contents) */}
          <section className="lg:col-span-7 space-y-6">
            
            {/* Horizontal Tabs strip */}
            <div className="flex border-b border-black/15 bg-white p-1 rounded-none gap-1 sm:gap-1.5 overflow-x-auto shrink-0">
              <button
                onClick={() => setActiveTab('rooms')}
                className={`flex-1 py-3 px-4 rounded-none text-[9px] uppercase tracking-[0.2em] font-bold transition-all text-center shrink-0 cursor-pointer ${
                  activeTab === 'rooms' 
                    ? 'bg-[#1a1a1a] text-white' 
                    : 'text-slate-500 hover:text-[#1a1a1a] hover:bg-slate-50'
                }`}
              >
                Rooms & Suites
              </button>

              <button
                onClick={() => setActiveTab('overview')}
                className={`flex-1 py-3 px-4 rounded-none text-[9px] uppercase tracking-[0.2em] font-bold transition-all text-center shrink-0 cursor-pointer ${
                  activeTab === 'overview' 
                    ? 'bg-[#1a1a1a] text-white' 
                    : 'text-slate-500 hover:text-[#1a1a1a] hover:bg-slate-50'
                }`}
              >
                About & Overview
              </button>

              <button
                onClick={() => setActiveTab('reviews')}
                className={`flex-1 py-3 px-4 rounded-none text-[9px] uppercase tracking-[0.2em] font-bold transition-all text-center shrink-0 cursor-pointer ${
                  activeTab === 'reviews' 
                    ? 'bg-[#1a1a1a] text-white' 
                    : 'text-slate-500 hover:text-[#1a1a1a] hover:bg-slate-50'
                }`}
              >
                Reviews ({HOTEL_DETAILS.reviewCount})
              </button>

              <button
                onClick={() => setActiveTab('photos')}
                className={`flex-1 py-3 px-4 rounded-none text-[9px] uppercase tracking-[0.2em] font-bold transition-all text-center shrink-0 cursor-pointer ${
                  activeTab === 'photos' 
                    ? 'bg-[#1a1a1a] text-white' 
                    : 'text-slate-500 hover:text-[#1a1a1a] hover:bg-slate-50'
                }`}
              >
                Photos
              </button>
            </div>

            {/* Tab Controller Output Container */}
            <div id="tab-output-container" className="pt-2">
              <AnimatePresence mode="wait">
                {activeTab === 'rooms' && (
                  <motion.div
                    key="rooms-tab"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="space-y-6"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-black/10 pb-4">
                      <div>
                        <h3 className="font-serif font-normal text-2xl text-[#1a1a1a] tracking-wide">
                          Rooms & Hospitality Suites
                        </h3>
                        <p className="text-xs text-slate-600 mt-0.5">
                          Selected premium options to suit solo stays, retreats, executives or families.
                        </p>
                      </div>
                      <span className="text-[9px] font-bold uppercase tracking-[0.15em] bg-white text-[#1a1a1a] border border-black/10 px-3 py-1.5 rounded-none w-fit shrink-0">
                        {ROOMS.length} Categories Available
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6" id="rooms-suites-grid">
                      {ROOMS.map((room) => (
                        <RoomCard
                           key={room.id}
                           room={room}
                           onSelectBooking={handleSelectBookingFromCard}
                        />
                      ))}
                    </div>
                  </motion.div>
                )}

                {activeTab === 'overview' && (
                  <motion.div
                    key="overview-tab"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="space-y-6"
                    id="overview-tab-content"
                  >
                    {/* Detailed Section Write-up */}
                    <div className="bg-white border border-black/15 p-6 sm:p-8 rounded-none space-y-4 text-[#1a1a1a]">
                      <h3 className="font-serif font-normal text-2xl text-[#1a1a1a]">
                        Hospitality Redefined
                      </h3>
                      <p className="text-xs text-slate-600 leading-relaxed font-sans font-light">
                        Strategically located in Ishara, Ogun State, BAO Hotels and Suites offers unmatched style, spacious suites, and customized hospitality. It caters perfectly to guests checking out the quiet, idyllic Ogun environment while requiring swift access to the Lagos metropolitan bypass, Sagamu interchange, or major business centers.
                      </p>
                      <p className="text-xs text-slate-600 leading-relaxed font-sans font-light">
                        With 24/7 power backup, fully gated private security, high-fidelity room specifications, an on-site dining restaurant serving authentic local and continental food, and dedicated concierge attendants, BAO stands out as a luxurious haven.
                      </p>
                    </div>

                    {/* Amenities visual collection */}
                    <div className="bg-white border border-black/15 p-6 sm:p-8 rounded-none">
                      <h4 className="font-serif font-normal text-xl text-[#1a1a1a] mb-6 flex items-center gap-2">
                        <Award className="w-5 h-5 text-art-accent" />
                        <span>General Hotel Amenities</span>
                      </h4>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-5 gap-x-6" id="general-amenities-overview">
                        {HOTEL_DETAILS.amenities.map((item, index) => {
                          return (
                            <div key={index} className="flex items-start gap-3 border-b border-black/5 pb-3">
                              <div className="bg-[#f5f2ed] p-2 text-art-accent border border-black/5 shrink-0">
                                {item.icon === 'Zap' && <Zap className="w-4 h-4" />}
                                {item.icon === 'Shield' && <ShieldCheck className="w-4 h-4" />}
                                {item.icon === 'Wifi' && <Wifi className="w-4 h-4" />}
                                {item.icon === 'Coffee' && <Coffee className="w-4 h-4" />}
                                {item.icon === 'Utensils' && <Coffee className="w-4 h-4" />}
                                {item.icon === 'Sparkles' && <Sparkles className="w-4 h-4" />}
                                {item.icon === 'Users' && <Users className="w-4 h-4" />}
                                {item.icon === 'PhoneCall' && <Phone className="w-4 h-4" />}
                              </div>
                              <div>
                                <p className="text-xs font-bold uppercase tracking-wider text-[#1a1a1a] leading-none mb-1">{item.name}</p>
                                <p className="text-[10px] text-slate-500">Standard general provision</p>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Operational Guidelines & Procedures */}
                    <div className="bg-[#1a1a1a] text-[#f5f2ed] p-6 sm:p-8 rounded-none border border-black space-y-5">
                      <h4 className="font-serif font-normal text-xl text-art-accent flex items-center gap-2">
                        <Clock className="w-5 h-5" />
                        <span>Stay & Lodging Guidelines</span>
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-[10px] uppercase font-mono tracking-wider">
                        <div className="bg-white/5 p-4 rounded-none border border-white/10">
                          <p className="text-art-accent font-bold mb-1">Check-In Registry</p>
                          <p className="text-[#f5f2ed] text-xs font-bold font-serif">Ages 18+ • 14:00 PM onwards</p>
                          <p className="text-[8px] text-slate-400 mt-2 font-sans normal-case">Subject to setup & cleaning times</p>
                        </div>
                        <div className="bg-white/5 p-4 rounded-none border border-white/10">
                          <p className="text-art-accent font-bold mb-1">Check-Out Invoice</p>
                          <p className="text-[#f5f2ed] text-xs font-bold font-serif">12:00 PM deadline</p>
                          <p className="text-[8px] text-slate-400 mt-2 font-sans normal-case">Lates must request 3 hours prior</p>
                        </div>
                      </div>
                      <div className="text-[11px] text-slate-300 leading-relaxed space-y-1.5 bg-white/5 p-4 rounded-none border border-white/10">
                        <p className="font-bold text-[#f5f2ed] uppercase tracking-widest text-[9px]">Mandatory documents on arrivals:</p>
                        <p>• Approved photographic identification passport or government key card</p>
                        <p>• Copied checkout transaction invoice slip / digital confirm ticket code</p>
                      </div>
                    </div>
                  </motion.div>
                )}

                {activeTab === 'reviews' && (
                  <motion.div
                    key="reviews-tab"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                  >
                    <ReviewsSection
                      initialReviews={PRELOADED_REVIEWS}
                      rooms={ROOMS}
                      currentRating={HOTEL_DETAILS.rating}
                      totalReviewsCount={HOTEL_DETAILS.reviewCount}
                    />
                  </motion.div>
                )}

                {activeTab === 'photos' && (
                  <motion.div
                    key="photos-tab"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                  >
                    <GallerySection items={GALLERY_ITEMS} />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </section>

          {/* Right Pillar: Booking Form Element */}
          <section className="lg:col-span-5 space-y-6" ref={bookingFormRef}>
            
            <BookingForm
              rooms={ROOMS}
              selectedRoomId={selectedRoomId}
              onSelectRoom={setSelectedRoomId}
              onBookingComplete={handleBookingComplete}
            />

            {/* Dynamic Local Reservation Ledger list */}
            {bookingHistory.length > 0 && (
              <div 
                className="bg-white border border-black/15 p-5 rounded-none"
                id="booking-ledger-container"
              >
                <h4 className="font-serif font-bold text-xs uppercase tracking-widest text-[#1a1a1a] mb-4 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-slate-900 shrink-0" />
                  <span>Pending Receipts ({bookingHistory.length})</span>
                </h4>
                
                <div className="space-y-3">
                  {bookingHistory.map((booking) => {
                    const roomInfo = ROOMS.find(r => r.id === booking.roomId);
                    return (
                      <div 
                        key={booking.id}
                        className="bg-[#f5f2ed] border border-black/10 p-3.5 rounded-none flex items-center justify-between text-[11px] font-mono text-[#1a1a1a]"
                        id={`receipt-ledger-item-${booking.id}`}
                      >
                        <div>
                          <div className="flex items-center gap-1.5 font-bold">
                            <span>{booking.id}</span>
                            <span className="text-[8px] uppercase tracking-widest bg-white text-slate-800 border border-black/5 px-1 py-0.5 font-sans">
                              {roomInfo?.name || 'Class'}
                            </span>
                          </div>
                          <span className="text-[10px] text-slate-500 font-sans block mt-1">
                            In: {booking.checkIn}
                          </span>
                        </div>

                        <div className="text-right">
                          <span className="text-[#1a1a1a] font-bold block">
                            {new Intl.NumberFormat('en-NG', {
                              style: 'currency',
                              currency: 'NGN',
                              maximumFractionDigits: 0
                            }).format(booking.totalPrice)}
                          </span>
                          <span className="text-[9px] text-art-accent font-sans uppercase font-bold tracking-widest block mt-0.5">
                            Drafted
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Quick trust banner */}
            <div className="bg-[#f5f2ed] border border-black/15 p-5 rounded-none flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-art-accent shrink-0 mt-0.5" />
              <div className="text-xs text-[#1a1a1a] space-y-1.5">
                <p className="font-bold uppercase tracking-wider text-[10px]">Direct Reservation Guarantee</p>
                <p className="leading-relaxed text-slate-600 text-[11px]">
                  Booking directly via our desk or WhatsApp ensures priority check-in priority, complimentary breakfast upgrades, and zero middle-man fees. Show your receipts at front-desk.
                </p>
              </div>
            </div>
          </section>
        </div>
      </main>

      {/* Humble page footer */}
      <footer className="bg-[#1a1a1a] text-[#f5f2ed]/60 mt-16 border-t border-black py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <div className="flex items-center justify-center gap-2">
            <span className="w-8 h-8 bg-white text-black flex items-center justify-center font-serif font-bold text-sm border border-black">
              B
            </span>
            <span className="font-serif font-medium text-white tracking-widest uppercase text-sm">
              BAO Hotels And Suites
            </span>
          </div>
          <p className="text-[10px] uppercase font-mono tracking-widest text-[#f5f2ed]/45">
            Barin Epega St, Ishara 121108, Ogun State, Nigeria • Contact General Desk: {HOTEL_DETAILS.phone}
          </p>
          <div className="text-[9px] uppercase tracking-widest text-[#f5f2ed]/30 border-t border-white/5 pt-5 max-w-md mx-auto">
            © 2026 BAO Hotels and Suites. All rights reserved. Celebrating premium Nigerian hospitality and tranquil comfort.
          </div>
        </div>
      </footer>
    </div>
  );
}
