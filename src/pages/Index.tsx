
import React from 'react';
import { Helmet } from 'react-helmet-async';
import HeroSection from '@/components/home/HeroSection';
import FeaturesSection from '@/components/home/FeaturesSection';
import CategoryShowcase from '@/components/home/CategoryShowcase';
import LearningPathsSection from '@/components/home/LearningPathsSection';
import CTASection from '@/components/home/CTASection';

const Index: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>Wrenchmark - Your Motorcycle Reference App</title>
        <meta name="description" content="The ultimate motorcycle reference app built for riders, wrenchers, and learners." />
      </Helmet>
      
      <HeroSection />
      <FeaturesSection />
      <CategoryShowcase />
      <LearningPathsSection />
      <CTASection />
    </>
  );
};

export default Index;
