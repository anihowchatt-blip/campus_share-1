import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { 
  Sparkles, 
  ArrowRight, 
  ArrowLeft, 
  Check, 
  Upload, 
  X, 
  Image as ImageIcon, 
  DollarSign, 
  MapPin, 
  Tag, 
  CheckCircle2, 
  AlertCircle,
  FileText,
  Zap,
  BookOpen,
  Calculator,
  Bike,
  Armchair,
  Laptop,
  Clock,
  ShoppingBag,
  ShieldAlert,
  HelpCircle
} from 'lucide-react';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Select from '../../components/common/Select';
import { createListing } from '../../redux/slices/itemSlice';
import { ITEM_CONDITIONS } from '../../utils/constants';
import { CATEGORIES } from '../../utils/categories';
import { uploadFileToFirebase } from '../../config/firebase';

export const SellItemPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { isCreating } = useSelector((state) => state.items);
  const { user } = useSelector((state) => state.auth);

  const initialCat = searchParams.get('category') || 'books-study';

  const [errorMessage, setErrorMessage] = useState('');

  // Form State
  const [formData, setFormData] = useState({
    title: '',
    category: initialCat,
    subcategory: '',
    pricingType: 'both', // 'rent_only' | 'buy_only' | 'both'
    enableHourlyRent: true,
    enableDailyRent: true,
    enableBuy: true,
    rentPricePerHour: '30',
    rentPricePerDay: '120',
    buyPrice: '850',
    originalPrice: '1800',
    securityDeposit: '200',
    damagePolicy: 'Item must be returned in the same working condition. Renter is liable for repair/replacement cost if damaged or lost during rental.',
    condition: 'like-new',
    brand: '',
    purchaseYear: new Date().getFullYear().toString(),
    quantity: '1',
    campusLocation: user?.college ? `${user.college} Central Library` : 'Central Campus Library Steps',
    images: [
      'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=700',
    ],
  });

  const [newImageUrl, setNewImageUrl] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleFileUpload = async (e) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    try {
      setIsUploading(true);
      setUploadProgress(0);

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const downloadUrl = await uploadFileToFirebase(file, 'listings', (progress) => {
          setUploadProgress(progress);
        });

        setFormData((prev) => ({
          ...prev,
          images: [...prev.images, downloadUrl],
        }));
      }
    } catch (err) {
      console.error('File upload failed:', err);
      setErrorMessage(err.message || 'Image upload to Firebase Storage failed.');
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
      e.target.value = '';
    }
  };

  const handleAddImage = (url) => {
    const target = url || newImageUrl;
    if (target.trim()) {
      setFormData({
        ...formData,
        images: [...formData.images, target.trim()],
      });
      setNewImageUrl('');
    }
  };

  const handleRemoveImage = (index) => {
    setFormData({
      ...formData,
      images: formData.images.filter((_, i) => i !== index),
    });
  };

  const selectedCategoryObj = CATEGORIES.find((c) => c.id === formData.category) || CATEGORIES[0];

  const categoryOptions = CATEGORIES.map((c) => ({
    value: c.id,
    label: `${c.emoji} ${c.name}`,
  }));

  const conditionOptions = ITEM_CONDITIONS.map((c) => ({
    value: c.id,
    label: c.label,
  }));

  // Quick 1-Click Item Listing Presets
  const quickPresets = [
    {
      title: 'Introduction to Algorithms (CLRS 4th Ed)',
      category: 'books-study',
      subcategory: 'Textbooks',
      rentPricePerHour: '25',
      rentPricePerDay: '80',
      buyPrice: '1600',
      originalPrice: '3800',
      securityDeposit: '300',
      condition: 'like-new',
      brand: 'MIT Press',
      description: 'Pristine edition of CLRS Algorithms. Clean pages, no highlights. Perfect for semester exams.',
      damagePolicy: 'No tearing or water damage. Renter will be charged ₹500 if binding is broken.',
      image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=700',
      icon: BookOpen,
    },
    {
      title: 'Casio fx-991EX ClassWiz Scientific Calculator',
      category: 'engineering',
      subcategory: 'Scientific Graphing Calculators',
      rentPricePerHour: '20',
      rentPricePerDay: '60',
      buyPrice: '950',
      originalPrice: '1695',
      securityDeposit: '200',
      condition: 'like-new',
      brand: 'Casio',
      description: 'Exam-approved solar & battery high-res calculator with hard slide-on case.',
      damagePolicy: 'Screen scratches or lost case will forfeit the ₹200 deposit.',
      image: 'https://images.unsplash.com/photo-1594980596870-8aa52a78d8cd?w=700',
      icon: Calculator,
    },
    {
      title: 'Mini Drafter with Deluxe Sheet Bag',
      category: 'engineering',
      subcategory: 'Mini Drafters with Sheet Bags',
      rentPricePerHour: '15',
      rentPricePerDay: '45',
      buyPrice: '550',
      originalPrice: '1200',
      securityDeposit: '150',
      condition: 'good',
      brand: 'Omega',
      description: 'Standard engineering graphics drafter with scale clamp, arm levers, and waterproof canvas carry bag.',
      damagePolicy: 'Cracked scale or damaged arm joints will result in ₹200 replacement fee.',
      image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=700',
      icon: Laptop,
    },
    {
      title: 'White Cotton Lab Coat (Unisex, Size M/L)',
      category: 'science-lab',
      subcategory: 'Lab Coats & Aprons',
      rentPricePerHour: '10',
      rentPricePerDay: '30',
      buyPrice: '380',
      originalPrice: '750',
      securityDeposit: '100',
      condition: 'like-new',
      brand: 'Medico',
      description: 'Freshly washed and ironed chemistry/biotech/pharmacy lab coat with 3 pockets.',
      damagePolicy: 'Severe acid stains or burns will require ₹250 replacement cost.',
      image: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=700',
      icon: BookOpen,
    },
    {
      title: 'Hercules Roadeo 21-Speed Mountain Gear Cycle',
      category: 'sports-fitness',
      subcategory: 'Bicycles',
      rentPricePerHour: '40',
      rentPricePerDay: '150',
      buyPrice: '4500',
      originalPrice: '11500',
      securityDeposit: '500',
      condition: 'good',
      brand: 'Hercules',
      description: 'Dual disc brakes, front suspension, helmet, and heavy-duty combination lock included.',
      damagePolicy: 'Flat tires must be repaired. Renter is liable for frame damage or loss during rental.',
      image: 'https://images.unsplash.com/photo-1485965120184-e220f721d03e?w=700',
      icon: Bike,
    },
  ];

  const applyPreset = (preset) => {
    setFormData((prev) => ({
      ...prev,
      title: preset.title,
      category: preset.category,
      subcategory: preset.subcategory,
      rentPricePerHour: preset.rentPricePerHour,
      rentPricePerDay: preset.rentPricePerDay,
      buyPrice: preset.buyPrice,
      originalPrice: preset.originalPrice,
      securityDeposit: preset.securityDeposit,
      condition: preset.condition,
      brand: preset.brand,
      description: preset.description,
      damagePolicy: preset.damagePolicy,
      images: [preset.image],
    }));
    setErrorMessage('');
  };

  const handlePublish = async (e) => {
    if (e) e.preventDefault();
    setErrorMessage('');

    if (!formData.title.trim()) {
      setErrorMessage('Please enter an item name / title.');
      return;
    }
    if (!formData.category) {
      setErrorMessage('Please select a category.');
      return;
    }
    if (!formData.damagePolicy.trim()) {
      setErrorMessage('Damage & Liability policy terms are mandatory for all listings.');
      return;
    }
    if (!formData.campusLocation.trim()) {
      setErrorMessage('Please specify your preferred campus meetup spot.');
      return;
    }
    if (formData.images.length === 0) {
      setErrorMessage('Please upload at least 1 photo for your listing.');
      return;
    }

    const payload = {
      ...formData,
      pricingType: (formData.enableHourlyRent || formData.enableDailyRent) && formData.enableBuy
        ? 'both'
        : (formData.enableBuy ? 'buy_only' : 'rent_only'),
      rentPricePerHour: formData.enableHourlyRent ? Number(formData.rentPricePerHour) : null,
      rentPricePerDay: formData.enableDailyRent ? Number(formData.rentPricePerDay) : null,
      buyPrice: formData.enableBuy ? Number(formData.buyPrice) : null,
      price: formData.enableBuy ? Number(formData.buyPrice) : Number(formData.rentPricePerDay || formData.rentPricePerHour || 100),
      securityDeposit: Number(formData.securityDeposit || 0),
    };

    const res = await dispatch(createListing(payload));
    if (createListing.fulfilled.match(res)) {
      navigate(`/item/${res.payload._id}`);
    }
  };

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto space-y-8 text-left">
      
      {/* Header & Quick Sell Banner */}
      <div className="glass-card rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-dark-border space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-2xl bg-brand-100 dark:bg-brand-950 text-brand-600 dark:text-brand-400 flex items-center justify-center">
                <Zap className="w-5 h-5" />
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white font-display">
                List Product for Rent & Buy
              </h1>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
              Earn directly on <strong className="text-brand-600">{user?.college || 'your campus'}</strong>. Keep 95% of gross rental and sale payouts.
            </p>
          </div>
        </div>

        {/* 1-Click Quick Templates Carousel */}
        <div className="pt-2 border-t border-slate-100 dark:border-dark-border">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2.5">
            ⚡ Quick Presets (1-Click Autofill)
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
            {quickPresets.map((preset, i) => {
              const Icon = preset.icon;
              return (
                <button
                  key={i}
                  type="button"
                  onClick={() => applyPreset(preset)}
                  className="p-2.5 rounded-2xl border border-slate-200 dark:border-dark-border hover:border-brand-500 bg-white/60 dark:bg-dark-card/60 hover:bg-brand-50/40 dark:hover:bg-brand-950/30 transition-all text-left group flex flex-col justify-between"
                >
                  <div className="flex items-center justify-between w-full mb-1.5">
                    <Icon className="w-4 h-4 text-brand-600 group-hover:scale-110 transition-transform" />
                    <span className="text-[10px] font-bold text-slate-400">₹{preset.buyPrice}</span>
                  </div>
                  <p className="text-xs font-bold text-slate-800 dark:text-white truncate group-hover:text-brand-600 transition-colors">
                    {preset.title.split('(')[0]}
                  </p>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Error Banner */}
      {errorMessage && (
        <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-900 text-rose-800 dark:text-rose-300 text-xs font-semibold flex items-center gap-2">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Two Column Grid: Listing Form (Left) & Live Preview (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Form Container (7 Cols) */}
        <div className="lg:col-span-7 glass-card rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-dark-border shadow-xl space-y-6">
          <form onSubmit={handlePublish} className="space-y-5">
            
            {/* Title */}
            <Input
              label="Item Name / Title *"
              placeholder="e.g. Casio fx-991EX Scientific Calculator, CLRS Textbook..."
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
            />

            {/* Category Selection (All 18 Categories) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Select
                label="Category *"
                options={categoryOptions}
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value, subcategory: '' })}
                required
              />

              <Select
                label="Condition *"
                options={conditionOptions}
                value={formData.condition}
                onChange={(e) => setFormData({ ...formData, condition: e.target.value })}
                required
              />
            </div>

            {/* Subcategory Tile Pick or Free-Text ("Others") */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                Subcategory / Item Type {formData.category === 'others' && '(Free-Text)'}
              </label>
              {formData.category !== 'others' && selectedCategoryObj.subcategories.length > 0 ? (
                <div className="space-y-2">
                  <select
                    value={formData.subcategory}
                    onChange={(e) => setFormData({ ...formData, subcategory: e.target.value })}
                    className="w-full p-3 rounded-2xl border border-slate-300 dark:border-dark-border bg-white dark:bg-dark-card text-xs sm:text-sm text-slate-900 dark:text-white"
                  >
                    <option value="">Select a subcategory (or enter custom)</option>
                    {selectedCategoryObj.subcategories.map((sub, idx) => (
                      <option key={idx} value={sub}>{sub}</option>
                    ))}
                  </select>
                </div>
              ) : (
                <Input
                  placeholder="e.g. 3D Scale Model, Specialized Soldering Pen..."
                  value={formData.subcategory}
                  onChange={(e) => setFormData({ ...formData, subcategory: e.target.value })}
                />
              )}
            </div>

            {/* DUAL RENT & BUY PRICING CONFIGURATION */}
            <div className="p-4 rounded-3xl bg-slate-50 dark:bg-dark-card/60 border border-slate-200/80 dark:border-dark-border space-y-4">
              <p className="text-xs font-black uppercase tracking-wider text-brand-600 dark:text-brand-400 flex items-center gap-1.5">
                <DollarSign className="w-4 h-4" /> Pricing & Availability Models
              </p>

              {/* Checkboxes for available modes */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                
                {/* Rent Hourly */}
                <div className="p-3 rounded-2xl border border-slate-200 dark:border-dark-border bg-white dark:bg-dark-card space-y-2">
                  <label className="flex items-center gap-2 text-xs font-bold text-slate-900 dark:text-white cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.enableHourlyRent}
                      onChange={(e) => setFormData({ ...formData, enableHourlyRent: e.target.checked })}
                      className="rounded text-brand-600"
                    />
                    <span>Rent Hourly</span>
                  </label>
                  {formData.enableHourlyRent && (
                    <input
                      type="number"
                      placeholder="₹/hr (e.g. 25)"
                      value={formData.rentPricePerHour}
                      onChange={(e) => setFormData({ ...formData, rentPricePerHour: e.target.value })}
                      className="w-full p-2 text-xs rounded-xl border border-slate-300 dark:border-dark-border font-bold"
                    />
                  )}
                </div>

                {/* Rent Daily */}
                <div className="p-3 rounded-2xl border border-slate-200 dark:border-dark-border bg-white dark:bg-dark-card space-y-2">
                  <label className="flex items-center gap-2 text-xs font-bold text-slate-900 dark:text-white cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.enableDailyRent}
                      onChange={(e) => setFormData({ ...formData, enableDailyRent: e.target.checked })}
                      className="rounded text-brand-600"
                    />
                    <span>Rent Daily</span>
                  </label>
                  {formData.enableDailyRent && (
                    <input
                      type="number"
                      placeholder="₹/day (e.g. 100)"
                      value={formData.rentPricePerDay}
                      onChange={(e) => setFormData({ ...formData, rentPricePerDay: e.target.value })}
                      className="w-full p-2 text-xs rounded-xl border border-slate-300 dark:border-dark-border font-bold"
                    />
                  )}
                </div>

                {/* Buy Permanently */}
                <div className="p-3 rounded-2xl border border-slate-200 dark:border-dark-border bg-white dark:bg-dark-card space-y-2">
                  <label className="flex items-center gap-2 text-xs font-bold text-slate-900 dark:text-white cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.enableBuy}
                      onChange={(e) => setFormData({ ...formData, enableBuy: e.target.checked })}
                      className="rounded text-emerald-600"
                    />
                    <span>Permanent Buy</span>
                  </label>
                  {formData.enableBuy && (
                    <input
                      type="number"
                      placeholder="₹ Buy (e.g. 800)"
                      value={formData.buyPrice}
                      onChange={(e) => setFormData({ ...formData, buyPrice: e.target.value })}
                      className="w-full p-2 text-xs rounded-xl border border-slate-300 dark:border-dark-border font-bold"
                    />
                  )}
                </div>

              </div>

              {/* Security Deposit for Rentals */}
              {(formData.enableHourlyRent || formData.enableDailyRent) && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-slate-200/60 dark:border-dark-border/60">
                  <Input
                    label="Refundable Security Deposit (₹)"
                    type="number"
                    placeholder="e.g. 200"
                    value={formData.securityDeposit}
                    onChange={(e) => setFormData({ ...formData, securityDeposit: e.target.value })}
                    helperText="Refunded to renter when item is returned undamaged."
                  />
                  <Input
                    label="Original MRP / Retail Cost"
                    type="number"
                    placeholder="e.g. 1800"
                    value={formData.originalPrice}
                    onChange={(e) => setFormData({ ...formData, originalPrice: e.target.value })}
                    helperText="Used to show discount percentage."
                  />
                </div>
              )}
            </div>

            {/* MANDATORY DAMAGE / LIABILITY POLICY */}
            <div className="space-y-1.5">
              <label className="block text-xs font-black uppercase tracking-wider text-amber-700 dark:text-amber-400 flex items-center gap-1">
                <ShieldAlert className="w-4 h-4 text-amber-600" /> Damage & Liability Policy (Mandatory) *
              </label>
              <textarea
                rows={3}
                required
                placeholder="State your terms for damage, late return, or loss (e.g., deposit forfeiture, repair cost, replacement fee)..."
                value={formData.damagePolicy}
                onChange={(e) => setFormData({ ...formData, damagePolicy: e.target.value })}
                className="w-full p-3.5 rounded-2xl border border-amber-300 dark:border-amber-900 bg-amber-50/30 dark:bg-amber-950/20 text-xs sm:text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-amber-500/30"
              />
              <p className="text-[11px] text-slate-500">
                This policy will be shown to buyers/renters on the Product Detail Page before checkout.
              </p>
            </div>

            {/* Campus Meetup Spot */}
            <Input
              label="Campus Meetup Spot *"
              icon={MapPin}
              placeholder="e.g. Central Library Steps, Hostel Block A Lobby"
              value={formData.campusLocation}
              onChange={(e) => setFormData({ ...formData, campusLocation: e.target.value })}
              required
            />

            {/* Description */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                Description & Inclusions
              </label>
              <textarea
                rows={3}
                placeholder="Condition details, accessories included (cables, manuals, sheet bags)..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full p-3.5 rounded-2xl border border-slate-300 dark:border-dark-border bg-white dark:bg-dark-card text-xs sm:text-sm text-slate-900 dark:text-white"
              />
            </div>

            {/* Photos */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                  Photos ({formData.images.length})
                </label>
                <span className="text-[11px] text-brand-600 dark:text-brand-400 font-semibold">
                  Powered by Firebase Cloud Storage
                </span>
              </div>
              
              {/* Direct File Upload & URL Paste Options */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {/* 1. Device File Upload via Firebase */}
                <label className="relative flex items-center justify-center gap-2 p-3 rounded-2xl border-2 border-dashed border-brand-400/50 hover:border-brand-500 bg-brand-50/50 dark:bg-brand-950/20 hover:bg-brand-50 text-brand-700 dark:text-brand-300 text-xs font-bold cursor-pointer transition-all">
                  <Upload className="w-4 h-4" />
                  <span>{isUploading ? `Uploading (${uploadProgress}%)...` : 'Upload from Device'}</span>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    disabled={isUploading}
                    onChange={handleFileUpload}
                    className="sr-only"
                  />
                </label>

                {/* 2. URL Input */}
                <div className="flex gap-2">
                  <input
                    type="url"
                    placeholder="or paste image URL (https://...)"
                    value={newImageUrl}
                    onChange={(e) => setNewImageUrl(e.target.value)}
                    className="flex-1 px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-dark-border bg-white dark:bg-dark-card text-xs"
                  />
                  <Button variant="secondary" size="sm" type="button" onClick={() => handleAddImage()}>
                    Add
                  </Button>
                </div>
              </div>

              {/* Upload Progress Bar */}
              {isUploading && (
                <div className="w-full bg-slate-200 dark:bg-dark-border rounded-full h-2 overflow-hidden">
                  <div 
                    className="bg-brand-600 h-2 transition-all duration-200"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
              )}

              {/* Photo Previews */}
              <div className="flex items-center gap-2 overflow-x-auto pb-1">
                {formData.images.map((img, idx) => (
                  <div key={idx} className="relative w-16 h-16 rounded-xl overflow-hidden border border-slate-200 dark:border-dark-border flex-shrink-0 group shadow-xs">
                    <img src={img} alt={`Upload ${idx}`} className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(idx)}
                      className="absolute top-1 right-1 p-1 rounded-full bg-rose-600 text-white opacity-90 hover:opacity-100 transition-opacity"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              variant="gradient"
              size="lg"
              className="w-full font-black shadow-glow text-base"
              isLoading={isCreating}
              icon={Sparkles}
              iconPosition="right"
            >
              Publish Item on Marketplace
            </Button>

          </form>
        </div>

        {/* Live Preview Card (5 Cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="sticky top-24 space-y-4">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Live Product Card Preview
            </p>

            <div className="glass-card rounded-3xl overflow-hidden border border-slate-200/80 dark:border-dark-border shadow-lg space-y-4 p-4">
              <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-800">
                <img
                  src={formData.images[0] || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600'}
                  alt="Preview"
                  className="w-full h-full object-cover"
                />
                <span className="absolute top-3 left-3 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-indigo-600 text-white shadow-xs">
                  {formData.enableHourlyRent || formData.enableDailyRent ? 'For Rent' : 'For Sale'}
                </span>
                <span className="absolute top-3 right-3 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-white/90 dark:bg-slate-900/90 text-slate-900 dark:text-white backdrop-blur-md">
                  {formData.category?.toUpperCase()}
                </span>
              </div>

              <div className="space-y-2">
                <h3 className="font-bold text-sm text-slate-900 dark:text-white line-clamp-1">
                  {formData.title || 'Item Name'}
                </h3>
                
                <div className="flex flex-wrap items-baseline gap-2 pt-1">
                  {formData.enableHourlyRent && (
                    <span className="text-sm font-black text-slate-900 dark:text-white">
                      ₹{formData.rentPricePerHour}/hr
                    </span>
                  )}
                  {formData.enableDailyRent && (
                    <span className="text-sm font-black text-brand-600 dark:text-brand-400">
                      ₹{formData.rentPricePerDay}/day
                    </span>
                  )}
                  {formData.enableBuy && (
                    <span className="text-sm font-black text-emerald-600 dark:text-emerald-400">
                      ₹{formData.buyPrice} Buy
                    </span>
                  )}
                </div>

                <div className="pt-2 border-t border-slate-100 dark:border-dark-border flex items-center justify-between text-xs text-slate-500">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-brand-500" />
                    <span className="truncate max-w-[140px]">{formData.campusLocation}</span>
                  </span>
                  <span className="font-semibold text-slate-700 dark:text-slate-300">{formData.condition}</span>
                </div>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-brand-50/60 dark:bg-brand-950/30 border border-brand-200/60 dark:border-brand-900/40 text-xs text-brand-900 dark:text-brand-300 space-y-1">
              <p className="font-bold">✨ Instant 5% Commission Payout</p>
              <p className="text-[11px] text-brand-700 dark:text-brand-400">
                You receive 95% of gross earnings directly to your registered UPI / Bank account upon order completion.
              </p>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};

export default SellItemPage;
