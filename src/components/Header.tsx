import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

interface HeaderProps {
  onBack?: () => void; // Optional callback for back navigation
}

const Header: React.FC<HeaderProps> = ({ onBack }) => {
  // Function to handle going back
  const handleGoBack = () => {
    if (onBack) {
      onBack();
    } else {
      // Fallback to browser history
      window.history.back();
    }
  };

  return (
    <header className="sticky top-0 z-10 bg-background/80 backdrop-blur-lg border-b border-border/40 py-4">
      <div className="container flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button 
            variant="ghost" 
            size="icon" 
            className="rounded-full" 
            onClick={handleGoBack}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-xl font-semibold">UX Evaluation Report</h1>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;