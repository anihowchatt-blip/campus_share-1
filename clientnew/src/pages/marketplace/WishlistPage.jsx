import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Heart, 
  Trash2, 
  MessageSquare, 
  ExternalLink, 
  ShoppingBag, 
  ShieldCheck, 
  Star, 
  MapPin, 
  ArrowRight,
  PackageOpen
} from 'lucide-react';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import { fetchWishlist, removeFromWishlist } from '../../redux/slices/wishlistSlice';
import { addToast } from '../../redux/slices/uiSlice';

export const WishlistPage = () => {
  const dispatch = useDispatch();
  const { items: wishlistEntries, isLoading } = useSelector((state) => state.wishlist);
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(fetchWishlist());
  }, [dispatch]);

  const handleRemove = (itemId, itemTitle) => {
    dispatch(removeFromWishlist(itemId));
  };

  const handleChat = (sellerName) => {
    dispatch(
      addToast({
        type: 'info',
        title: 'Starting Chat',
        message: `Connecting to ${sellerName || 'seller'} for campus exchange...`,
      })
    );
  };

  return (
    <div className="min-h-screen py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
      
      {/* Header Banner */}
      <div className="glass-card rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-dark-border text-left flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-2xl bg-rose-50 dark:bg-rose-950/80 text-rose-600 dark:text-rose-400 flex items-center justify-center shadow-soft">
              <Heart className="w-5 h-5 fill-current" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white font-display">
              Saved Wishlist
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Keep track of items you plan to buy or exchange on campus.
          </p>
        </div>

        <div className="px-4 py-2 rounded-2xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-900/60 text-rose-800 dark:text-rose-300 font-bold text-xs self-start sm:self-auto">
          {wishlistEntries.length} Saved {wishlistEntries.length === 1 ? 'Item' : 'Items'}
        </div>
      </div>

      {/* Loading State */}
      {isLoading ? (
        <div className="min-h-[40vh] flex flex-col items-center justify-center p-6 space-y-4">
          <div className="w-10 h-10 rounded-2xl bg-brand-100 dark:bg-brand-950 flex items-center justify-center text-brand-600 animate-spin">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </div>
          <p className="text-xs font-semibold text-slate-500">Loading your saved items...</p>
        </div>
      ) : wishlistEntries.length === 0 ? (
        /* Empty State */
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass-card rounded-3xl p-12 sm:p-16 text-center space-y-5 border border-slate-200/80 dark:border-dark-border max-w-lg mx-auto"
        >
          <div className="w-20 h-20 rounded-3xl bg-rose-50 dark:bg-rose-950/60 text-rose-400 mx-auto flex items-center justify-center shadow-soft">
            <Heart className="w-10 h-10" />
          </div>
          <div className="space-y-1.5">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white font-display">
              Your Wishlist is Empty
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              Save textbooks, calculators, cycles, and lab supplies by tapping the heart icon on any listing card.
            </p>
          </div>
          <div className="pt-3">
            <Link to="/browse">
              <Button variant="gradient" size="md" icon={ArrowRight} iconPosition="right" className="font-bold shadow-glow">
                Explore Campus Marketplace
              </Button>
            </Link>
          </div>
        </motion.div>
      ) : (
        /* Wishlist Items Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {wishlistEntries.map((entry) => {
              const item = entry.item;
              if (!item) return null;
              const itemId = item._id || item.id;
              const imageSrc = item.images && item.images.length > 0 
                ? item.images[0] 
                : 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600';

              return (
                <motion.div
                  key={entry._id || itemId}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="glass-card rounded-3xl overflow-hidden border border-slate-200/80 dark:border-dark-border flex flex-col justify-between hover:shadow-xl transition-all text-left group"
                >
                  <div>
                    {/* Image */}
                    <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-100 dark:bg-slate-800">
                      <img
                        src={imageSrc}
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute top-3 left-3">
                        <span className="px-2.5 py-1 rounded-xl text-[10px] font-bold uppercase tracking-wider bg-slate-900/70 text-white backdrop-blur-md">
                          {item.category}
                        </span>
                      </div>
                      <button
                        onClick={() => handleRemove(itemId, item.title)}
                        aria-label="Remove from wishlist"
                        className="absolute top-3 right-3 p-2 rounded-2xl bg-rose-500 text-white shadow-md hover:bg-rose-600 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Content */}
                    <div className="p-5 space-y-3">
                      <div className="space-y-1">
                        <Link
                          to={`/item/${itemId}`}
                          className="font-bold text-base text-slate-900 dark:text-white hover:text-brand-600 dark:hover:text-brand-400 transition-colors line-clamp-1"
                        >
                          {item.title}
                        </Link>
                        <p className="font-extrabold text-xl text-slate-900 dark:text-white">
                          ₹{item.price?.toLocaleString()}
                        </p>
                      </div>

                      {/* Seller info */}
                      <div className="pt-2 border-t border-slate-100 dark:border-dark-border flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                        <div className="flex items-center gap-1 truncate">
                          <ShieldCheck className="w-3.5 h-3.5 text-brand-600" />
                          <span className="font-semibold truncate">{item.seller?.fullName || 'Student'}</span>
                        </div>
                        <span className="font-bold text-amber-500 flex items-center gap-1">
                          <Star className="w-3 h-3 fill-current" /> {item.seller?.rating || '4.9'}
                        </span>
                      </div>

                      <div className="flex items-center gap-1 text-[11px] text-slate-400 truncate">
                        <MapPin className="w-3 h-3 flex-shrink-0" />
                        <span className="truncate">{item.campusLocation}</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions Footer */}
                  <div className="p-4 pt-0 grid grid-cols-2 gap-2">
                    <Link to={`/item/${itemId}`} className="w-full">
                      <Button variant="outline" size="sm" className="w-full text-xs font-semibold" icon={ExternalLink}>
                        View Details
                      </Button>
                    </Link>
                    <Button
                      variant="gradient"
                      size="sm"
                      className="w-full text-xs font-bold shadow-soft"
                      icon={MessageSquare}
                      onClick={() => handleChat(item.seller?.fullName)}
                    >
                      Chat / Buy
                    </Button>
                  </div>

                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}

    </div>
  );
};

export default WishlistPage;
