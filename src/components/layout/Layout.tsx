
import React, { ReactNode } from "react";
import Header from "./Header";
import Footer from "./Footer";

type LayoutProps = {
  children: ReactNode;
};

export const Layout: React.FC<LayoutProps> = ({ children }) => (
  <div className="flex flex-col min-h-screen bg-background">
    <Header />
    <main className="container mx-auto px-4 py-8 flex-grow">
      {children}
    </main>
    <Footer />
  </div>
);
