import { useState } from 'react';
import { GalleryItem } from '../types';
import { Maximize2, X, ChevronLeft, ChevronRight, Image } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface GallerySectionProps {
  items: GalleryItem[];
}

type CategoryFilter = 'all' | 'rooms' | 'lobby' | 'dining' | 'amenities';

export default function GallerySection({ items }: GallerySectionProps) {
  const [filter, setFilter] = useState<CategoryFilter>('all');
  const [activeImageIndex, setActiveImageIndex] = useState<number | null>(null);

  // Group Categories filter
  const filteredItems = filter === 'all' 
    ? items 
    : items.filter(item => item.category === filter);

  const categories: { label: string; value: CategoryFilter }[] = [
    { label: 'All Photos', value: 'all' },
    { label: 'Suites & Rooms', value: 'rooms' },
    { label: 'Lobby & Reception', value: 'lobby' },
    { label: 'Fine Dining & Bar', value: 'dining' },
    { label: 'Hotel Amenities', value: 'amenities' }
  ];

  const handleNext = () => {
    if (activeImageIndex === null) return;
    const nextIdx = (activeImageIndex + 1) % filteredItems.length;
    setActiveImageIndex(nextIdx);
  };

  const handlePrev = () => {
    if (activeImageIndex === null) return;
    const prevIdx = (activeImageIndex - 1 + filteredItems.length) % filteredItems.length;
    setActiveImageIndex(prevIdx);
  };

  return (
    <div id="gallery-section">
      {/* Category Tabs */}
      <div className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2 mb-8 border-b border-black/10 pb-5">
        {categories.map((cat) => (
          <button
            key={cat.value}
            onClick={() => {
              setFilter(cat.value);
              setActiveImageIndex(null);
            }}
            className={`px-4 py-2.5 rounded-none text-[9px] uppercase tracking-widest font-bold font-sans transition-all cursor-pointer border ${
              filter === cat.value
                ? 'bg-[#1a1a1a] text-white border-black'
                : 'bg-white text-slate-600 border-black/10 hover:border-black hover:text-black'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Grid display */}
      <motion.div 
        layout 
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6"
        id="gallery-grid"
      >
        <AnimatePresence mode="popLayout">
          {filteredItems.map((item, index) => (
            <motion.div
              layout
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.2 }}
              key={item.id}
              className="group relative aspect-[4/3] rounded-none overflow-hidden bg-[#f5f2ed] border border-black/15 cursor-pointer shadow-xs"
              onClick={() => setActiveImageIndex(index)}
              id={`gallery-item-${item.id}`}
            >
              <img
                src={item.url}
                alt={item.caption}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-102"
              />
              
              {/* Overlay on hover */}
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-5">
                <div className="flex items-center justify-between text-white gap-2">
                  <p className="text-[10px] font-bold uppercase tracking-wider truncate">{item.caption}</p>
                  <span className="bg-white/10 p-2 rounded-none backdrop-blur-xs shrink-0 border border-white/20">
                    <Maximize2 className="w-3.5 h-3.5 text-art-accent" />
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {activeImageIndex !== null && (
          <div 
            className="fixed inset-0 z-50 bg-[#1a1a1a]/95 backdrop-blur-md flex flex-col justify-between p-4 sm:p-6"
            id="gallery-lightbox-modal"
          >
            {/* Lightbox Header */}
            <div className="flex items-center justify-between text-[#f5f2ed] border-b border-white/10 pb-4">
              <span className="text-[10px] font-mono tracking-[0.2em] uppercase flex items-center gap-1.5 opacity-80 font-bold">
                <Image className="w-4 h-4 text-art-accent" />
                <span>BAO Registries • {activeImageIndex + 1}/{filteredItems.length}</span>
              </span>
              <button
                onClick={() => setActiveImageIndex(null)}
                className="p-2 hover:bg-white/10 rounded-none border border-white/10 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5 text-white" />
              </button>
            </div>

            {/* Lightbox Core Body */}
            <div className="flex-grow flex items-center justify-between gap-4 max-h-[70vh]">
              <button
                onClick={handlePrev}
                className="p-3 bg-white/5 hover:bg-white/10 text-white rounded-none border border-white/10 transition-all shrink-0 cursor-pointer disabled:opacity-30"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>

              <div className="max-w-4xl max-h-full aspect-video flex items-center justify-center overflow-hidden rounded-none border border-white/5 bg-black/40">
                <img
                  src={filteredItems[activeImageIndex].url}
                  alt={filteredItems[activeImageIndex].caption}
                  referrerPolicy="no-referrer"
                  className="max-w-full max-h-[65vh] object-contain rounded-none"
                />
              </div>

              <button
                onClick={handleNext}
                className="p-3 bg-white/5 hover:bg-white/10 text-white rounded-none border border-white/10 transition-all shrink-0 cursor-pointer"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </div>

            {/* Lightbox Footer */}
            <div className="text-center text-[#f5f2ed] p-4 shrink-0 max-w-xl mx-auto space-y-1">
              <p className="font-serif text-base tracking-wide font-normal">
                {filteredItems[activeImageIndex].caption}
              </p>
              <span className="font-mono text-[9px] text-art-accent uppercase tracking-[0.2em] font-bold">
                Category: {filteredItems[activeImageIndex].category}
              </span>
            </div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

