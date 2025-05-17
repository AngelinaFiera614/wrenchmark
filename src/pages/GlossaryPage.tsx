
import React, { useState } from 'react';
import { useGlossaryTerms } from '@/hooks/useGlossaryTerms';
import GlossaryFilter from '@/components/glossary/GlossaryFilter';
import GlossaryGrid from '@/components/glossary/GlossaryGrid';
import { Button } from '@/components/ui/button';
import { ArrowUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const GlossaryPage: React.FC = () => {
  const { 
    terms,
    isLoading,
    search,
    setSearch,
    categories,
    selectedCategories,
    setSelectedCategories
  } = useGlossaryTerms();

  const [showScrollTop, setShowScrollTop] = useState(false);

  const handleCategoryToggle = (category: string) => {
    if (selectedCategories.includes(category)) {
      setSelectedCategories(
        selectedCategories.filter((cat) => cat !== category)
      );
    } else {
      setSelectedCategories([...selectedCategories, category]);
    }
  };

  const handleClearFilters = () => {
    setSearch('');
    setSelectedCategories([]);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Listen for scroll events to show/hide the scroll-to-top button
  React.useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.pageYOffset > 400);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="container py-8 space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Motorcycle Glossary</h1>
        <p className="text-muted-foreground">
          Learn key motorcycle terminology, parts, mechanics, and rider slang
        </p>
      </div>

      <GlossaryFilter
        search={search}
        onSearchChange={setSearch}
        categories={categories}
        selectedCategories={selectedCategories}
        onCategoryToggle={handleCategoryToggle}
        onClearFilters={handleClearFilters}
      />

      <GlossaryGrid
        terms={terms}
        isLoading={isLoading}
        searchString={search}
      />

      <AnimatePresence>
        {showScrollTop && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="fixed bottom-6 right-6"
          >
            <Button
              size="icon"
              className="rounded-full bg-accent-teal text-background hover:bg-accent-teal/90 shadow-lg"
              onClick={scrollToTop}
            >
              <ArrowUp className="h-5 w-5" />
              <span className="sr-only">Scroll to top</span>
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default GlossaryPage;
