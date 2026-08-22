import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { 
  BookOpen, 
  Calculator, 
  FlaskConical, 
  Smartphone, 
  Laptop, 
  Armchair, 
  Home, 
  Trophy, 
  Bike, 
  Shirt, 
  FileText, 
  PenTool, 
  Package, 
  ArrowRight,
  Sparkles
} from 'lucide-react';
import { fetchCategories } from '../../redux/slices/itemSlice';

export const CategoriesPage = () => {
  const dispatch = useDispatch();
  const { categories, isLoading } = useSelector((state) => state.items);

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  const iconMap = {
    BookOpen,
    Calculator,
    FlaskConical,
    Smartphone,
    Laptop,
    Armchair,
    Home,
    Trophy,
    Bike,
    Shirt,
    FileText,
    PenTool,
    Package,
  };

  return (
    <div className="min-h-screen py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-10">
      
      {/* Header */}
      <div className="glass-card rounded-3xl p-8 sm:p-12 border border-slate-200/80 dark:border-dark-border text-center space-y-3">
        <span className="px-3.5 py-1 rounded-full text-xs font-bold bg-brand-100 dark:bg-brand-950/80 text-brand-700 dark:text-brand-300 border border-brand-200 dark:border-brand-900 inline-block">
          Campus Departments & Inventory
        </span>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white font-display">
          Marketplace Categories
        </h1>
        <p className="text-sm sm:text-base text-slate-500 dark:text-slate-400 max-w-2xl mx-auto">
          Find exactly what you need for this semester across 13 specialized college categories.
        </p>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {categories.map((cat, idx) => {
          const IconComponent = iconMap[cat.icon] || Package;
          return (
            <motion.div
              key={cat.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.04 }}
            >
              <Link
                to={`/browse?category=${cat.id}`}
                className="group h-full flex flex-col justify-between glass-card rounded-3xl p-6 border border-slate-200/80 dark:border-dark-border hover:border-brand-500/50 hover:shadow-xl transition-all text-left"
              >
                <div className="space-y-4">
                  <div className="w-14 h-14 rounded-2xl bg-brand-50 dark:bg-brand-950/80 text-brand-600 dark:text-brand-400 flex items-center justify-center group-hover:scale-110 group-hover:bg-brand-600 group-hover:text-white transition-all shadow-soft">
                    <IconComponent className="w-7 h-7" />
                  </div>

                  <div className="space-y-1">
                    <h3 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
                      {cat.name}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2">
                      {cat.description}
                    </p>
                  </div>
                </div>

                <div className="pt-4 mt-4 border-t border-slate-100 dark:border-dark-border flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-400 dark:text-slate-500">
                    {cat.itemCount || 0} active listings
                  </span>
                  <span className="font-bold text-brand-600 dark:text-brand-400 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                    Explore <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </Link>
            </motion.div>
          );
        })}
      </div>

    </div>
  );
};

export default CategoriesPage;
