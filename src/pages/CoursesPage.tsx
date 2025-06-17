
import React from 'react';
import { Helmet } from 'react-helmet-async';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { GraduationCap } from 'lucide-react';

const CoursesPage: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>Courses | Wrenchmark</title>
      </Helmet>
      
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-foreground mb-4">Courses</h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Structured learning paths for motorcycle maintenance, repair, and riding improvement.
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <GraduationCap className="h-5 w-5" />
                Course Catalog
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <GraduationCap className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium text-foreground mb-2">Course Platform Coming Soon</h3>
                <p className="text-muted-foreground">
                  Comprehensive courses on motorcycle maintenance, repair techniques, and riding skills are being developed.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </Layout>
    </>
  );
};

export default CoursesPage;
