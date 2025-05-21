
import React, { ReactNode } from "react";
import Header from "./Header";
import Footer from "./Footer";

type LayoutProps = {
  children: ReactNode;
};

export const Layout: React.FC<LayoutProps> = ({ children }) => (
  <div className="flex flex-col min-h-screen bg-background">
    <Header />
    <main className="flex-grow">
      {children}
    </main>
    <Footer />
  </div>
);

export default Layout;
