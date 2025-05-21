
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { HelmetProvider } from "react-helmet-async";
import { ThemeProvider } from "./components/theme/theme-provider";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "./context/auth/AuthProvider";
import { ProfileProvider } from "./context/profile/ProfileProvider";
import { BrowserRouter } from "react-router-dom";
import { ComparisonProvider } from "./context/ComparisonContext";

// Create a client
export const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <ThemeProvider defaultTheme="dark">
        <QueryClientProvider client={queryClient}>
          <AuthProvider>
            <ProfileProvider>
              <ComparisonProvider>
                <HelmetProvider>
                  <App />
                </HelmetProvider>
              </ComparisonProvider>
            </ProfileProvider>
          </AuthProvider>
        </QueryClientProvider>
      </ThemeProvider>
    </BrowserRouter>
  </React.StrictMode>
);
