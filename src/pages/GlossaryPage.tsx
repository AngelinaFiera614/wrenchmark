
import React from 'react';
import { Helmet } from 'react-helmet-async';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Book } from 'lucide-react';

const GlossaryPage: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>Glossary | Wrenchmark</title>
      </Helmet>
      
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-foreground mb-4">Motorcycle Glossary</h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Comprehensive definitions of motorcycle terms, technical specifications, and industry jargon.
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Book className="h-5 w-5" />
                Technical Dictionary
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <Book className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium text-foreground mb-2">Glossary Database Coming Soon</h3>
                <p className="text-muted-foreground">
                  A searchable database of motorcycle terminology and technical definitions is under construction.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </Layout>
    </>
  );
};

export default GlossaryPage;
