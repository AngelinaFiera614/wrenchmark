
import React from "react";
import Header from "./Header";
import Footer from "./Footer";
import EmailVerificationBanner from "@/components/auth/EmailVerificationBanner";
import { useAuth } from "@/context/auth";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-explorer-dark text-explorer-text flex flex-col">
      <Header />
      {user && <EmailVerificationBanner />}
      <main className="flex-1">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
