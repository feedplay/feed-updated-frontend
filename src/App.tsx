import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from './contexts/authContext';
import Auth from './pages/Auth';
import Main from './pages/Main';
import Index from './pages/Index'; // Ensure you have an Index component

const queryClient = new QueryClient();

const App = () => {
  console.log('App component rendered'); // Debugging line

  return (
    <AuthProvider>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <Router>
            <Routes>
              <Route path="/auth" element={<Auth />} />
              <Route 
                path="/" 
                element={
                  localStorage.getItem('userEmail') ? <Index /> : <Navigate to="/auth" />
                } 
              />
              {/* Remove other routes as they're not needed */}
            </Routes>
          </Router>
        </TooltipProvider>
      </QueryClientProvider>
    </AuthProvider>
  );
};

export default App;
