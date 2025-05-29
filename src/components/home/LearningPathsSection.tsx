
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Star } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { learningPaths } from './data/learningPathsData';

const LearningPathsSection: React.FC = () => {
  return (
    <section className="py-16 bg-accent-teal/5">
      <div className="container max-w-6xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Learning Paths</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Build your skills from beginner to expert with structured learning paths.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {learningPaths.map((path, index) => (
            <Card key={index} className="flex flex-col md:flex-row overflow-hidden border-border hover:border-accent-teal/50 transition-colors">
              <div 
                className="w-full md:w-1/3 bg-cover bg-center"
                style={{ backgroundImage: `url(${path.image})` }}
              >
                <div className="h-40 md:h-full"></div>
              </div>
              <div className="w-full md:w-2/3 p-6">
                <div className="flex items-center mb-2">
                  <div className={`px-2 py-0.5 text-xs font-medium rounded difficulty-${path.difficulty}`}>
                    Level {path.difficulty}
                  </div>
                  <div className="ml-auto flex items-center">
                    <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                    <span className="ml-1 text-sm">{path.rating}</span>
                  </div>
                </div>
                <h3 className="text-xl font-semibold mb-2">{path.title}</h3>
                <p className="text-sm text-muted-foreground mb-4">{path.description}</p>
                <Button asChild variant="outline" size="sm" className="mt-auto">
                  <Link to={path.link}>
                    View Path
                    <ArrowRight className="ml-1 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </Card>
          ))}
        </div>
        
        <div className="text-center mt-10">
          <Button asChild variant="teal">
            <Link to="/courses">View All Courses</Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default LearningPathsSection;
