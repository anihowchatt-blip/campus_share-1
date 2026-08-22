import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Filter, 
  SlidersHorizontal, 
  Search, 
  ArrowUpDown, 
  X, 
  Tag, 
  Sparkles,
  Layers,
  ChevronDown
} from 'lucide-react';
import ProductCard from '../../components/common/ProductCard';
import Button from '../../components/common/Button';
import Select from '../../components/common/Select';
import { CATEGORIES } from '../../utils/categories';
import api from '../../services/api';

export const BrowsePage = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Filters from Query or State
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [category, setCategory] = useState(searchParams.get('category') || 'all');
  const [subcategory, setSubcategory] = useState(searchParams.get('subcategory') || 'all');
  const [availability, setAvailability] = useState('all'); // 'all' | 'rent' | 'buy'
  const [duration, setDuration] = useState('all'); // 'all' | 'hourly' | 'daily'
  const [condition, setCondition] = useState('all');
  const [minRating, setMinRating] = useState('0');
  const [maxPrice, setMaxPrice] = useState('15000');
  const [sort, setSort] = useState('newest');

  const selectedCategoryObj = CATEGORIES.find((c) => c.id === category);

  const fetchItems = async () => {
    try {
      setIsLoading(true);
      const params = {
        sort,
      };

      if (search.trim()) params.search = search.trim();
      if (category !== 'all') params.category = category;
      if (subcategory !== 'all') params.subcategory = subcategory;
      if (availability !== 'all') params.availability = availability;
      if (duration !== 'all') params.rentalDurationType = duration;
      if (condition !== 'all') params.condition = condition;
      if (minRating !== '0') params.minRating = minRating;
      if (maxPrice) params.maxPrice = maxPrice;

      const res = await api.get('/items', { params });
      setItems(res.data?.items || []);
    } catch (err) {
      setItems([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, [category, subcategory, availability, duration, condition, minRating, maxPrice, sort]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchItems();
  };

  const handleResetFilters = () => {
    setSearch('');
    setCategory('all');
    setSubcategory('all');
    setAvailability('all');
    setDuration('all');
    setCondition('all');
    setMinRating('0');
    setMaxPrice('15000');
    setSort('newest');
  };

  const sortOptions = [
    { value: 'newest', label: '⚡ Newest Listed' },
    { value: 'price_asc', label: '💵 Price: Low to High' },
    { value: 'price_desc', label: '💎 Price: High to Low' },
    { value: 'best_rated', label: '⭐ Best Rated' },
    { value: 'most_rented', label: '🔥 Most Rented' },
  ];

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8 text-left">
      
      {/* Top Header & Search Bar */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white font-display">
              Campus Marketplace & Rentals
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              Browse products available for hourly/daily rent and permanent purchase.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="lg:hidden text-xs font-bold"
              icon={Filter}
              onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
            >
              Filters
            </Button>

            <div className="w-48">
              <Select
                options={sortOptions}
                value={sort}
                onChange={(e) => setSort(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Global Search Bar in page */}
        <form onSubmit={handleSearchSubmit} className="relative">
          <input
            type="text"
            placeholder="Search all listings by title, subject, brand, or department..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-24 py-3 rounded-2xl border border-slate-200 dark:border-dark-border bg-white dark:bg-dark-card text-xs sm:text-sm text-slate-900 dark:text-white"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <Button type="submit" variant="primary" size="sm" className="absolute right-2 top-1/2 -translate-y-1/2 text-xs font-bold">
            Search
          </Button>
        </form>
      </div>

      {/* Main Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Filter Sidebar (3 cols) */}
        <div className={`lg:col-span-3 space-y-6 ${mobileFilterOpen ? 'block' : 'hidden lg:block'}`}>
          <div className="glass-card rounded-3xl p-6 border border-slate-200/80 dark:border-dark-border space-y-6 shadow-sm">
            
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-dark-border">
              <h3 className="font-extrabold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-brand-500" /> Filters
              </h3>
              <button
                onClick={handleResetFilters}
                className="text-[11px] font-bold text-brand-600 hover:underline"
              >
                Reset All
              </button>
            </div>

            {/* Category Select */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                Department / Category
              </label>
              <select
                value={category}
                onChange={(e) => {
                  setCategory(e.target.value);
                  setSubcategory('all');
                }}
                className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-dark-border bg-white dark:bg-dark-card text-xs text-slate-900 dark:text-white"
              >
                <option value="all">⚡ All 18 Categories</option>
                {CATEGORIES.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.emoji} {c.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Subcategory */}
            {selectedCategoryObj && selectedCategoryObj.subcategories.length > 0 && (
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                  Subcategory
                </label>
                <select
                  value={subcategory}
                  onChange={(e) => setSubcategory(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-dark-border bg-white dark:bg-dark-card text-xs text-slate-900 dark:text-white"
                >
                  <option value="all">All Subcategories</option>
                  {selectedCategoryObj.subcategories.map((sub, idx) => (
                    <option key={idx} value={sub}>{sub}</option>
                  ))}
                </select>
              </div>
            )}

            {/* Availability Mode */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                Rent / Buy Type
              </label>
              <div className="grid grid-cols-3 gap-1.5 p-1 bg-slate-100 dark:bg-slate-800/60 rounded-xl">
                {['all', 'rent', 'buy'].map((opt) => (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => setAvailability(opt)}
                    className={`py-1.5 rounded-lg text-xs font-bold transition-all capitalize ${
                      availability === opt
                        ? 'bg-white dark:bg-slate-700 text-brand-600 dark:text-brand-400 shadow-xs'
                        : 'text-slate-500 hover:text-slate-900'
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>

            {/* Duration Type */}
            {availability !== 'buy' && (
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                  Rental Duration
                </label>
                <div className="grid grid-cols-3 gap-1.5 p-1 bg-slate-100 dark:bg-slate-800/60 rounded-xl">
                  {['all', 'hourly', 'daily'].map((dur) => (
                    <button
                      key={dur}
                      type="button"
                      onClick={() => setDuration(dur)}
                      className={`py-1.5 rounded-lg text-xs font-bold transition-all capitalize ${
                        duration === dur
                          ? 'bg-white dark:bg-slate-700 text-brand-600 dark:text-brand-400 shadow-xs'
                          : 'text-slate-500 hover:text-slate-900'
                      }`}
                    >
                      {dur}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Max Price Slider */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs font-bold">
                <span className="uppercase tracking-wider text-slate-700 dark:text-slate-300">Max Price</span>
                <span className="text-brand-600 dark:text-brand-400 font-extrabold">₹{Number(maxPrice).toLocaleString()}</span>
              </div>
              <input
                type="range"
                min="50"
                max="20000"
                step="50"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                className="w-full accent-brand-600"
              />
            </div>

            {/* Condition */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                Condition
              </label>
              <select
                value={condition}
                onChange={(e) => setCondition(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-dark-border bg-white dark:bg-dark-card text-xs text-slate-900 dark:text-white"
              >
                <option value="all">Any Condition</option>
                <option value="new">Brand New</option>
                <option value="like-new">Like New</option>
                <option value="good">Good</option>
                <option value="fair">Fair</option>
              </select>
            </div>

            {/* Minimum Rating */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                Minimum Rating
              </label>
              <div className="space-y-1.5">
                {[4, 3, 2, 0].map((star) => (
                  <label
                    key={star}
                    className="flex items-center gap-2 text-xs font-semibold text-slate-700 dark:text-slate-300 cursor-pointer"
                  >
                    <input
                      type="radio"
                      name="browseRating"
                      checked={minRating === star.toString()}
                      onChange={() => setMinRating(star.toString())}
                      className="text-brand-600"
                    />
                    <span>{star === 0 ? 'All Ratings' : `${star}★ & above`}</span>
                  </label>
                ))}
              </div>
            </div>

          </div>
        </div>

        {/* Product Cards Grid (9 cols) */}
        <div className="lg:col-span-9 space-y-4">
          <div className="flex items-center justify-between text-xs text-slate-500 pb-1">
            <span>
              Showing <strong className="text-slate-900 dark:text-white">{items.length}</strong> listings
            </span>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((n) => (
                <div key={n} className="aspect-[4/5] rounded-3xl bg-slate-200/70 dark:bg-slate-800/60 animate-pulse" />
              ))}
            </div>
          ) : items.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {items.map((item, idx) => (
                <motion.div
                  key={item._id || item.id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.03 }}
                >
                  <ProductCard item={item} />
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="glass-card rounded-3xl p-12 text-center space-y-4 border border-slate-200/80 dark:border-dark-border max-w-md mx-auto">
              <Tag className="w-12 h-12 text-slate-400 mx-auto" />
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  No items found matching your filters
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Try adjusting your price range, category, or search keywords.
                </p>
              </div>
              <Button variant="outline" size="sm" onClick={handleResetFilters}>
                Clear All Filters
              </Button>
            </div>
          )}
        </div>

      </div>

    </div>
  );
};

export default BrowsePage;
