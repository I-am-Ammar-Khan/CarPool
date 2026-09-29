import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Star, ShieldCheck, CheckCircle2, X } from 'lucide-react';

interface ReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  rideId: string;
  targetUserId: string;
  targetUserName: string;
  targetUserAvatar: string;
  isTargetDriver: boolean;
}

export const ReviewModal: React.FC<ReviewModalProps> = ({
  isOpen,
  onClose,
  rideId,
  targetUserId,
  targetUserName,
  targetUserAvatar,
  isTargetDriver,
}) => {
  const { submitReview } = useApp();
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDone, setIsDone] = useState(false);

  if (!isOpen) return null;

  const driverTags = [
    'Smooth Driving',
    'Punctual Departure',
    'Clean Vehicle',
    'Courteous Conversation',
    'Great Route Choice',
  ];

  const passengerTags = [
    'Punctual at Pickup',
    'Respectful Passenger',
    'Clean Travel Habits',
    'Friendly Vibes',
  ];

  const availableTags = isTargetDriver ? driverTags : passengerTags;

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const fullComment = selectedTags.length > 0
        ? `${selectedTags.join(', ')}. ${comment}`.trim()
        : comment || 'Pleasant and respectful journey.';

      await submitReview(rideId, targetUserId, rating, fullComment);
      setIsDone(true);
      setTimeout(() => {
        setIsDone(false);
        onClose();
      }, 1400);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#0d1820]/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white border border-[#112b54]/20 rounded-3xl p-5 max-w-sm w-full space-y-4 shadow-2xl relative animate-in zoom-in-95 text-[#0d1820]">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-[#7a7f87] hover:text-[#0d1820] p-1"
        >
          <X className="w-4 h-4" />
        </button>

        {isDone ? (
          <div className="text-center py-6 space-y-2">
            <div className="w-12 h-12 bg-[#fcf9f2] text-[#112b54] rounded-full flex items-center justify-center mx-auto border border-[#112b54]/20">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h3 className="font-serif italic text-lg font-medium text-[#0d1820]">
              Rating Submitted!
            </h3>
            <p className="text-xs text-[#7a7f87]">
              Trust score for {targetUserName} updated. Safe travels!
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="text-center space-y-1 pt-1">
              <img
                src={targetUserAvatar}
                alt={targetUserName}
                className="w-14 h-14 rounded-full object-cover mx-auto border border-[#112b54]/20"
              />
              <h3 className="font-serif italic text-lg font-medium text-[#0d1820]">
                Rate your journey with {targetUserName}<span className="text-[#112b54]">.</span>
              </h3>
              <p className="text-xs text-[#7a7f87]">
                Both users rate each other. Trust grows with every trip.
              </p>
            </div>

            {/* Stars */}
            <div className="flex justify-center gap-1.5 py-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  type="button"
                  key={star}
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  className="p-1 text-[#112b54] hover:scale-110 transition-transform"
                >
                  <Star
                    className={`w-7 h-7 ${
                      (hoverRating || rating) >= star
                        ? 'fill-[#112b54] text-[#112b54]'
                        : 'text-[#7a7f87]/40'
                    }`}
                  />
                </button>
              ))}
            </div>

            {/* Tags */}
            <div className="space-y-1.5">
              <label className="text-[11px] text-[#7a7f87] block">Highlights</label>
              <div className="flex flex-wrap gap-1.5">
                {availableTags.map((tag) => {
                  const isSelected = selectedTags.includes(tag);
                  return (
                    <button
                      type="button"
                      key={tag}
                      onClick={() => toggleTag(tag)}
                      className={`px-2.5 py-1 rounded-full text-[11px] border transition-colors ${
                        isSelected
                          ? 'bg-[#112b54] text-white border-[#112b54]'
                          : 'bg-[#fcf9f2] border-[#112b54]/15 text-[#0d1820]'
                      }`}
                    >
                      {tag}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Optional Comment */}
            <div>
              <label className="text-[11px] text-[#7a7f87] block mb-1">Trip Feedback</label>
              <textarea
                rows={2}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Share respectful notes on your experience..."
                className="w-full bg-[#fcf9f2] border border-[#112b54]/15 rounded-xl p-2.5 text-xs text-[#0d1820] focus:outline-none focus:border-[#112b54]"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-2.5 rounded-xl bg-[#0d1820] hover:bg-[#112b54] text-white text-xs font-medium transition-all shadow-xs flex items-center justify-center gap-1.5"
            >
              {isSubmitting ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <span>Submit Rating & Grow Trust</span>
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
