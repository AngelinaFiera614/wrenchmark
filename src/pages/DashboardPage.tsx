
import React from 'react';
import { Helmet } from 'react-helmet-async';
import Layout from '@/components/layout/Layout';
import { useAuth } from '@/context/auth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { 
  Heart, 
  BookOpen, 
  BarChart3, 
  Settings, 
  Plus,
  TrendingUp,
  Award,
  Clock
} from 'lucide-react';
import UserFavorites from '@/components/dashboard/UserFavorites';
import UserComparisonLists from '@/components/dashboard/UserComparisonLists';
import CourseProgress from '@/components/dashboard/CourseProgress';
import UserStats from '@/components/dashboard/UserStats';

const DashboardPage: React.FC = () => {
  const { user, profile } = useAuth();

  if (!user) {
    return (
      <>
        <Helmet>
          <title>Dashboard | Wrenchmark</title>
        </Helmet>
        
        <Layout>
          <div className="container mx-auto px-4 py-8 text-center">
            <h1 className="text-3xl font-bold text-foreground mb-4">Access Your Dashboard</h1>
            <p className="text-muted-foreground mb-6">Sign in to view your personal dashboard</p>
            <Link to="/login">
              <Button className="bg-accent-teal hover:bg-accent-teal/90 text-black">
                Sign In
              </Button>
            </Link>
          </div>
        </Layout>
      </>
    );
  }

  return (
    <>
      <Helmet>
        <title>My Dashboard | Wrenchmark</title>
      </Helmet>
      
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-7xl mx-auto space-y-8">
            {/* Header */}
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold text-foreground mb-2">
                  Welcome back, {profile?.username || user.email?.split('@')[0]}!
                </h1>
                <p className="text-muted-foreground">Your personal motorcycle hub</p>
              </div>
              <Link to="/profile">
                <Button variant="outline" className="border-accent-teal text-accent-teal hover:bg-accent-teal/10">
                  <Settings className="h-4 w-4 mr-2" />
                  Settings
                </Button>
              </Link>
            </div>

            {/* Quick Stats */}
            <UserStats />

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left Column - Favorites & Progress */}
              <div className="lg:col-span-2 space-y-6">
                {/* Favorites Section */}
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <Heart className="h-5 w-5 text-accent-teal" />
                      My Favorites
                    </CardTitle>
                    <Link to="/motorcycles">
                      <Button variant="ghost" size="sm">
                        <Plus className="h-4 w-4 mr-1" />
                        Add More
                      </Button>
                    </Link>
                  </CardHeader>
                  <CardContent>
                    <UserFavorites limit={6} />
                  </CardContent>
                </Card>

                {/* Course Progress */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BookOpen className="h-5 w-5 text-accent-teal" />
                      Learning Progress
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CourseProgress />
                  </CardContent>
                </Card>
              </div>

              {/* Right Column - Comparison Lists & Quick Actions */}
              <div className="space-y-6">
                {/* Comparison Lists */}
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <BarChart3 className="h-5 w-5 text-accent-teal" />
                      My Lists
                    </CardTitle>
                    <Link to="/compare">
                      <Button variant="ghost" size="sm">
                        <Plus className="h-4 w-4 mr-1" />
                        New List
                      </Button>
                    </Link>
                  </CardHeader>
                  <CardContent>
                    <UserComparisonLists limit={5} />
                  </CardContent>
                </Card>

                {/* Quick Actions */}
                <Card>
                  <CardHeader>
                    <CardTitle>Quick Actions</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Link to="/motorcycles" className="block">
                      <Button variant="outline" className="w-full justify-start">
                        <TrendingUp className="h-4 w-4 mr-2" />
                        Explore Motorcycles
                      </Button>
                    </Link>
                    <Link to="/courses" className="block">
                      <Button variant="outline" className="w-full justify-start">
                        <Award className="h-4 w-4 mr-2" />
                        Continue Learning
                      </Button>
                    </Link>
                    <Link to="/glossary" className="block">
                      <Button variant="outline" className="w-full justify-start">
                        <Clock className="h-4 w-4 mr-2" />
                        Study Glossary
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    </>
  );
};

export default DashboardPage;
