
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
import { MeasurementProvider } from "./context/MeasurementContext";

// Create a client
const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <ThemeProvider defaultTheme="dark">
        <QueryClientProvider client={queryClient}>
          <AuthProvider>
            <ProfileProvider>
              <ComparisonProvider>
                <MeasurementProvider>
                  <HelmetProvider>
                    <App />
                  </HelmetProvider>
                </MeasurementProvider>
              </ComparisonProvider>
            </ProfileProvider>
          </AuthProvider>
        </QueryClientProvider>
      </ThemeProvider>
    </BrowserRouter>
  </React.StrictMode>
);
