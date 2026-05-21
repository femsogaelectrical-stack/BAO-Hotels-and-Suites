import { Room } from '../types';
import { Users, Layout, CheckCircle, ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';

interface RoomCardProps {
  key?: string | number;
  room: Room;
  onSelectBooking: (roomId: string) => void;
}

export default function RoomCard({ room, onSelectBooking }: RoomCardProps) {
  // Format price as Naira
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      maximumFractionDigits: 0
    }).format(price);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4 }}
      className="bg-white rounded-none overflow-hidden border border-black/15 hover:border-black/35 transition-all duration-300 flex flex-col group h-full"
      id={`room-card-${room.id}`}
    >
      {/* Room Image Container */}
      <div className="relative aspect-[4/3] overflow-hidden bg-slate-100 border-b border-black/10">
        <img
          src={room.image}
          alt={room.name}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-700"
        />
        <div className="absolute bottom-0 right-0 bg-[#1a1a1a] text-[#f5f2ed] px-4 py-2 text-xs font-serif flex items-center gap-1">
          <span className="font-serif text-[#f5f2ed] font-bold text-sm">{formatPrice(room.price)}</span>
          <span className="opacity-65 text-[9px] uppercase tracking-wider">/ Night</span>
        </div>
      </div>

      {/* Room Contents */}
      <div className="p-6 flex flex-col flex-grow bg-white text-[#1a1a1a]">
        <div className="flex items-start justify-between gap-2 mb-3">
          <h3 className="font-serif font-medium text-xl text-[#1a1a1a] tracking-wide group-hover:text-art-accent transition-colors">
            {room.name}
          </h3>
          {room.featured && (
            <span className="bg-[#1a1a1a]/5 text-[#1a1a1a] text-[9px] uppercase tracking-widest font-bold px-2 py-0.5 border border-black/10">
              Popular Selection
            </span>
          )}
        </div>

        <p className="text-xs text-slate-600 mb-5 line-clamp-2 leading-relaxed">
          {room.description}
        </p>

        {/* Core specs */}
        <div className="flex items-center gap-4 text-[10px] uppercase font-bold tracking-widest text-[#1a1a1a]/60 mb-5 border-b border-black/10 pb-3">
          <span className="flex items-center gap-1.5">
            <Users className="w-3.5 h-3.5 text-art-accent" />
            Max: {room.maxGuests} Guest{room.maxGuests > 1 ? 's' : ''}
          </span>
          <span className="flex items-center gap-1.5">
            <Layout className="w-3.5 h-3.5 text-art-accent" />
            Size: {room.sizeSqM} m²
          </span>
        </div>

        {/* Amenities Highlights */}
        <div className="mb-6 flex-grow">
          <p className="text-[10px] font-bold text-[#1a1a1a] uppercase tracking-[0.22em] mb-3">Key Amenities</p>
          <ul className="grid grid-cols-2 gap-x-3 gap-y-2">
            {room.amenities.map((amenity, idx) => (
              <li key={idx} className="flex items-center gap-1.5 text-[11px] text-slate-700">
                <span className="text-art-accent shrink-0 font-bold">✓</span>
                <span className="truncate">{amenity}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* CTA Button */}
        <button
          onClick={() => onSelectBooking(room.id)}
          id={`btn-select-booking-${room.id}`}
          className="w-full flex items-center justify-center gap-2 bg-[#1a1a1a] text-[#f5f2ed] hover:bg-art-accent hover:text-white font-bold text-[10px] uppercase tracking-[0.25em] py-3.5 px-4 rounded-none transition-all duration-200 active:scale-98 cursor-pointer border border-[#1a1a1a]"
        >
          <span>Select & Reserve</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </motion.div>
  );
}

