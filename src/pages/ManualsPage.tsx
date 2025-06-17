
import React from 'react';
import { Helmet } from 'react-helmet-async';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BookOpen } from 'lucide-react';

const ManualsPage: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>Service Manuals | Wrenchmark</title>
      </Helmet>
      
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-foreground mb-4">Service Manuals</h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Access comprehensive service manuals and technical documentation for motorcycle maintenance and repair.
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                Manual Library
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium text-foreground mb-2">Manual Library Coming Soon</h3>
                <p className="text-muted-foreground">
                  We're building a comprehensive collection of service manuals, repair guides, and technical documentation. Stay tuned!
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </Layout>
    </>
  );
};

export default ManualsPage;
