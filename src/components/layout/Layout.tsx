
import React, { ReactNode } from "react";
import { Outlet } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";

type LayoutProps = {
  children?: ReactNode;
};

export const Layout: React.FC<LayoutProps> = () => (
  <div className="flex flex-col min-h-screen bg-background">
    <Header />
    <main className="flex-grow">
      <Outlet />
    </main>
    <Footer />
  </div>
);
