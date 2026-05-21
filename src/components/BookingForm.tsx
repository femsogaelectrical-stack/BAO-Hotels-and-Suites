import React, { useState, useEffect } from 'react';
import { Room, Booking } from '../types';
import { Calendar, Users, Phone, Mail, User, ShieldCheck, CreditCard, Send, Sparkles, Check, Clipboard } from 'lucide-react';
import { motion } from 'motion/react';
import { HOTEL_DETAILS } from '../data';

interface BookingFormProps {
  rooms: Room[];
  selectedRoomId: string;
  onSelectRoom: (roomId: string) => void;
  onBookingComplete: (booking: Booking) => void;
}

export default function BookingForm({ rooms, selectedRoomId, onSelectRoom, onBookingComplete }: BookingFormProps) {
  // Find currently selected room
  const activeRoom = rooms.find(r => r.id === selectedRoomId) || rooms[0];

  // Forms state
  const [checkIn, setCheckIn] = useState('2026-05-21');
  const [checkOut, setCheckOut] = useState('2026-05-22');
  const [guestName, setGuestName] = useState('');
  const [guestEmail, setGuestEmail] = useState('');
  const [guestPhone, setGuestPhone] = useState('');
  const [guestsCount, setGuestsCount] = useState(1);
  const [specialRequests, setSpecialRequests] = useState('');
  const [bookingChannel, setBookingChannel] = useState<'whatsapp' | 'instant'>('whatsapp');
  const [errorMsg, setErrorMsg] = useState('');
  const [success, setSuccess] = useState<Booking | null>(null);
  const [copiedReceipt, setCopiedReceipt] = useState(false);

  // Auto-cap guest count based on room max capacity
  useEffect(() => {
    if (guestsCount > activeRoom.maxGuests) {
      setGuestsCount(activeRoom.maxGuests);
    }
  }, [selectedRoomId, activeRoom]);

  // Calculate nights
  const calculateNights = () => {
    const start = new Date(checkIn);
    const end = new Date(checkOut);
    if (isNaN(start.getTime()) || isNaN(end.getTime())) return 0;
    const diffTime = end.getTime() - start.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  };

  const nights = calculateNights();
  const totalPrice = activeRoom ? activeRoom.price * (nights || 1) : 0;

  // Formatter.
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      maximumFractionDigits: 0
    }).format(price);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!guestName.trim()) {
      setErrorMsg('Please specify Guest Name');
      return;
    }
    if (!guestPhone.trim()) {
      setErrorMsg('Please specify Phone Number');
      return;
    }
    if (nights <= 0) {
      setErrorMsg('Check-out date must be after Check-in date');
      return;
    }

    const uniqueId = `BAO-${Math.floor(100000 + Math.random() * 900000)}`;
    const newBooking: Booking = {
      id: uniqueId,
      roomId: activeRoom.id,
      checkIn,
      checkOut,
      guestName,
      guestEmail: guestEmail || 'customer@baohotels.com',
      guestPhone,
      guestsCount,
      totalPrice,
      specialRequests,
      status: 'confirmed',
      createdAt: new Date().toISOString()
    };

    if (bookingChannel === 'whatsapp') {
      // Create a whatsapp checkout link
      const text = `Hello BAO Hotels & Suites management! I'd like to book a room:
• Room: ${activeRoom.name}
• Guest Name: ${guestName}
• Check-in: ${checkIn}
• Check-out: ${checkOut}
• Nights: ${nights}
• Guests count: ${guestsCount}
• Estimated Price: ${formatPrice(totalPrice)}
• Contact Phone: ${guestPhone}
• Special Requests: ${specialRequests || 'None'}
• Booking ID Ref: ${uniqueId}`;

      const encodedText = encodeURIComponent(text);
      const whatsappUrl = `https://wa.me/${HOTEL_DETAILS.whatsapp}?text=${encodedText}`;
      
      // Let's trigger state completion first
      setSuccess(newBooking);
      onBookingComplete(newBooking);
      
      // Open WhatsApp
      window.open(whatsappUrl, '_blank', 'noreferrer,noopener');
    } else {
      // Local Instant Confirmation
      setSuccess(newBooking);
      onBookingComplete(newBooking);
    }
  };

  const copyReceiptToClipboard = () => {
    if (!success) return;
    const text = `BAO Hotels Registry Receipt
ID: ${success.id}
Room: ${activeRoom.name}
Guest: ${success.guestName}
Duration: ${success.checkIn} to ${success.checkOut} (${nights} nights)
Total: ${formatPrice(success.totalPrice)}
Please show this copy at check-in.`;

    navigator.clipboard.writeText(text);
    setCopiedReceipt(true);
    setTimeout(() => setCopiedReceipt(false), 2000);
  };

  if (success) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-none border border-black/20 p-6 text-center max-w-md mx-auto"
        id="booking-receipt-success"
      >
        <div className="w-12 h-12 bg-black/5 rounded-none flex items-center justify-center mx-auto mb-4 border border-black/10 text-[#1a1a1a]">
          <ShieldCheck className="w-6 h-6" />
        </div>
        <h3 className="font-serif font-medium text-xl text-[#1a1a1a] mb-1">Reservation Logged</h3>
        <p className="text-xs text-slate-500 mb-5 leading-relaxed">
          {bookingChannel === 'whatsapp' 
            ? "Your details have been registered. The WhatsApp desk terminal was initiated to sync your request."
            : "Your reservation request has been processed. Showcase your invoice below at arrival."}
        </p>

        {/* Receipt Widget */}
        <div className="bg-[#f5f2ed] border border-black/15 rounded-none p-4 text-left font-mono text-[11px] mb-6 relative text-[#1a1a1a]">
          <div className="flex justify-between border-b border-dashed border-black/20 pb-2 mb-2 font-bold">
            <span className="opacity-60 uppercase font-mono text-[10px]">INVOICE REF</span>
            <span className="text-art-accent">{success.id}</span>
          </div>
          <div className="space-y-1.5 font-mono">
            <div className="flex justify-between"><span>GUEST:</span><span className="font-bold truncate max-w-[200px]">{success.guestName}</span></div>
            <div className="flex justify-between"><span>CLASS:</span><span className="font-bold">{activeRoom.name}</span></div>
            <div className="flex justify-between"><span>ARRIVE:</span><span className="font-bold">{success.checkIn}</span></div>
            <div className="flex justify-between"><span>DEPART:</span><span className="font-bold">{success.checkOut}</span></div>
            <div className="flex justify-between"><span>NIGHTS:</span><span className="font-bold">{nights}</span></div>
            <div className="flex justify-between border-t border-black/20 pt-2 font-bold text-sm"><span>TOTAL NGN:</span><span className="text-art-accent">{formatPrice(success.totalPrice)}</span></div>
          </div>
        </div>

        <div className="space-y-2">
          <button
            onClick={copyReceiptToClipboard}
            className="w-full flex items-center justify-center gap-2 border border-black/15 bg-white font-bold text-[10px] uppercase tracking-wider text-slate-800 py-3 rounded-none transition-transform active:scale-98 cursor-pointer hover:bg-slate-50"
          >
            {copiedReceipt ? <Check className="w-3.5 h-3.5 text-art-accent" /> : <Clipboard className="w-3.5 h-3.5 text-art-accent" />}
            <span>{copiedReceipt ? 'Receipt Copied' : 'Copy Invoice Receipt'}</span>
          </button>
          
          <button
            onClick={() => setSuccess(null)}
            className="w-full text-[10px] uppercase tracking-wider text-[#1a1a1a] hover:text-art-accent font-bold py-2 block text-center"
          >
            ← Modify / Book New Custom Room
          </button>
        </div>
      </motion.div>
    );
  }

  return (
    <div id="booking-form-wrapper" className="bg-[#f5f2ed] p-1.5 rounded-none border border-black/15">
      {/* Dynamic Header Tab */}
      <div className="bg-white p-6 rounded-none border border-black/10">
        <h3 className="font-serif font-medium text-xl text-[#1a1a1a] tracking-wide mb-1 flex items-center gap-2">
          <span>Room Booking Engine</span>
        </h3>
        <p className="text-[11px] text-slate-500 mb-6 uppercase tracking-wider">
          Establish dates, occupancy, and register files.
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Room Selection Dropdown */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-[#1a1a1a] uppercase tracking-[0.2em] flex items-center justify-between">
              <span>Selected Suite Room</span>
              <span className="text-slate-500 font-mono text-[9px] lowercase italic">Rate: {formatPrice(activeRoom.price)}</span>
            </label>
            <div className="relative">
              <select
                value={selectedRoomId}
                onChange={(e) => onSelectRoom(e.target.value)}
                id="booking-room-select"
                className="w-full text-xs font-medium bg-white border border-black/15 rounded-none px-4 py-3 text-[#1a1a1a] focus:outline-hidden focus:border-[#1a1a1a] cursor-pointer"
              >
                {rooms.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.name} — {formatPrice(r.price)} / Night
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Date Picker Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-[#1a1a1a] uppercase tracking-[0.2em] flex items-center gap-1">
                <span>Check-In</span>
              </label>
              <input
                type="date"
                min="2026-05-21"
                value={checkIn}
                onChange={(e) => setCheckIn(e.target.value)}
                id="input-check-in-date"
                required
                className="w-full text-xs font-mono bg-white border border-black/15 rounded-none px-3.5 py-3 text-[#1a1a1a] focus:outline-hidden focus:border-[#1a1a1a]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-[#1a1a1a] uppercase tracking-[0.2em] flex items-center gap-1">
                <span>Check-Out</span>
              </label>
              <input
                type="date"
                min={checkIn || "2026-05-21"}
                value={checkOut}
                onChange={(e) => setCheckOut(e.target.value)}
                id="input-check-out-date"
                required
                className="w-full text-xs font-mono bg-white border border-black/15 rounded-none px-3.5 py-3 text-[#1a1a1a] focus:outline-hidden focus:border-[#1a1a1a]"
              />
            </div>
          </div>

          {/* Guests Count Input */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-[#1a1a1a] uppercase tracking-[0.2em] flex items-center justify-between">
              <span>Suite Occupancy</span>
              <span className="text-slate-400 font-mono text-[9px] normal-case">Max allowed: {activeRoom.maxGuests}</span>
            </label>
            <input
              type="number"
              min={1}
              max={activeRoom.maxGuests}
              value={guestsCount}
              onChange={(e) => setGuestsCount(parseInt(e.target.value) || 1)}
              id="input-guests-count"
              required
              className="w-full text-xs bg-white border border-black/15 rounded-none px-3.5 py-3 text-[#1a1a1a] focus:outline-hidden focus:border-[#1a1a1a]"
            />
          </div>

          <div className="border-t border-black/10 pt-4 space-y-4">
            <p className="text-[10px] font-bold text-[#1a1a1a] uppercase tracking-[0.22em]">Guest Specifications</p>

            {/* Guest Name input */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-[#1a1a1a]/70 uppercase tracking-widest">
                <span>Full Name</span>
              </label>
              <input
                type="text"
                value={guestName}
                onChange={(e) => setGuestName(e.target.value)}
                placeholder="Emeka Adesina"
                required
                id="input-guest-name"
                className="w-full text-xs bg-white border border-black/15 rounded-none px-3.5 py-3 text-[#1a1a1a] focus:outline-hidden focus:border-[#1a1a1a]"
              />
            </div>

            {/* Guest contact info input */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-[#1a1a1a]/70 uppercase tracking-widest">
                  <span>Phone Number</span>
                </label>
                <input
                  type="tel"
                  value={guestPhone}
                  onChange={(e) => setGuestPhone(e.target.value)}
                  placeholder="+234 803 123 4567"
                  required
                  id="input-guest-phone"
                  className="w-full text-xs bg-white border border-black/15 rounded-none px-3.5 py-3 text-[#1a1a1a] focus:outline-hidden focus:border-[#1a1a1a]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-[#1a1a1a]/70 uppercase tracking-widest">
                  <span>Email (Optional)</span>
                </label>
                <input
                  type="email"
                  value={guestEmail}
                  onChange={(e) => setGuestEmail(e.target.value)}
                  placeholder="emeka@example.com"
                  id="input-guest-email"
                  className="w-full text-xs bg-white border border-black/15 rounded-none px-3.5 py-3 text-[#1a1a1a] focus:outline-hidden focus:border-[#1a1a1a]"
                />
              </div>
            </div>

            {/* Special Request */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-[#1a1a1a]/70 uppercase tracking-widest">Special Requests</label>
              <textarea
                value={specialRequests}
                onChange={(e) => setSpecialRequests(e.target.value)}
                placeholder="E.g., early check-in, dietary preferences, extra towels..."
                rows={2}
                id="input-special-requests"
                className="w-full text-xs bg-white border border-black/15 rounded-none px-3.5 py-3 text-[#1a1a1a] focus:outline-hidden resize-none focus:border-[#1a1a1a]"
              />
            </div>
          </div>

          {/* Booking Channel Selection */}
          <div className="bg-[#f5f2ed] border border-black/10 rounded-none p-3.5">
            <p className="text-[9px] font-bold text-[#1a1a1a] uppercase tracking-widest mb-2.5">Sync Method</p>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setBookingChannel('whatsapp')}
                className={`py-2.5 px-3 rounded-none text-[9px] uppercase tracking-widest font-bold transition-all ${
                  bookingChannel === 'whatsapp'
                    ? 'bg-[#1a1a1a] text-white'
                    : 'bg-white border border-black/10 text-slate-600 hover:bg-slate-100'
                } flex items-center justify-center gap-1.5 cursor-pointer`}
              >
                <Send className="w-3.5 h-3.5" />
                <span>WhatsApp Desk</span>
              </button>

              <button
                type="button"
                onClick={() => setBookingChannel('instant')}
                className={`py-2.5 px-3 rounded-none text-[9px] uppercase tracking-widest font-bold transition-all ${
                  bookingChannel === 'instant'
                    ? 'bg-[#1a1a1a] text-white'
                    : 'bg-white border border-black/10 text-slate-600 hover:bg-slate-100'
                } flex items-center justify-center gap-1.5 cursor-pointer`}
              >
                <CreditCard className="w-3.5 h-3.5" />
                <span>Instant Ticket</span>
              </button>
            </div>
          </div>

          {/* Pricing Breakout Display */}
          <div className="bg-[#1a1a1a] text-[#f5f2ed] rounded-none p-4 flex justify-between items-center border border-black">
            <div className="text-left">
              <p className="text-[10px] uppercase font-bold tracking-widest opacity-60">Estimated Total</p>
              <p className="text-[9px] font-mono opacity-50">
                {formatPrice(activeRoom.price)} × {nights || 1} Night{nights > 1 ? 's' : ''}
              </p>
            </div>
            <p className="font-serif font-bold text-lg text-[#f5f2ed]">
              {formatPrice(totalPrice)}
            </p>
          </div>

          {errorMsg && (
            <p className="text-xs text-red-700 font-bold bg-red-50 border border-red-200 p-2.5 rounded-none text-center">
              {errorMsg}
            </p>
          )}

          {/* Action trigger button */}
          <button
            type="submit"
            id="btn-submit-booking-form"
            className="w-full bg-[#1a1a1a] hover:bg-art-accent text-white font-bold text-[10px] uppercase tracking-[0.25em] py-4 px-4 rounded-none transition-colors border border-black cursor-pointer flex items-center justify-center gap-2"
          >
            {bookingChannel === 'whatsapp' ? (
              <>
                <Send className="w-4 h-4 text-art-accent" />
                <span>Draft Reservation & Send</span>
              </>
            ) : (
              <>
                <ShieldCheck className="w-4 h-4 text-art-accent" />
                <span>Issue Reservation Code</span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
