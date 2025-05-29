
import React from 'react';
import { Link } from 'react-router-dom';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { categories } from './data/categoriesData';

const CategoryShowcase: React.FC = () => {
  return (
    <section className="py-16">
      <div className="container max-w-6xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Explore Categories</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Find the information you need across our comprehensive motorcycle database.
          </p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((category, index) => (
            <Link to={category.link} key={index} className="group">
              <div className="relative overflow-hidden rounded-lg shadow-md group-hover:shadow-lg transition-all duration-300">
                <AspectRatio ratio={4/3}>
                  <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent z-10"></div>
                  <div 
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                    style={{ backgroundImage: `url(${category.image})` }}
                  ></div>
                </AspectRatio>
                <div className="absolute bottom-0 left-0 right-0 p-4 z-20">
                  <h3 className="text-xl font-semibold text-white flex items-center">
                    <category.icon className="w-5 h-5 mr-2" />
                    {category.title}
                  </h3>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategoryShowcase;
