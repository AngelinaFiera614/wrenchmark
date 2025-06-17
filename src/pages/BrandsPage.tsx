
import React from 'react';
import { Helmet } from 'react-helmet-async';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const BrandsPage: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>Motorcycle Brands | Wrenchmark</title>
      </Helmet>
      
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-foreground mb-4">Motorcycle Brands</h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Explore the world's leading motorcycle manufacturers and their iconic machines.
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Brand Directory</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <h3 className="text-lg font-medium text-foreground mb-2">Coming Soon</h3>
                <p className="text-muted-foreground">
                  Our comprehensive brand directory is under development. Check back soon for detailed information about motorcycle manufacturers.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </Layout>
    </>
  );
};

export default BrandsPage;
