
import React from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

const SkillLoading: React.FC = () => {
  return (
    <>
      <Header />
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto animate-pulse space-y-4">
          <div className="h-10 bg-muted/30 rounded w-2/3"></div>
          <div className="h-5 bg-muted/30 rounded w-1/3"></div>
          <div className="h-64 bg-muted/30 rounded"></div>
          <div className="h-5 bg-muted/30 rounded"></div>
          <div className="h-5 bg-muted/30 rounded"></div>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default SkillLoading;
