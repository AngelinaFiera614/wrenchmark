
import React, { ReactNode } from "react";
import Header from "./Header";
import Footer from "./Footer";

type LayoutProps = {
  children: ReactNode;
};

export const Layout: React.FC<LayoutProps> = ({ children }) => (
  <>
    <Header />
    <main className="container mx-auto px-4 py-8 min-h-screen">
      {children}
    </main>
    <Footer />
  </>
);
