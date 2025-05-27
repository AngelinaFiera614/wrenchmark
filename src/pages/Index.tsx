
import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { useAuth } from '@/context/auth';
import { 
  Bike, 
  BookOpen, 
  GraduationCap, 
  Wrench, 
  Shield, 
  BookText, 
  ArrowRight, 
  Star
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { AspectRatio } from '@/components/ui/aspect-ratio';

const Index: React.FC = () => {
  const { user } = useAuth();
  
  return (
    <>
      <Helmet>
        <title>Wrenchmark - Your Motorcycle Reference App</title>
        <meta name="description" content="The ultimate motorcycle reference app built for riders, wrenchers, and learners." />
      </Helmet>
      
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 md:py-28">
        <div className="absolute inset-0 bg-gradient-to-b from-background/70 via-background/80 to-background z-0"></div>
        <div 
          className="absolute inset-0 z-[-1] opacity-20"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1558981285-6f0c94958bb6?q=80&w=1740&auto=format&fit=crop')", 
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        ></div>
        <div className="container max-w-6xl mx-auto px-4 relative z-10">
          <div className="flex flex-col md:flex-row items-center">
            <div className="w-full md:w-1/2 space-y-6 text-center md:text-left mb-10 md:mb-0">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight tracking-tight">
                <span className="text-gradient">Ride Farther.</span>
                <br />
                <span className="text-accent-teal">Build Smarter.</span>
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground max-w-lg">
                The ultimate motorcycle reference app built for riders, wrenchers, and learners. Access specs, manuals, and skills all in one place.
              </p>
              <div className="flex flex-wrap gap-4 justify-center md:justify-start">
                {!user ? (
                  <>
                    <Button asChild size="lg" variant="teal">
                      <Link to="/auth">Get Started</Link>
                    </Button>
                    <Button asChild size="lg" variant="outline">
                      <Link to="/motorcycles">Browse Motorcycles</Link>
                    </Button>
                  </>
                ) : (
                  <>
                    <Button asChild size="lg" variant="teal">
                      <Link to="/motorcycles">Browse Motorcycles</Link>
                    </Button>
                    <Button asChild size="lg" variant="outline">
                      <Link to="/courses">Explore Courses</Link>
                    </Button>
                  </>
                )}
              </div>
            </div>
            <div className="w-full md:w-1/2 flex justify-center md:justify-end animate-fade-in">
              <div className="w-full max-w-md glass-morphism rounded-lg overflow-hidden shadow-xl">
                <img 
                  src="https://images.unsplash.com/photo-1622185135505-2d795003994a?q=80&w=1740&auto=format&fit=crop" 
                  alt="Motorcycle"
                  className="w-full h-auto"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-secondary/30">
        <div className="container max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Everything for Your Ride</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Wrenchmark helps riders, DIY mechanics, and motorcycle enthusiasts find the information they need.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="border-border bg-card shadow-md hover:shadow-lg transition-shadow">
                <CardContent className="pt-6">
                  <div className="rounded-full bg-accent-teal/10 w-12 h-12 flex items-center justify-center mb-4">
                    <feature.icon className="w-6 h-6 text-accent-teal" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
                <CardFooter>
                  <Button variant="ghost" asChild className="p-0 text-accent-teal hover:text-accent-teal group gap-1">
                    <Link to={feature.link}>
                      <span>Learn more</span>
                      <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Category Showcase */}
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
      
      {/* Learning Paths */}
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
      
      {/* CTA Section */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-background to-background/95 z-0"></div>
        <div 
          className="absolute inset-0 z-[-1] opacity-20"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1525013066836-c6090f0ad9d8?q=80&w=1740&auto=format&fit=crop')", 
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        ></div>
        <div className="container max-w-6xl mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Improve Your Ride?</h2>
            <p className="text-xl text-muted-foreground mb-8">
              Join Wrenchmark today for access to comprehensive motorcycle data, repair guides, and community knowledge.
            </p>
            {!user ? (
              <div className="flex flex-wrap gap-4 justify-center">
                <Button asChild size="lg" variant="teal">
                  <Link to="/auth">Sign Up Now</Link>
                </Button>
                <Button asChild size="lg" variant="outline">
                  <Link to="/motorcycles">Explore Motorcycles</Link>
                </Button>
              </div>
            ) : (
              <div className="flex flex-wrap gap-4 justify-center">
                <Button asChild size="lg" variant="teal">
                  <Link to="/profile">Go to Profile</Link>
                </Button>
                <Button asChild size="lg" variant="outline">
                  <Link to="/motorcycles">Explore Motorcycles</Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  );
};

// Features data
const features = [
  {
    icon: Bike,
    title: 'Comprehensive Database',
    description: 'Access specs, dimensions, and features for hundreds of motorcycle models.',
    link: '/motorcycles'
  },
  {
    icon: Wrench,
    title: 'Maintenance Guides',
    description: 'Step-by-step instructions for maintaining and repairing your motorcycle.',
    link: '/manuals'
  },
  {
    icon: GraduationCap,
    title: 'Skill Development',
    description: 'Learn essential riding techniques and mechanical skills through structured courses.',
    link: '/courses'
  },
  {
    icon: BookText,
    title: 'Digital Manuals',
    description: 'Search across service manuals, owner guides, and parts catalogs.',
    link: '/manuals'
  },
  {
    icon: Shield,
    title: 'Safety Information',
    description: 'Get up-to-date safety recommendations and tips for responsible riding.',
    link: '/courses'
  },
  {
    icon: BookOpen,
    title: 'Technical Glossary',
    description: 'Learn motorcycle terminology with our comprehensive glossary.',
    link: '/glossary'
  }
];

// Categories data
const categories = [
  {
    title: 'Motorcycles',
    icon: Bike,
    image: 'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?q=80&w=1170&auto=format&fit=crop',
    link: '/motorcycles'
  },
  {
    title: 'Courses',
    icon: GraduationCap,
    image: 'https://images.unsplash.com/photo-1534992711916-f4975699e8e9?q=80&w=1170&auto=format&fit=crop',
    link: '/courses'
  },
  {
    title: 'Manuals',
    icon: BookText,
    image: 'https://images.unsplash.com/photo-1526142684086-7ebd69df27a5?q=80&w=1170&auto=format&fit=crop',
    link: '/manuals'
  },
  {
    title: 'Glossary',
    icon: BookOpen,
    image: 'https://images.unsplash.com/photo-1607344645866-009c320b63e0?q=80&w=1170&auto=format&fit=crop',
    link: '/glossary'
  }
];

// Learning Paths data
const learningPaths = [
  {
    title: 'Motorcycle Maintenance Basics',
    description: 'Learn essential maintenance skills every rider should know to keep their bike in peak condition.',
    image: 'https://images.unsplash.com/photo-1565043589221-2b3b9a8b7eca?q=80&w=1170&auto=format&fit=crop',
    difficulty: 1,
    rating: 4.9,
    link: '/courses'
  },
  {
    title: 'Advanced Riding Techniques',
    description: 'Master cornering, emergency braking, and other advanced skills for safer, more confident riding.',
    image: 'https://images.unsplash.com/photo-1637368344744-cf076e2887e8?q=80&w=1170&auto=format&fit=crop',
    difficulty: 3,
    rating: 4.7,
    link: '/courses'
  }
];

export default Index;
