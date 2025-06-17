
import React from 'react';
import { Helmet } from 'react-helmet-async';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Target } from 'lucide-react';

const RidingSkillsPage: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>Riding Skills | Wrenchmark</title>
      </Helmet>
      
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-foreground mb-4">Riding Skills</h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Master essential riding techniques and improve your motorcycle handling skills with expert guidance.
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                Skill Development
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <Target className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium text-foreground mb-2">Skills Training Coming Soon</h3>
                <p className="text-muted-foreground">
                  Interactive riding skills training and practice exercises are in development. Ride Farther. Build Smarter.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </Layout>
    </>
  );
};

export default RidingSkillsPage;
