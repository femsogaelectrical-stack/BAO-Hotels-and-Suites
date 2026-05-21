import React, { useState } from 'react';
import { Review, Room } from '../types';
import { Star, MessageSquare, ThumbsUp, Sparkles, User, BadgeAlert } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface ReviewsSectionProps {
  initialReviews: Review[];
  rooms: Room[];
  currentRating: number;
  totalReviewsCount: number;
}

export default function ReviewsSection({ initialReviews, rooms, currentRating, totalReviewsCount }: ReviewsSectionProps) {
  const [reviewsList, setReviewsList] = useState<Review[]>(initialReviews);
  const [reviewAuthor, setReviewAuthor] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const [selectedRoom, setSelectedRoom] = useState(rooms[0]?.name || 'Standard Room');
  const [reviewComment, setReviewComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [likedReviews, setLikedReviews] = useState<Record<string, boolean>>({});
  const [errorMsg, setErrorMsg] = useState('');

  // Handle Review Submission
  const handleAddReview = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!reviewAuthor.trim()) {
      setErrorMsg('Please specify Your Name.');
      return;
    }
    if (!reviewComment.trim() || reviewComment.length < 10) {
      setErrorMsg('Please write a review comment (minimum 10 characters).');
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      const newReview: Review = {
        id: `custom-rev-${Date.now()}`,
        author: reviewAuthor,
        rating: reviewRating,
        comment: reviewComment,
        date: new Date().toISOString().split('T')[0],
        roomType: selectedRoom,
        likes: 0,
        isCustom: true
      };

      setReviewsList([newReview, ...reviewsList]);
      
      // Reset form
      setReviewAuthor('');
      setReviewComment('');
      setReviewRating(5);
      setIsSubmitting(false);
    }, 600);
  };

  const handleLike = (id: string, currentLikes: number) => {
    if (likedReviews[id]) {
      // Dislike it
      setLikedReviews({ ...likedReviews, [id]: false });
      setReviewsList(prev => prev.map(r => r.id === id ? { ...r, likes: currentLikes } : r));
    } else {
      // Like it
      setLikedReviews({ ...likedReviews, [id]: true });
      setReviewsList(prev => prev.map(r => r.id === id ? { ...r, likes: currentLikes + 1 } : r));
    }
  };

  // Recalculate local stats based on possible added custom reviews
  const customCount = reviewsList.filter(r => r.isCustom).length;
  const activeReviewCount = totalReviewsCount + customCount;
  
  // Calculate average rating
  const originalSum = currentRating * totalReviewsCount;
  const customSum = reviewsList.filter(r => r.isCustom).reduce((acc, curr) => acc + curr.rating, 0);
  const activeRatingAverage = parseFloat(((originalSum + customSum) / activeReviewCount).toFixed(1));

  const getBarPercentage = (stars: number) => {
    const listCount = reviewsList.length;
    const matchCount = reviewsList.filter(r => Math.round(r.rating) === stars).length;
    return Math.round((matchCount / listCount) * 100);
  };

  return (
    <div id="reviews-section" className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Visual Stats Block */}
      <div className="bg-white border border-black/15 rounded-none p-6 h-fit text-[#1a1a1a]" id="review-stats-widget">
        <h4 className="font-serif font-normal text-lg tracking-wide mb-4">Rating Breakdown</h4>
        <div className="flex items-baseline gap-2 mb-6">
          <span className="text-4xl font-serif font-bold text-[#1a1a1a] tracking-tight">{activeRatingAverage}</span>
          <span className="text-xs font-mono font-bold text-slate-400">/ 5.0</span>
          <div className="flex items-center gap-1.5 ml-4">
            {[1, 2, 3, 4, 5].map((star) => {
              const fullFill = activeRatingAverage >= star;
              const halfFill = !fullFill && activeRatingAverage >= star - 0.5;
              return (
                <Star
                  key={star}
                  className={`w-4 h-4 ${
                    fullFill 
                      ? 'fill-art-accent text-art-accent' 
                      : halfFill 
                        ? 'fill-art-accent/70 text-art-accent/70' 
                        : 'text-slate-300'
                  }`}
                />
              );
            })}
          </div>
        </div>

        {/* Rating bars */}
        <div className="space-y-3 mb-6">
          {[5, 4, 3, 2, 1].map((stars) => {
            const percentage = getBarPercentage(stars);
            return (
              <div key={stars} className="flex items-center gap-3 text-[10px] uppercase font-bold tracking-wider">
                <span className="w-4 text-slate-500 font-mono text-right">{stars}</span>
                <Star className="w-3 h-3 text-art-accent fill-art-accent shrink-0" />
                <div className="flex-grow bg-[#f5f2ed] h-2 rounded-none overflow-hidden border border-black/5">
                  <div 
                    className="bg-art-accent h-full rounded-none transition-all duration-500" 
                    style={{ width: `${percentage}%` }}
                  />
                </div>
                <span className="w-8 text-slate-400 font-mono text-right">{percentage}%</span>
              </div>
            );
          })}
        </div>

        <p className="text-[11px] text-slate-500 leading-relaxed text-center font-serif">
          Recalculated based on <strong>{activeReviewCount} reviews</strong> collated from surveys & digital ledger files.
        </p>
      </div>

      {/* Review Feed list */}
      <div className="lg:col-span-2 space-y-6">
        {/* Write a Review widget */}
        <div className="bg-white border border-black/15 rounded-none p-6 text-[#1a1a1a]">
          <h4 className="font-serif font-normal text-lg text-[#1a1a1a] mb-5 flex items-center gap-2">
            <span>Share Your Experience</span>
          </h4>

          <form onSubmit={handleAddReview} className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-[#1a1a1a] uppercase tracking-[0.2em] flex items-center gap-1">
                  <span>Your Full Name</span>
                </label>
                <input
                  type="text"
                  value={reviewAuthor}
                  onChange={(e) => setReviewAuthor(e.target.value)}
                  placeholder="E.g., Chidi Okafor"
                  required
                  id="input-review-author"
                  className="w-full text-xs bg-white border border-black/15 rounded-none px-3.5 py-3 text-slate-800 focus:outline-[#1a1a1a]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-[#1a1a1a] uppercase tracking-[0.2em]">Suite Stayed In</label>
                <select
                  value={selectedRoom}
                  onChange={(e) => setSelectedRoom(e.target.value)}
                  id="select-review-room-type"
                  className="w-full text-xs bg-white border border-black/15 rounded-none px-3.5 py-3 text-slate-700 cursor-pointer focus:outline-[#1a1a1a]"
                >
                  {rooms.map(r => (
                    <option key={r.id} value={r.name}>{r.name}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Stars selection */}
            <div className="flex items-center gap-3">
              <label className="text-[10px] font-bold text-[#1a1a1a] uppercase tracking-[0.2em]">Your Rating:</label>
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setReviewRating(star)}
                    className="p-1 hover:scale-110 transition-transform cursor-pointer"
                  >
                    <Star
                      className={`w-5 h-5 ${
                        reviewRating >= star 
                          ? 'fill-art-accent text-art-accent' 
                          : 'text-slate-300'
                      }`}
                    />
                  </button>
                ))}
              </div>
              <span className="text-[10px] font-mono font-bold text-art-accent ml-1">
                {reviewRating}.0 / 5.0
              </span>
            </div>

            {/* Comment */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-[#1a1a1a] uppercase tracking-[0.2em]">Review Comments</label>
              <textarea
                value={reviewComment}
                onChange={(e) => setReviewComment(e.target.value)}
                placeholder="How was the 24/7 power backup, concierge team, room tidiness or complimentary breakfast?..."
                rows={3}
                id="input-review-comment"
                required
                className="w-full text-xs bg-white border border-black/15 rounded-none px-3.5 py-2.5 text-slate-800 focus:outline-[#1a1a1a] resize-none"
              />
            </div>

            {errorMsg && (
              <p className="text-xs text-red-700 bg-red-50 border border-red-200 p-2 text-center font-bold">
                {errorMsg}
              </p>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              id="btn-submit-review"
              className="w-full sm:w-auto bg-[#1a1a1a] hover:bg-art-accent text-white font-bold text-[10px] uppercase tracking-[0.25em] px-6 py-3.5 rounded-none border border-black transition-colors cursor-pointer disabled:opacity-50"
            >
              {isSubmitting ? 'Submitting...' : 'Post Verified Survey'}
            </button>
          </form>
        </div>

        {/* List of reviews */}
        <div className="space-y-4" id="reviews-list-container">
          <AnimatePresence initial={false}>
            {reviewsList.map((review, index) => {
              const isLiked = !!likedReviews[review.id];
              return (
                <motion.div
                  key={review.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-white border border-black/15 p-6 rounded-none hover:border-black/35 transition-all text-[#1a1a1a]"
                  id={`review-${review.id}`}
                >
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <div>
                      <h4 className="text-base font-serif font-medium text-[#1a1a1a] flex items-center gap-2">
                        {review.author}
                        {review.isCustom && (
                          <span className="font-mono text-[8px] bg-black text-[#f5f2ed] uppercase tracking-widest px-2 py-0.5">
                            Just Logged
                          </span>
                        )}
                      </h4>
                      <p className="text-[10px] text-slate-400 font-mono uppercase tracking-wider mt-1">
                        {review.roomType ? `Stayed in ${review.roomType}` : 'Verified Stay'} • {review.date}
                      </p>
                    </div>

                    <div className="flex items-center gap-0.5">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`w-3.5 h-3.5 ${
                            review.rating >= star 
                              ? 'fill-art-accent text-art-accent' 
                              : 'text-slate-200'
                          }`}
                        />
                      ))}
                    </div>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed mb-4">
                    {review.comment}
                  </p>

                  <div className="flex items-center justify-between border-t border-black/5 pt-3.5">
                    <button
                      onClick={() => handleLike(review.id, review.likes)}
                      className={`flex items-center gap-1.5 text-[10px] uppercase tracking-wider font-bold ${
                        isLiked ? 'text-art-accent' : 'text-slate-400 hover:text-[#1a1a1a]'
                      } transition-colors cursor-pointer`}
                      id={`btn-like-review-${review.id}`}
                    >
                      <ThumbsUp className="w-3.5 h-3.5" />
                      <span>Mark Helpful ({review.likes})</span>
                    </button>

                    <div className="flex items-center gap-1 text-[9px] uppercase tracking-widest font-mono text-slate-400 font-bold">
                      <MessageSquare className="w-3 h-3 text-art-accent" />
                      <span>Verified Stay</span>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

