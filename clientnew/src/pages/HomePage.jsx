import React from 'react';
import HeroSection from '../components/landing/HeroSection';
import RecentItemsSection from '../components/landing/RecentItemsSection';
import CategoriesSection from '../components/landing/CategoriesSection';
import FeaturesSection from '../components/landing/FeaturesSection';
import HowItWorksSection from '../components/landing/HowItWorksSection';
import StatsSection from '../components/landing/StatsSection';
import TestimonialsSection from '../components/landing/TestimonialsSection';
import FaqSection from '../components/landing/FaqSection';

export const HomePage = () => {
  return (
    <div className="flex flex-col min-h-screen">
      {/* 1. Hero Section */}
      <HeroSection />

      {/* 2. LIVE RECENT ITEMS (Surfaced immediately at top as requested) */}
      <RecentItemsSection />

      {/* 3. Categories Grid */}
      <div id="categories">
        <CategoriesSection />
      </div>

      {/* 4. Features Grid */}
      <FeaturesSection />

      {/* 5. How It Works Timeline */}
      <div id="how-it-works">
        <HowItWorksSection />
      </div>

      {/* 6. Animated Statistics Counters */}
      <StatsSection />

      {/* 7. Student Testimonials */}
      <TestimonialsSection />

      {/* 8. Interactive FAQ Accordion */}
      <div id="faq">
        <FaqSection />
      </div>
    </div>
  );
};

export default HomePage;
