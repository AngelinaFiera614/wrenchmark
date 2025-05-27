
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
  Star,
  Users,
  Award,
  Zap
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { HeroSection, HeroContent, HeroTitle, HeroSubtitle, HeroActions } from '@/components/ui/hero-section';
import { PremiumCard, PremiumCardContent, PremiumCardHeader, PremiumCardTitle, PremiumCardDescription } from '@/components/ui/premium-card';
import { StatsCard } from '@/components/ui/stats-card';

const Index: React.FC = () => {
  const { user } = useAuth();
  
  return (
    <>
      <Helmet>
        <title>Wrenchmark - Your Motorcycle Reference App</title>
        <meta name="description" content="The ultimate motorcycle reference app built for riders, wrenchers, and learners." />
      </Helmet>
      
      {/* Enhanced Hero Section */}
      <HeroSection 
        variant="image" 
        overlay="heavy"
        backgroundImage="https://images.unsplash.com/photo-1558981285-6f0c94958bb6?q=80&w=1740&auto=format&fit=crop"
        className="relative overflow-hidden"
      >
        <HeroContent className="animate-fade-in">
          <div className="max-w-4xl mx-auto space-y-8">
            <HeroTitle className="text-display animate-scale-in-enhanced">
              WRENCHMARK
            </HeroTitle>
            <HeroSubtitle className="text-hero animate-slide-up">
              Ride Farther. Build Smarter.
            </HeroSubtitle>
            <p className="text-xl md:text-2xl text-secondary max-w-3xl mx-auto leading-relaxed animate-slide-up">
              The ultimate motorcycle reference app built for riders, wrenchers, and learners. 
              Access specs, manuals, and skills all in one place.
            </p>
            <HeroActions className="animate-slide-up">
              {!user ? (
                <>
                  <Button asChild size="lg" variant="teal" className="button-glow hover-scale-enhanced">
                    <Link to="/auth">Get Started</Link>
                  </Button>
                  <Button asChild size="lg" variant="outline" className="glass-morphism hover-scale-enhanced">
                    <Link to="/motorcycles">Browse Motorcycles</Link>
                  </Button>
                </>
              ) : (
                <>
                  <Button asChild size="lg" variant="teal" className="button-glow hover-scale-enhanced">
                    <Link to="/motorcycles">Browse Motorcycles</Link>
                  </Button>
                  <Button asChild size="lg" variant="outline" className="glass-morphism hover-scale-enhanced">
                    <Link to="/courses">Explore Courses</Link>
                  </Button>
                </>
              )}
            </HeroActions>
          </div>

          {/* Floating Stats Cards */}
          <div className="absolute top-20 right-8 hidden lg:block animate-float">
            <StatsCard
              variant="premium"
              icon={Users}
              title="Active Riders"
              value="25K+"
              className="w-48"
            />
          </div>
          <div className="absolute bottom-32 left-8 hidden lg:block animate-float" style={{animationDelay: '1s'}}>
            <StatsCard
              variant="premium"
              icon={Bike}
              title="Motorcycles"
              value="1,200+"
              className="w-48"
            />
          </div>
        </HeroContent>
      </HeroSection>

      {/* Enhanced Features Section */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-background via-background-alt to-background"></div>
        <div className="container max-w-7xl mx-auto px-4 relative z-10">
          <div className="text-center mb-16 space-y-6">
            <h2 className="text-4xl md:text-5xl font-black text-gradient-teal mb-6">
              Everything for Your Ride
            </h2>
            <p className="text-xl text-secondary-muted max-w-3xl mx-auto leading-relaxed">
              Wrenchmark helps riders, DIY mechanics, and motorcycle enthusiasts find the information they need.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <PremiumCard 
                key={index} 
                variant="premium" 
                interactive 
                glow="subtle"
                className="group hover:shadow-teal-glow-lg transition-all duration-500 animate-scale-in-enhanced"
                style={{animationDelay: `${index * 0.1}s`}}
              >
                <PremiumCardHeader>
                  <div className="flex items-center gap-4 mb-4">
                    <div className="p-3 rounded-xl bg-primary/20 border border-primary/30 group-hover:bg-primary/30 transition-colors">
                      <feature.icon className="w-6 h-6 text-primary" />
                    </div>
                    <PremiumCardTitle className="text-xl group-hover:text-gradient-teal transition-all duration-300">
                      {feature.title}
                    </PremiumCardTitle>
                  </div>
                  <PremiumCardDescription className="text-secondary-muted leading-relaxed">
                    {feature.description}
                  </PremiumCardDescription>
                </PremiumCardHeader>
                <PremiumCardContent className="pt-0">
                  <Button variant="ghost" asChild className="p-0 text-primary hover:text-primary-dark group gap-2 font-semibold">
                    <Link to={feature.link}>
                      <span>Learn more</span>
                      <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                    </Link>
                  </Button>
                </PremiumCardContent>
              </PremiumCard>
            ))}
          </div>
        </div>
      </section>

      {/* Enhanced Category Showcase */}
      <section className="py-20 relative">
        <div className="container max-w-7xl mx-auto px-4">
          <div className="text-center mb-16 space-y-6">
            <h2 className="text-4xl md:text-5xl font-black text-gradient mb-6">
              Explore Categories
            </h2>
            <p className="text-xl text-secondary-muted max-w-3xl mx-auto leading-relaxed">
              Find the information you need across our comprehensive motorcycle database.
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {categories.map((category, index) => (
              <Link to={category.link} key={index} className="group animate-scale-in-enhanced" style={{animationDelay: `${index * 0.1}s`}}>
                <PremiumCard 
                  variant="floating" 
                  interactive 
                  glow="subtle"
                  className="overflow-hidden hover:shadow-teal-glow-lg transition-all duration-500"
                >
                  <div className="relative">
                    <AspectRatio ratio={4/3}>
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-10"></div>
                      <div 
                        className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                        style={{ backgroundImage: `url(${category.image})` }}
                      ></div>
                    </AspectRatio>
                    <div className="absolute bottom-0 left-0 right-0 p-6 z-20">
                      <h3 className="text-xl md:text-2xl font-bold text-white flex items-center group-hover:text-primary transition-colors duration-300">
                        <category.icon className="w-5 h-5 mr-3" />
                        {category.title}
                      </h3>
                    </div>
                  </div>
                </PremiumCard>
              </Link>
            ))}
          </div>
        </div>
      </section>
      
      {/* Enhanced Learning Paths */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-primary/5"></div>
        <div className="container max-w-7xl mx-auto px-4 relative z-10">
          <div className="text-center mb-16 space-y-6">
            <h2 className="text-4xl md:text-5xl font-black text-gradient-teal mb-6">
              Learning Paths
            </h2>
            <p className="text-xl text-secondary-muted max-w-3xl mx-auto leading-relaxed">
              Build your skills from beginner to expert with structured learning paths.
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            {learningPaths.map((path, index) => (
              <PremiumCard 
                key={index} 
                variant="featured" 
                interactive 
                glow="medium"
                className="flex flex-col lg:flex-row overflow-hidden hover:shadow-teal-glow-lg transition-all duration-500 animate-scale-in-enhanced"
                style={{animationDelay: `${index * 0.2}s`}}
              >
                <div 
                  className="w-full lg:w-2/5 bg-cover bg-center relative overflow-hidden"
                  style={{ backgroundImage: `url(${path.image})` }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent"></div>
                  <div className="h-48 lg:h-full flex items-center justify-center relative z-10">
                    <Award className="w-12 h-12 text-primary opacity-80" />
                  </div>
                </div>
                <div className="w-full lg:w-3/5 p-8 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className={`px-3 py-1 text-xs font-bold rounded-full difficulty-${path.difficulty} tracking-wide uppercase`}>
                        Level {path.difficulty}
                      </div>
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                        <span className="text-sm font-semibold text-white">{path.rating}</span>
                      </div>
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-gradient-teal transition-all duration-300">
                      {path.title}
                    </h3>
                    <p className="text-secondary-muted leading-relaxed mb-6">
                      {path.description}
                    </p>
                  </div>
                  <Button asChild variant="teal" size="sm" className="self-start button-glow hover-scale-enhanced">
                    <Link to={path.link}>
                      View Path
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </PremiumCard>
            ))}
          </div>
          
          <div className="text-center mt-12">
            <Button asChild variant="teal" size="lg" className="button-glow hover-scale-enhanced">
              <Link to="/courses">View All Courses</Link>
            </Button>
          </div>
        </div>
      </section>
      
      {/* Enhanced CTA Section */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-background via-background-alt to-background z-0"></div>
        <div 
          className="absolute inset-0 z-[-1] opacity-30"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1525013066836-c6090f0ad9d8?q=80&w=1740&auto=format&fit=crop')", 
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        ></div>
        <div className="container max-w-6xl mx-auto px-4 relative z-10">
          <PremiumCard variant="featured" glow="strong" className="text-center p-12 lg:p-16">
            <div className="max-w-4xl mx-auto space-y-8">
              <div className="flex justify-center mb-6">
                <div className="p-4 rounded-full bg-primary/20 border border-primary/30">
                  <Zap className="w-12 h-12 text-primary" />
                </div>
              </div>
              <h2 className="text-4xl md:text-6xl font-black text-gradient-teal mb-8 leading-tight">
                Ready to Improve Your Ride?
              </h2>
              <p className="text-xl md:text-2xl text-secondary leading-relaxed max-w-3xl mx-auto">
                Join Wrenchmark today for access to comprehensive motorcycle data, repair guides, and community knowledge.
              </p>
              {!user ? (
                <div className="flex flex-col sm:flex-row gap-6 justify-center pt-8">
                  <Button asChild size="lg" variant="teal" className="button-glow hover-scale-enhanced text-lg px-8 py-4">
                    <Link to="/auth">Sign Up Now</Link>
                  </Button>
                  <Button asChild size="lg" variant="outline" className="glass-morphism hover-scale-enhanced text-lg px-8 py-4">
                    <Link to="/motorcycles">Explore Motorcycles</Link>
                  </Button>
                </div>
              ) : (
                <div className="flex flex-col sm:flex-row gap-6 justify-center pt-8">
                  <Button asChild size="lg" variant="teal" className="button-glow hover-scale-enhanced text-lg px-8 py-4">
                    <Link to="/profile">Go to Profile</Link>
                  </Button>
                  <Button asChild size="lg" variant="outline" className="glass-morphism hover-scale-enhanced text-lg px-8 py-4">
                    <Link to="/motorcycles">Explore Motorcycles</Link>
                  </Button>
                </div>
              )}
            </div>
          </PremiumCard>
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
