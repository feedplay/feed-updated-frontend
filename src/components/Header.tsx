import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Download, Share2, Copy } from "lucide-react";

const Header: React.FC = () => {
  const [showExportOptions, setShowExportOptions] = useState(false);
  const [shareLink, setShareLink] = useState("");

  // Function to handle exporting the report
  const handleExport = (type: string) => {
    const content = "Your UX Evaluation Report content here."; // Replace with actual feedback data
    const fileName = `UX_Evaluation_Report.${type}`;

    let blob;
    if (type === "pdf") {
      blob = new Blob([content], { type: "application/pdf" });
    } else if (type === "docx") {
      blob = new Blob([content], { type: "application/msword" });
    }

    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setShowExportOptions(false);
  };

  // Function to generate and copy a shareable link
  const handleShare = () => {
    const generatedLink = `${window.location.origin}/shared-feedback/12345`; // Example link
    setShareLink(generatedLink);
    navigator.clipboard.writeText(generatedLink);
    alert("Link copied to clipboard!");
  };

  return (
    <header className="sticky top-0 z-10 bg-background/80 backdrop-blur-lg border-b border-border/40 py-4">
      <div className="container flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" className="rounded-full">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-xl font-semibold">UX Evaluation Report</h1>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Export Button with Dropdown */}
          <div className="relative">
            <Button
              variant="outline"
              size="sm"
              className="gap-1.5"
              onClick={() => setShowExportOptions(!showExportOptions)}
            >
              <Download className="h-4 w-4" />
              <span>Export</span>
            </Button>
            {showExportOptions && (
              <div className="absolute right-0 mt-2 w-32 bg-white border rounded-lg shadow-md">
                <button
                  onClick={() => handleExport("pdf")}
                  className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                >
                  Export as PDF
                </button>
                <button
                  onClick={() => handleExport("docx")}
                  className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                >
                  Export as Word
                </button>
              </div>
            )}
          </div>

          {/* Share Button with Copy Link */}
          <Button variant="outline" size="sm" className="gap-1.5" onClick={handleShare}>
            <Share2 className="h-4 w-4" />
            <span>Share</span>
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
