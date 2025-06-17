
import React from 'react';
import { Helmet } from 'react-helmet-async';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  User, 
  Heart, 
  Code, 
  Palette, 
  Wrench, 
  Users, 
  MessageSquare, 
  ExternalLink,
  Target,
  Lightbulb
} from 'lucide-react';

const About: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>About | Wrenchmark</title>
        <meta name="description" content="Learn about the creator behind Wrenchmark and how you can contribute to building the ultimate motorcycle reference app." />
      </Helmet>
      
      <Layout>
        <div className="container mx-auto px-4 py-8">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-foreground mb-4">About Wrenchmark</h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Built by a UI/UX nerd who fell in love with motorcycles and wanted to create the ultimate reference app for riders, wrenchers, and learners.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
            {/* Personal Story */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5 text-accent-teal" />
                  The Creator
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                  Hi! I'm a design and development nerd who's passionate about creating intuitive, beautiful interfaces. 
                  When I got into motorcycles, I realized there wasn't a comprehensive, user-friendly resource that brought 
                  together specs, learning materials, and practical guidance in one place.
                </p>
                <p className="text-muted-foreground">
                  As someone who learns best through structured, visual information, I wanted to build something that would 
                  help both beginners and experienced riders navigate the world of motorcycles with confidence.
                </p>
                <div className="flex flex-wrap gap-2 mt-4">
                  <Badge variant="outline" className="flex items-center gap-1">
                    <Palette className="h-3 w-3" />
                    UI/UX Design
                  </Badge>
                  <Badge variant="outline" className="flex items-center gap-1">
                    <Code className="h-3 w-3" />
                    Frontend Development
                  </Badge>
                  <Badge variant="outline" className="flex items-center gap-1">
                    <Heart className="h-3 w-3" />
                    Motorcycle Enthusiast
                  </Badge>
                </div>
              </CardContent>
            </Card>

            {/* Project Vision */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-accent-teal" />
                  The Vision
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                  Wrenchmark is designed to be the comprehensive reference app I wished existed when I started learning about motorcycles. 
                  It combines detailed specifications, learning resources, and practical guidance in a clean, accessible interface.
                </p>
                <p className="text-muted-foreground">
                  The goal is simple: <span className="text-accent-teal font-medium">Ride Farther. Build Smarter.</span> 
                  Whether you're choosing your first bike, comparing models, or learning maintenance skills, 
                  Wrenchmark should be your trusted companion.
                </p>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <Wrench className="h-4 w-4 text-accent-teal" />
                    <span>Comprehensive motorcycle database</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Lightbulb className="h-4 w-4 text-accent-teal" />
                    <span>Structured learning paths</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Users className="h-4 w-4 text-accent-teal" />
                    <span>Community-driven content</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Call to Action Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            {/* User Feedback */}
            <Card className="border-accent-teal/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5 text-accent-teal" />
                  Share Your Feedback
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                  Help shape the future of Wrenchmark! Take our quick survey to share your motorcycle experience, 
                  what features you'd like to see, and how we can better serve the riding community.
                </p>
                <Button 
                  variant="teal" 
                  className="w-full"
                  onClick={() => window.open('https://forms.gle/motorcycle-survey', '_blank')}
                >
                  Take the Survey
                  <ExternalLink className="h-4 w-4 ml-2" />
                </Button>
              </CardContent>
            </Card>

            {/* Contributor Application */}
            <Card className="border-accent-teal/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-accent-teal" />
                  Become a Contributor
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                  Are you passionate about motorcycles and have expertise to share? Join our team of contributors 
                  and help build the most comprehensive motorcycle reference resource.
                </p>
                <Button 
                  variant="outline" 
                  className="w-full border-accent-teal text-accent-teal hover:bg-accent-teal hover:text-black"
                  onClick={() => window.open('https://forms.gle/contributor-application', '_blank')}
                >
                  Apply to Contribute
                  <ExternalLink className="h-4 w-4 ml-2" />
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Technical Philosophy */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Code className="h-5 w-5 text-accent-teal" />
                Technical Approach
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                Wrenchmark is built with modern web technologies, prioritizing performance, accessibility, and user experience. 
                The dark theme with teal accents reflects the technical precision of motorcycles while maintaining readability and style.
              </p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                <div className="text-center p-4 bg-accent-teal/10 rounded-lg">
                  <h4 className="font-medium text-accent-teal">React</h4>
                  <p className="text-xs text-muted-foreground mt-1">Modern UI</p>
                </div>
                <div className="text-center p-4 bg-accent-teal/10 rounded-lg">
                  <h4 className="font-medium text-accent-teal">TypeScript</h4>
                  <p className="text-xs text-muted-foreground mt-1">Type Safety</p>
                </div>
                <div className="text-center p-4 bg-accent-teal/10 rounded-lg">
                  <h4 className="font-medium text-accent-teal">Tailwind</h4>
                  <p className="text-xs text-muted-foreground mt-1">Responsive Design</p>
                </div>
                <div className="text-center p-4 bg-accent-teal/10 rounded-lg">
                  <h4 className="font-medium text-accent-teal">Supabase</h4>
                  <p className="text-xs text-muted-foreground mt-1">Backend Services</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Future Goals */}
          <div className="text-center mt-12 p-8 bg-accent-teal/5 rounded-lg">
            <h3 className="text-2xl font-bold text-foreground mb-4">The Road Ahead</h3>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              This is just the beginning. With community input and collaborative effort, Wrenchmark will evolve 
              into the definitive resource for motorcycle enthusiasts worldwide. Every feature, every piece of data, 
              and every learning resource is designed with one goal: empowering riders to make informed decisions 
              and build their skills with confidence.
            </p>
          </div>
        </div>
      </Layout>
    </>
  );
};

export default About;
