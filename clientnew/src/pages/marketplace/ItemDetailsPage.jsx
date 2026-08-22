import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Heart, 
  Share2, 
  Flag, 
  MessageSquare, 
  MapPin, 
  Calendar, 
  ShieldCheck, 
  Star, 
  Tag, 
  QrCode, 
  ArrowLeft, 
  CheckCircle2, 
  Clock, 
  Package,
  Layers,
  Zap,
  ShoppingBag,
  ShieldAlert,
  AlertCircle,
  HelpCircle,
  Check,
  Building2
} from 'lucide-react';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import PaymentModal from '../../components/payment/PaymentModal';
import { fetchItemDetails } from '../../redux/slices/itemSlice';
import { toggleWishlistItem } from '../../redux/slices/wishlistSlice';
import { addToast } from '../../redux/slices/uiSlice';
import api from '../../services/api';

export const ItemDetailsPage = () => {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { selectedItem: item, isDetailLoading, error } = useSelector((state) => state.items);
  const { wishlistIds } = useSelector((state) => state.wishlist);
  const { user, isAuthenticated } = useSelector((state) => state.auth);

  // Dual Rent vs Buy State
  const initialMode = searchParams.get('mode') === 'buy' ? 'buy' : 'rent';
  const [activeTab, setActiveTab] = useState(initialMode); // 'rent' | 'buy'
  const [rentalType, setRentalType] = useState('daily'); // 'hourly' | 'daily'
  const [rentalUnits, setRentalUnits] = useState(1);
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [qrModalOpen, setQrModalOpen] = useState(false);
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [reportReason, setReportReason] = useState('suspicious');
  const [reportDetails, setReportDetails] = useState('');
  const [sellerReviews, setSellerReviews] = useState([]);

  const itemId = item?._id || item?.id;
  const isWishlisted = wishlistIds.includes(itemId);
  const isOwnItem = isAuthenticated && (item?.seller?._id === user?.id || item?.seller === user?.id);

  useEffect(() => {
    if (id) {
      dispatch(fetchItemDetails(id));
      setActiveImageIndex(0);
    }
  }, [id, dispatch]);

  useEffect(() => {
    const fetchReviews = async () => {
      if (item?.seller?._id) {
        try {
          const res = await api.get(`/reviews/seller/${item.seller._id}`);
          setSellerReviews(res.data?.reviews || []);
        } catch (err) {}
      }
    };
    fetchReviews();
  }, [item]);

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    dispatch(
      addToast({
        type: 'success',
        title: 'Link Copied',
        message: 'Listing URL copied to clipboard.',
      })
    );
  };

  const handleWishlistToggle = () => {
    if (item) {
      dispatch(toggleWishlistItem(item));
    }
  };

  const handleChatWithSeller = () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    const sellerId = item.seller?._id || item.seller?.id || item.seller;
    navigate(`/chat?item=${itemId}&seller=${sellerId}`);
  };

  const handleOpenCheckout = () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    setPaymentModalOpen(true);
  };

  const handleReportSubmit = (e) => {
    e.preventDefault();
    setReportModalOpen(false);
    dispatch(
      addToast({
        type: 'info',
        title: 'Report Submitted',
        message: 'Our campus moderation team will review this listing shortly.',
      })
    );
  };

  // Pricing & Rent Calculations
  const rentHourlyRate = item?.rentPricePerHour || Math.ceil((item?.price || 100) / 24) || 20;
  const rentDailyRate = item?.rentPricePerDay || item?.price || 100;
  const buyPrice = item?.buyPrice || item?.price || 500;
  const securityDeposit = item?.securityDeposit || 0;

  const currentRentRate = rentalType === 'hourly' ? rentHourlyRate : rentDailyRate;
  const rentBaseTotal = currentRentRate * Number(rentalUnits);
  const rentGrandTotal = rentBaseTotal + securityDeposit;

  const finalCheckoutAmount = activeTab === 'rent' ? rentGrandTotal : buyPrice;

  const conditionLabels = {
    new: 'Brand New (Unused)',
    'like-new': 'Like New (Flawless)',
    good: 'Good (Functional, minor wear)',
    fair: 'Fair (Visible signs of usage)',
  };

  if (isDetailLoading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 space-y-4">
        <div className="w-12 h-12 rounded-2xl bg-brand-100 dark:bg-brand-950 flex items-center justify-center text-brand-600 dark:text-brand-400 animate-spin">
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        </div>
        <p className="text-sm font-medium text-slate-500">Loading campus listing details...</p>
      </div>
    );
  }

  if (!item || error) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 space-y-4 text-center">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Listing Not Found</h2>
        <p className="text-sm text-slate-500 max-w-sm">
          This listing might have been sold, rented out, or the link is invalid.
        </p>
        <Link to="/browse">
          <Button variant="primary" icon={ArrowLeft}>
            Back to Marketplace
          </Button>
        </Link>
      </div>
    );
  }

  const images = item.images && item.images.length > 0 ? item.images : ['https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=700'];

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8 text-left">
      
      {/* Top Breadcrumb Navigation */}
      <div className="flex items-center justify-between text-left">
        <Link
          to={`/category/${item.category}`}
          className="text-xs sm:text-sm font-bold text-slate-600 dark:text-slate-400 hover:text-brand-600 dark:hover:text-brand-400 inline-flex items-center gap-1.5 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to {item.category}
        </Link>

        <div className="flex items-center gap-2">
          <button
            onClick={handleShare}
            className="p-2 rounded-xl border border-slate-200 dark:border-dark-border hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors flex items-center gap-1.5 text-xs font-semibold"
          >
            <Share2 className="w-4 h-4" /> <span className="hidden sm:inline">Share</span>
          </button>
          <button
            onClick={() => setQrModalOpen(true)}
            className="p-2 rounded-xl border border-slate-200 dark:border-dark-border hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors flex items-center gap-1.5 text-xs font-semibold"
          >
            <QrCode className="w-4 h-4 text-brand-600" /> <span className="hidden sm:inline">QR Pass</span>
          </button>
        </div>
      </div>

      {/* Main Two-Column Layout (Amazon/Flipkart Style) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        
        {/* Left Column: Image Gallery & Description (7 Cols) */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Main Selected Image Preview */}
          <div className="relative aspect-[4/3] rounded-3xl overflow-hidden glass-card border border-slate-200/80 dark:border-dark-border shadow-lg bg-slate-100 dark:bg-slate-800 group">
            <img
              src={images[activeImageIndex]}
              alt={item.title}
              className="w-full h-full object-cover"
            />
            {item.status === 'sold' && (
              <div className="absolute inset-0 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center">
                <span className="px-6 py-2 rounded-2xl bg-rose-600 text-white font-black text-lg tracking-wider uppercase shadow-xl">
                  Permanently Sold
                </span>
              </div>
            )}
            {item.status === 'rented' && (
              <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center">
                <span className="px-6 py-2 rounded-2xl bg-amber-600 text-white font-black text-lg tracking-wider uppercase shadow-xl">
                  Currently Active on Rent
                </span>
              </div>
            )}

            {item.isNegotiable && (
              <span className="absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-bold bg-emerald-600 text-white shadow-md">
                Price Negotiable
              </span>
            )}
            <span className="absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-semibold bg-white/90 dark:bg-slate-900/90 text-slate-900 dark:text-white backdrop-blur-md shadow-md uppercase">
              {item.category}
            </span>
          </div>

          {/* Thumbnails Row */}
          {images.length > 1 && (
            <div className="flex items-center gap-3 overflow-x-auto pb-2">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImageIndex(idx)}
                  className={`relative w-20 h-20 rounded-2xl overflow-hidden border-2 transition-all flex-shrink-0 ${
                    activeImageIndex === idx
                      ? 'border-brand-500 ring-2 ring-brand-500/30 scale-95'
                      : 'border-transparent opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt={`Thumbnail ${idx}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}

          {/* Description Card */}
          <div className="glass-card rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-dark-border space-y-4">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white font-display">
              Product Overview & Details
            </h3>
            <p className="text-sm sm:text-base text-slate-700 dark:text-slate-300 whitespace-pre-line leading-relaxed">
              {item.description}
            </p>
          </div>

          {/* MANDATORY DAMAGE / LIABILITY POLICY CARD */}
          <div className="glass-card rounded-3xl p-6 sm:p-8 border border-amber-200 dark:border-amber-900/60 bg-amber-50/40 dark:bg-amber-950/20 space-y-3">
            <div className="flex items-center gap-2 text-amber-900 dark:text-amber-300 font-bold text-sm">
              <ShieldAlert className="w-5 h-5 text-amber-600 flex-shrink-0" />
              <span>Damage & Liability Terms (Seller Policy)</span>
            </div>
            <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
              {item.damagePolicy || 'Item must be returned in original working condition. Renter is liable for repair or replacement cost if damaged, lost, or late.'}
            </p>
            <div className="p-3 rounded-2xl bg-white/80 dark:bg-slate-900/80 border border-amber-200/60 dark:border-amber-900/40 text-[11px] text-slate-500 space-y-1">
              <p className="font-semibold text-slate-700 dark:text-slate-300">
                🛡️ Campus Safety Policy
              </p>
              <p>
                Refundable deposits are held in platform escrow and refunded within 2 hours of verified item return on campus.
              </p>
            </div>
          </div>

          {/* 3-PART VERIFIED CUSTOMER REVIEWS */}
          <div className="glass-card rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-dark-border space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white font-display">
                  Verified Peer Reviews
                </h3>
                <p className="text-xs text-slate-500">Based on completed campus rentals & purchases</p>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-2xl bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-900 text-amber-700 dark:text-amber-300 font-extrabold text-sm">
                <Star className="w-4 h-4 fill-amber-500 text-amber-500" />
                <span>{item.rating || '4.9'} / 5.0</span>
              </div>
            </div>

            {sellerReviews.length > 0 ? (
              <div className="space-y-4">
                {sellerReviews.slice(0, 3).map((rev, rIdx) => (
                  <div key={rIdx} className="p-4 rounded-2xl bg-slate-50 dark:bg-dark-card/60 border border-slate-200/60 dark:border-dark-border space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <img
                          src={rev.buyer?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120'}
                          alt={rev.buyer?.fullName}
                          className="w-7 h-7 rounded-xl object-cover"
                        />
                        <div>
                          <p className="font-bold text-slate-900 dark:text-white">{rev.buyer?.fullName || 'Verified Student'}</p>
                          <p className="text-[10px] text-slate-400">{rev.buyer?.college || 'Campus Peer'}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 text-amber-500 font-bold">
                        <Star className="w-3.5 h-3.5 fill-current" />
                        <span>{rev.rating}★</span>
                      </div>
                    </div>

                    <p className="text-slate-700 dark:text-slate-300 pt-1">"{rev.reviewText}"</p>

                    {/* 3 Metrics Badge Bar */}
                    <div className="flex flex-wrap gap-2 pt-1">
                      <span className="px-2 py-0.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 text-[10px] font-semibold">
                        Item Quality: {rev.itemQualityRating || 5}★
                      </span>
                      <span className="px-2 py-0.5 rounded-lg bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 text-[10px] font-semibold">
                        Punctuality: {rev.sellerBehaviorRating || 5}★
                      </span>
                      <span className="px-2 py-0.5 rounded-lg bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 text-[10px] font-semibold">
                        Experience: {rev.overallExperienceRating || 5}★
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-400 italic">No reviews yet for this student listing.</p>
            )}
          </div>

        </div>

        {/* Right Column: Dual Rent vs Buy Tabs & Checkout Box (5 Cols) */}
        <div className="lg:col-span-5 space-y-6">
          
          <div className="sticky top-24 space-y-6">
            
            {/* Purchase & Rental Calculator Card */}
            <div className="glass-card rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-dark-border shadow-xl space-y-6 bg-white/90 dark:bg-dark-card/90">
              
              {/* Category & Title */}
              <div className="space-y-1.5">
                <span className="text-xs font-bold uppercase tracking-wider text-brand-600 dark:text-brand-400">
                  {item.category} • {item.subcategory || 'General'}
                </span>
                <h1 className="text-2xl font-black text-slate-900 dark:text-white font-display leading-snug">
                  {item.title}
                </h1>
              </div>

              {/* DUAL TABS: RENT ITEM VS BUY PERMANENTLY */}
              <div className="grid grid-cols-2 gap-1.5 p-1 bg-slate-100 dark:bg-slate-800/60 rounded-2xl border border-slate-200/60 dark:border-dark-border">
                <button
                  type="button"
                  onClick={() => setActiveTab('rent')}
                  className={`py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                    activeTab === 'rent'
                      ? 'bg-white dark:bg-slate-700 text-brand-600 dark:text-brand-400 shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                  }`}
                >
                  <Clock className="w-3.5 h-3.5" /> Rent Item
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('buy')}
                  className={`py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                    activeTab === 'buy'
                      ? 'bg-white dark:bg-slate-700 text-emerald-600 dark:text-emerald-400 shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                  }`}
                >
                  <ShoppingBag className="w-3.5 h-3.5" /> Buy Permanently
                </button>
              </div>

              {/* TAB 1: RENT ITEM CALCULATOR */}
              {activeTab === 'rent' && (
                <motion.div
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-4"
                >
                  {/* Hourly vs Daily Selector */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
                      Select Rental Duration Type
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => setRentalType('hourly')}
                        className={`p-3 rounded-2xl border text-xs font-bold text-center transition-all ${
                          rentalType === 'hourly'
                            ? 'border-brand-500 bg-brand-50/50 dark:bg-brand-950/40 text-brand-600 dark:text-brand-400 ring-2 ring-brand-500/20'
                            : 'border-slate-200 dark:border-dark-border hover:bg-slate-50'
                        }`}
                      >
                        <p className="text-base font-black">₹{rentHourlyRate}/hr</p>
                        <span className="text-[10px] text-slate-400">Short Duration</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setRentalType('daily')}
                        className={`p-3 rounded-2xl border text-xs font-bold text-center transition-all ${
                          rentalType === 'daily'
                            ? 'border-brand-500 bg-brand-50/50 dark:bg-brand-950/40 text-brand-600 dark:text-brand-400 ring-2 ring-brand-500/20'
                            : 'border-slate-200 dark:border-dark-border hover:bg-slate-50'
                        }`}
                      >
                        <p className="text-base font-black">₹{rentDailyRate}/day</p>
                        <span className="text-[10px] text-slate-400">Semester / Daily</span>
                      </button>
                    </div>
                  </div>

                  {/* Quantity / Duration units & Start Date */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
                        {rentalType === 'hourly' ? 'Number of Hours' : 'Number of Days'}
                      </label>
                      <input
                        type="number"
                        min="1"
                        max="90"
                        value={rentalUnits}
                        onChange={(e) => setRentalUnits(Math.max(1, Number(e.target.value)))}
                        className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-dark-border bg-white dark:bg-dark-card text-xs font-bold text-slate-900 dark:text-white"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
                        Pickup Date
                      </label>
                      <input
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-dark-border bg-white dark:bg-dark-card text-xs font-bold text-slate-900 dark:text-white"
                      />
                    </div>
                  </div>

                  {/* Price Calculation Summary */}
                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-dark-card/60 border border-slate-200/60 dark:border-dark-border space-y-2 text-xs">
                    <div className="flex justify-between items-center text-slate-600 dark:text-slate-400">
                      <span>Rental Fee ({rentalUnits} {rentalType === 'hourly' ? 'hours' : 'days'})</span>
                      <span className="font-bold text-slate-900 dark:text-white">₹{rentBaseTotal}</span>
                    </div>

                    <div className="flex justify-between items-center text-slate-600 dark:text-slate-400">
                      <span>Refundable Security Deposit</span>
                      <span className="font-bold text-emerald-600 dark:text-emerald-400">₹{securityDeposit}</span>
                    </div>

                    <div className="flex justify-between items-center pt-2 border-t border-slate-200/60 dark:border-dark-border font-extrabold text-sm text-slate-900 dark:text-white">
                      <span>Total Payable Now</span>
                      <span className="text-brand-600 dark:text-brand-400 text-lg">₹{rentGrandTotal}</span>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* TAB 2: BUY PERMANENTLY */}
              {activeTab === 'buy' && (
                <motion.div
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-4"
                >
                  <div className="p-4 rounded-2xl bg-emerald-50/50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900 space-y-2">
                    <p className="text-xs font-bold text-emerald-800 dark:text-emerald-300 uppercase tracking-wider">
                      Permanent Ownership Price
                    </p>
                    <div className="flex items-baseline gap-2">
                      <span className="font-display text-3xl font-black text-slate-900 dark:text-white">
                        ₹{buyPrice?.toLocaleString()}
                      </span>
                      {item.originalPrice && item.originalPrice > buyPrice && (
                        <span className="text-xs text-slate-400 line-through">
                          ₹{item.originalPrice?.toLocaleString()}
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-emerald-700 dark:text-emerald-400">
                      Pay once and own the item permanently with 0% platform student fees.
                    </p>
                  </div>
                </motion.div>
              )}

              {/* Campus Meetup Spot */}
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <MapPin className="w-4 h-4 text-brand-500 flex-shrink-0" />
                <span>Handoff spot: <strong className="text-slate-800 dark:text-slate-200">{item.campusLocation}</strong></span>
              </div>

              {/* Primary Action Buttons */}
              <div className="space-y-2.5">
                {!isOwnItem && item.status !== 'sold' && (
                  <Button
                    variant="gradient"
                    size="lg"
                    className="w-full font-black shadow-glow text-base"
                    onClick={handleOpenCheckout}
                  >
                    {activeTab === 'rent'
                      ? `Book & Pay ₹${rentGrandTotal} (Rent)`
                      : `Buy Now for ₹${buyPrice}`}
                  </Button>
                )}

                <Button
                  variant={isOwnItem ? 'outline' : 'secondary'}
                  size="md"
                  className="w-full font-bold text-xs"
                  icon={MessageSquare}
                  onClick={handleChatWithSeller}
                >
                  {isOwnItem ? 'View in My Listings' : 'Chat & Negotiate'}
                </Button>

                <Button
                  variant={isWishlisted ? 'primary' : 'outline'}
                  size="md"
                  className="w-full text-xs"
                  icon={Heart}
                  onClick={handleWishlistToggle}
                >
                  {isWishlisted ? 'Saved in Wishlist' : 'Add to Wishlist'}
                </Button>
              </div>

            </div>

            {/* Seller Verified Identity Card */}
            <div className="glass-card rounded-3xl p-6 border border-slate-200/80 dark:border-dark-border space-y-4 text-left">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Verified Campus Seller
              </h4>

              <div className="flex items-center gap-3">
                <img
                  src={item.seller?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150'}
                  alt={item.seller?.fullName}
                  className="w-12 h-12 rounded-2xl object-cover border border-brand-500/40"
                />
                <div className="min-w-0">
                  <h3 className="font-bold text-sm text-slate-900 dark:text-white truncate">
                    {item.seller?.fullName || 'Verified Peer'}
                  </h3>
                  <p className="text-xs text-slate-500 truncate">{item.seller?.college || item.college}</p>
                </div>
              </div>
            </div>

          </div>

        </div>

      </div>

      {/* 5% Commission Split QR Payment Modal */}
      <PaymentModal
        isOpen={paymentModalOpen}
        onClose={() => setPaymentModalOpen(false)}
        item={item}
        transactionType={activeTab === 'rent' ? (rentalType === 'hourly' ? 'rent_hourly' : 'rent_daily') : 'buy'}
        rentalHours={rentalType === 'hourly' ? rentalUnits : 0}
        rentalDays={rentalType === 'daily' ? rentalUnits : 0}
        agreedPrice={activeTab === 'rent' ? rentBaseTotal : buyPrice}
        securityDeposit={activeTab === 'rent' ? securityDeposit : 0}
        onPaymentSuccess={() => {
          dispatch(fetchItemDetails(id));
        }}
      />

      {/* QR Code Pass Modal */}
      <Modal
        isOpen={qrModalOpen}
        onClose={() => setQrModalOpen(false)}
        title="Listing QR Pass"
        subtitle="Scan this QR code with any smartphone camera to open this listing on campus."
      >
        <div className="space-y-6 text-center">
          <div className="p-4 bg-white rounded-3xl border border-slate-200 shadow-inner max-w-xs mx-auto">
            {item.qrCodeUrl ? (
              <img src={item.qrCodeUrl} alt="Listing QR Code" className="w-56 h-56 mx-auto rounded-xl" />
            ) : (
              <div className="w-56 h-56 bg-slate-100 flex items-center justify-center text-xs text-slate-400">
                Generating QR code...
              </div>
            )}
          </div>
          <div className="space-y-1">
            <h4 className="font-bold text-sm text-slate-900 dark:text-white">{item.title}</h4>
            <p className="text-xs text-slate-500 font-mono">₹{item.price} • {item.campusLocation}</p>
          </div>
          <Button variant="outline" size="sm" onClick={() => setQrModalOpen(false)}>
            Close
          </Button>
        </div>
      </Modal>

      {/* Report Listing Modal */}
      <Modal
        isOpen={reportModalOpen}
        onClose={() => setReportModalOpen(false)}
        title="Report Suspicious Listing"
        subtitle="Help keep our campus community safe by reporting suspicious or prohibited items."
      >
        <form onSubmit={handleReportSubmit} className="space-y-4 text-left">
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
              Reason for Report
            </label>
            <select
              value={reportReason}
              onChange={(e) => setReportReason(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-dark-border bg-white dark:bg-dark-card text-sm"
            >
              <option value="suspicious">Scam or suspicious seller behavior</option>
              <option value="wrong_info">Incorrect or misleading information</option>
              <option value="inappropriate">Inappropriate content or photo</option>
              <option value="duplicate">Duplicate or spam listing</option>
              <option value="prohibited">Prohibited campus item</option>
              <option value="other">Other issue</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
              Additional Details (Optional)
            </label>
            <textarea
              rows={3}
              value={reportDetails}
              onChange={(e) => setReportDetails(e.target.value)}
              placeholder="Describe what looks suspicious..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-dark-border bg-white dark:bg-dark-card text-sm"
            />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <Button variant="outline" size="sm" onClick={() => setReportModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="danger" size="sm" type="submit">
              Submit Report
            </Button>
          </div>
        </form>
      </Modal>

    </div>
  );
};

export default ItemDetailsPage;
