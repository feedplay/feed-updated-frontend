import React, { useEffect, useState } from "react";
import axios from "axios";
import Header from "@/components/Header";
import TabNavigation from "@/components/TabNavigation";
import ReportHeader from "@/components/ReportHeader";
import ReportSection from "@/components/ReportSection";

interface AnalysisResult {
  label: string;
  confidence: string;
  response: string;
}

const Index = () => {
  // Backend URL - updated to use the render deployment
  const BACKEND_URL = "https://ui-feed-backend-2.onrender.com";
  
  const [activeTab, setActiveTab] = useState("visual");
  const [uploadedImage, setUploadedImage] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [analyzeStarted, setAnalyzeStarted] = useState(false);
  const [analysisResults, setAnalysisResults] = useState<AnalysisResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [preprocessingDone, setPreprocessingDone] = useState(false);
  const [feedbackStatus, setFeedbackStatus] = useState<Record<string, string | null>>({});
  const [showNotification, setShowNotification] = useState<{message: string, type: string} | null>(null);

  // Map tab names to their corresponding category labels
  const categoryMapping: Record<string, string> = {
    "visual": "Visual Design Analysis",
    "ux-laws": "Ux Laws Design Analysis",
    "cognitive": "Cognitive Design Analysis",
    "psychological": "Psychological Design Analysis",
    "gestalt": "Gestalt Design Analysis"
  };

  useEffect(() => {
    fetchAnalysisResults();
  }, []);

  // Hide notification after 3 seconds
  useEffect(() => {
    if (showNotification) {
      const timer = setTimeout(() => {
        setShowNotification(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [showNotification]);

  // Optimize loading completion
  useEffect(() => {
    if (loadingProgress === 100) {
      setTimeout(() => {
        setLoading(false);
      }, 200); // Reduce delay for faster perceived performance
    }
  }, [loadingProgress]);

  const fetchAnalysisResults = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${BACKEND_URL}/analyze`);
      console.log("Fetched Analysis Results:", response.data);
      
      if (response.data && Array.isArray(response.data) && response.data.length > 0) {
        setAnalysisResults(response.data);
        setAnalyzeStarted(true);
      }
    } catch (error) {
      console.error("Error fetching analysis:", error);
      setError("Failed to fetch previous analysis results.");
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setUploadedImage(file);
      setPreviewImage(URL.createObjectURL(file));
      setAnalysisResults([]);
      setAnalyzeStarted(false);
      setError(null);
      setPreprocessingDone(false);
      setFeedbackStatus({}); // Reset feedback status for new analysis
      
      // Start preprocessing right after upload
      const formData = new FormData();
      formData.append("image", file);
      
      try {
        // Send to preprocessing endpoint
        console.log("Starting preprocessing...");
        const response = await axios.post(`${BACKEND_URL}/preprocess`, formData);
        console.log("Preprocessing complete:", response.data);
        setPreprocessingDone(true);
      } catch (error) {
        console.error("Error in preprocessing:", error);
        // We don't show errors for preprocessing
      }
    }
  };

  const handleAnalyze = async () => {
    if (!uploadedImage) {
      alert("Please upload an image first!");
      return;
    }

    setLoading(true);
    setError(null);
    setFeedbackStatus({}); // Reset feedback status for new analysis
    
    // Start with higher initial progress for perceived speed
    setLoadingProgress(30);
    const progressInterval = setInterval(() => {
      setLoadingProgress(prev => {
        const newProgress = prev + Math.floor(Math.random() * 15);
        return newProgress > 90 ? 90 : newProgress; // Cap at 90% until actual completion
      });
    }, 400); // More frequent updates for smoother animation

    try {
      let response;
      
      if (preprocessingDone) {
        // If we already preprocessed, just get the results
        console.log("Using preprocessed results...");
        response = await axios.get(`${BACKEND_URL}/analyze`);
      } else {
        // Otherwise do the full analysis
        console.log("Submitting image for analysis...");
        const formData = new FormData();
        formData.append("image", uploadedImage);
        response = await axios.post(`${BACKEND_URL}/analyze`, formData);
      }
      
      clearInterval(progressInterval);
      setLoadingProgress(100);
      
      console.log("API Response:", response.data);
      
      if (Array.isArray(response.data)) {
        setAnalysisResults(response.data);
        setAnalyzeStarted(true);
      } else {
        // Handle case where response is not an array
        setError("Received unexpected data format from server.");
        console.error("Unexpected data format:", response.data);
      }
    } catch (error) {
      clearInterval(progressInterval);
      console.error("Error analyzing image:", error);
      setError("Failed to analyze image. Please try again.");
    } finally {
      // Loading state will be set to false by the useEffect when progress reaches 100%
    }
  };

  // Function to process and format AI responses
  const formatResponse = (text: string) => {
    if (!text) return null;
    
    // Replace markdown symbols with HTML
    let processed = text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') // Bold text
      .replace(/\*(.*?)\*/g, '<em>$1</em>') // Italic text
      .replace(/^#{1,6}\s+(.*)$/gm, '<h3 class="text-lg font-semibold my-2">$1</h3>') // Headers
      .replace(/^-\s+(.*)$/gm, '• $1<br/>') // Bullet points
      .replace(/^(\d+)\.\s+(.*)$/gm, '$1. $2<br/>'); // Numbered lists
    
    // Break into paragraphs
    processed = processed.split('\n\n').map((paragraph, i) => 
      `<p class="mb-3">${paragraph}</p>`
    ).join('');
    
    return processed;
  };

  // Handle feedback for a specific category
  const handleFeedback = (category: string, type: 'helpful' | 'not-helpful') => {
    // Only allow feedback if not already given for this category
    if (!feedbackStatus[category]) {
      const newFeedbackStatus = { ...feedbackStatus };
      newFeedbackStatus[category] = type;
      setFeedbackStatus(newFeedbackStatus);
      
      // Show notification
      if (type === 'helpful') {
        setShowNotification({
          message: "Thank you for your feedback! We're glad this analysis was helpful.",
          type: "success"
        });
      } else {
        setShowNotification({
          message: "Thanks for letting us know. We'll work on improving this type of analysis.",
          type: "info"
        });
      }
      
      // Here you could also send the feedback to your server
      console.log(`Feedback for ${category}: ${type}`);
    }
  };

  // Updated ReportSection component integrated directly
  const FormattedReportSection = ({ title, description, items }: { 
    title: string, 
    description: string, 
    items: AnalysisResult[] 
  }) => {
    return (
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-4 border-b">
          <h2 className="text-xl font-semibold">{title}</h2>
          <p className="text-gray-600 text-sm">{description}</p>
        </div>
        
        <div className="divide-y">
          {items.map((item, index) => (
            <div key={index} className="p-4">
              <div className="flex items-center mb-2">
                {item.confidence !== 'N/A' && (
                  <span className={`px-2 py-1 text-xs font-semibold rounded-full mr-2 ${
                    item.confidence === 'High' ? 'bg-green-100 text-green-800' : 
                    item.confidence === 'Medium' ? 'bg-yellow-100 text-yellow-800' : 
                    'bg-red-100 text-red-800'
                  }`}>
                    {item.confidence}
                  </span>
                )}
                <h3 className="font-medium">{item.label}</h3>
              </div>
              
              {/* Format the response */}
              <div 
                className="text-sm leading-relaxed text-gray-700"
                dangerouslySetInnerHTML={{ __html: formatResponse(item.response) }}
              />
            </div>
          ))}
        </div>

        {/* Feedback section at the bottom of the entire report */}
        {analyzeStarted && items.length > 0 && items[0].confidence !== 'N/A' && (
          <div className="p-4 mt-2 pt-3 border-t border-gray-100 flex justify-center">
            <div className="flex items-center space-x-6">
              <button 
                className={`text-sm flex items-center px-3 py-2 rounded-md ${
                  feedbackStatus[activeTab] === 'helpful' 
                    ? 'bg-green-100 text-green-700' 
                    : feedbackStatus[activeTab] 
                      ? 'text-gray-400 cursor-not-allowed' 
                      : 'text-gray-600 hover:bg-gray-100'
                }`}
                onClick={() => handleFeedback(activeTab, 'helpful')}
                disabled={feedbackStatus[activeTab] !== null && feedbackStatus[activeTab] !== undefined}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017a2 2 0 01-1.789-2.894l3.5-7A2 2 0 0114 10z" />
                </svg>
                Helpful
              </button>
              <button 
                className={`text-sm flex items-center px-3 py-2 rounded-md ${
                  feedbackStatus[activeTab] === 'not-helpful' 
                    ? 'bg-red-100 text-red-700' 
                    : feedbackStatus[activeTab] 
                      ? 'text-gray-400 cursor-not-allowed' 
                      : 'text-gray-600 hover:bg-gray-100'
                }`}
                onClick={() => handleFeedback(activeTab, 'not-helpful')}
                disabled={feedbackStatus[activeTab] !== null && feedbackStatus[activeTab] !== undefined}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14h4.764a2 2 0 001.789-2.894l-3.5-7A2 2 0 0010.737 3H6.72a2 2 0 00-1.789 2.894l3.5 7A2 2 0 0010 14z" />
                </svg>
                Not Helpful
              </button>
            </div>
          </div>
        )}
      </div>
    );
  };

  // Notification Component with fixed z-index for visibility
  const Notification = ({ message, type }: { message: string, type: string }) => (
    <div className={`fixed top-6 right-6 max-w-sm p-4 rounded-lg shadow-lg z-50 ${
      type === 'success' ? 'bg-green-500 text-white' : 'bg-blue-500 text-white'
    }`}>
      <div className="flex items-center">
        {type === 'success' ? (
          <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
          </svg>
        ) : (
          <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
        )}
        <p>{message}</p>
      </div>
    </div>
  );

  // Enhanced Loading Component
  const LoadingComponent = () => (
    <div className="p-8 text-center">
      <div className="relative pt-1">
        <div className="flex mb-2 items-center justify-between">
          <div>
            <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-blue-600 bg-blue-200">
              Analyzing UI
            </span>
          </div>
          <div className="text-right">
            <span className="text-xs font-semibold inline-block text-blue-600">
              {loadingProgress}%
            </span>
          </div>
        </div>
        <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-blue-200">
          <div
            style={{ width: `${loadingProgress}%` }}
            className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-500 transition-all duration-300"
          ></div>
        </div>
        <p className="text-sm text-gray-600">We're looking for design patterns and issues...</p>
      </div>
    </div>
  );

  const getActiveItems = () => {
    // Define all possible sections
    const sections = {
      visual: { 
        title: "Visual Design Feedback", 
        description: "Analysis of visual design inconsistencies.", 
        items: [] as AnalysisResult[] 
      },
      "ux-laws": { 
        title: "UX Laws", 
        description: "Evaluating UX laws and principles.", 
        items: [] as AnalysisResult[] 
      },
      cognitive: { 
        title: "Cognitive Load", 
        description: "Assessing cognitive load and mental effort required.", 
        items: [] as AnalysisResult[] 
      },
      psychological: { 
        title: "Psychological Effects", 
        description: "Analysis of psychological impact and behavior triggers.", 
        items: [] as AnalysisResult[] 
      },
      gestalt: { 
        title: "Gestalt Principles", 
        description: "Evaluating design patterns and visual organization.", 
        items: [] as AnalysisResult[] 
      },
    };

    // Map analysis results to their appropriate sections
    if (analysisResults && analysisResults.length > 0) {
      // Filter for results that match the current active tab
      const matchingLabel = categoryMapping[activeTab];
      
      const tabResults = analysisResults.filter(result => 
        result.label.toLowerCase() === matchingLabel.toLowerCase()
      );
      
      if (tabResults.length > 0) {
        sections[activeTab as keyof typeof sections].items = tabResults;
      } else {
        console.log(`No results found for tab: ${activeTab} (looking for label: ${matchingLabel})`);
        // Log all available labels for debugging
        console.log("Available labels:", analysisResults.map(r => r.label));
      }
    }
    
    // If no items for the active section, add a placeholder
    if (sections[activeTab as keyof typeof sections].items.length === 0) {
      // Only show loading placeholder if we're not actually loading
      if (!loading) {
        sections[activeTab as keyof typeof sections].items.push({
          label: `${sections[activeTab as keyof typeof sections].title}`,
          confidence: "N/A",
          response: analyzeStarted 
            ? "No analysis results found for this category." 
            : "Analysis results will appear here after running the analysis.",
        });
      }
    }

    return sections[activeTab as keyof typeof sections];
  };

  const activeSection = getActiveItems();

  return (
    <div className="min-h-screen pb-20 bg-gray-100">
      <Header />
      {showNotification && (
        <Notification message={showNotification.message} type={showNotification.type} />
      )}
      <main className="container max-w-4xl pt-6 mx-auto">
        {!analyzeStarted ? (
          <div className="flex flex-col items-center justify-center p-6 border rounded-lg shadow-md bg-white">
            <h2 className="text-xl font-semibold mb-4">Upload UI Screenshot</h2>

            <label htmlFor="file-input" className="cursor-pointer bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-300">
              Choose File
            </label>
            <input
              id="file-input"
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />

            {previewImage && (
              <div className="mt-4 w-full max-w-md">
                <img 
                  src={previewImage} 
                  alt="Uploaded Preview" 
                  className="w-full object-contain rounded-lg border" 
                />
                {preprocessingDone && (
                  <p className="text-xs text-green-600 mt-1">Image prepared for analysis ✓</p>
                )}
              </div>
            )}

            <button
              onClick={handleAnalyze}
              className={`mt-4 px-6 py-2 ${preprocessingDone ? 'bg-green-500' : 'bg-blue-500'} text-white rounded-lg hover:bg-green-400 transition-colors duration-300`}
              disabled={loading}
            >
              {loading ? "Analyzing..." : preprocessingDone ? "Analyze UI (Ready)" : "Analyze UI"}
            </button>

            {error && <p className="text-red-500 mt-2">{error}</p>}
          </div>
        ) : (
          <>
            <div className="mb-6 flex justify-between items-center">
              <ReportHeader projectName="UX Evaluation Report" />
              <div>
                <button
                  onClick={() => {
                    setAnalyzeStarted(false);
                    setUploadedImage(null);
                    setPreviewImage(null);
                    setFeedbackStatus({}); // Reset feedback when uploading new image
                  }}
                  className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-400"
                >
                  Upload New Image
                </button>
                
                <button
                  onClick={() => {
                    const exportData = {
                      title: "UX Evaluation Report",
                      date: new Date().toLocaleDateString(),
                      results: analysisResults,
                      feedback: feedbackStatus
                    };
                    
                    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = 'ux-evaluation-report.json';
                    document.body.appendChild(a);
                    a.click();
                    document.body.removeChild(a);
                  }}
                  className="ml-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-400"
                >
                  Export
                </button>
              </div>
            </div>
            
            {previewImage && (
              <div className="mb-6 p-4 bg-white rounded-lg shadow-md">
                <h3 className="font-medium mb-2">Analyzed Image</h3>
                <img 
                  src={previewImage} 
                  alt="Analyzed UI" 
                  className="max-h-80 object-contain mx-auto border rounded" 
                />
              </div>
            )}
            
            <TabNavigation activeTab={activeTab} setActiveTab={setActiveTab} />
            
            {loading ? (
              <LoadingComponent />
            ) : (
              <FormattedReportSection 
                title={activeSection.title} 
                description={activeSection.description} 
                items={activeSection.items} 
              />
            )}
          </>
        )}
      </main>
    </div>
  );
};

export default Index;