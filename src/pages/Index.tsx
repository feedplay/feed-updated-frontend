import React, { useEffect, useState } from "react";
import axios from "axios";
import Header from "@/components/Header";
import TabNavigation from "@/components/TabNavigation";
import ReportHeader from "@/components/ReportHeader";
import ReportSection from "@/components/ReportSection";

// Update the interface definition for AnalysisResult
interface AnalysisResult {
  label: string;
  confidence: string;
  response: string;
  status: 'issue' | 'suggestion' | 'info';
  category: string;
  details?: string;
  solution?: string | null;
  type?: string;
  isPositive: boolean;
}

interface GroupedResults {
  [key: string]: AnalysisResult[];
}

// Add FeedbackItem component
const FeedbackItem = ({ item }: { item: AnalysisResult }) => {
  const isPositive = item.status === 'suggestion';
  
  return (
    <div className={`mb-6 bg-white rounded-lg shadow-sm overflow-hidden border ${
      isPositive ? 'border-green-100' : 'border-red-100'
    }`}>
      <div className="flex items-start p-4">
        {/* Status Icon */}
        <div className="mr-4 mt-1">
          {isPositive ? (
            <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
          ) : (
            <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
          )}
        </div>
        
        {/* Content */}
        <div className="flex-1">
          {/* Title with Badge */}
          <div className="flex items-center mb-2">
            <h3 className="font-medium text-gray-800">
              {item.label}
            </h3>
            <span className={`ml-2 px-2 py-1 text-xs font-semibold rounded-full ${
              isPositive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
            }`}>
              {isPositive ? 'Improvement' : 'Issue'}
            </span>
          </div>
          
          {/* Details */}
          <div className="text-sm leading-relaxed text-gray-700 mb-3">
            {item.details || item.response || "No details available"}
          </div>
          
          {/* Solution Section (only for issues) */}
          {!isPositive && item.solution && (
            <div className="mt-3 pt-3 border-t border-gray-100">
              <div className="flex items-center mb-1 text-blue-600">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                <span className="font-medium">Recommended Solution</span>
              </div>
              <p className="text-sm pl-5 text-gray-700">
                {item.solution}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Add WelcomeState component after other component definitions
const WelcomeState = () => (
  <div className="text-center py-12">
    <div className="max-w-xl mx-auto">
      <svg 
        className="mx-auto h-16 w-16 text-gray-400 mb-4" 
        fill="none" 
        stroke="currentColor" 
        viewBox="0 0 48 48"
      >
        <path 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          strokeWidth="2" 
          d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
        />
      </svg>
      <h2 className="text-2xl font-bold text-gray-900 mb-4">
        Welcome to UI Design Analysis
      </h2>
      <p className="text-gray-600 mb-8">
        Upload a screenshot of your UI design to get comprehensive feedback on visual design, UX laws, cognitive load, psychological impact, and Gestalt principles.
      </p>
      <div className="space-y-4">
        <div className="flex items-center justify-center space-x-6">
          <div className="text-center">
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-blue-100 text-blue-600 mb-2 mx-auto">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"/>
              </svg>
            </div>
            <p className="text-sm text-gray-600">Upload UI</p>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-green-100 text-green-600 mb-2 mx-auto">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
              </svg>
            </div>
            <p className="text-sm text-gray-600">Get Analysis</p>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-purple-100 text-purple-600 mb-2 mx-auto">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"/>
              </svg>
            </div>
            <p className="text-sm text-gray-600">View Results</p>
          </div>
        </div>
      </div>
    </div>
  </div>
);

const Index = () => {
  // Backend URL - updated to use the render deployment
  const BACKEND_URL = "https://ui-feed-backend-5.onrender.com";
  
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

  // Add the navigation handler function
  const handleNavigateBack = () => {
    console.log("Navigate back action triggered");
  };

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


  // Determine if the feedback is an issue, suggestion, or info
  const determineStatus = (response: string, confidence: string): 'issue' | 'suggestion' | 'info' => {
    if (!response) return 'info'; // Handle case where response is undefined
    
    const lowerResponse = response.toLowerCase();
    // Check for issue indicators
    if (
      lowerResponse.includes('issue') ||
      lowerResponse.includes('problem') ||
      lowerResponse.includes('error') ||
      lowerResponse.includes('poor') ||
      lowerResponse.includes('inconsistent') ||
      confidence === 'Low'
    ) {
      return 'issue';
    }
    
    // Check for suggestion indicators
    if (
      lowerResponse.includes('suggestion') ||
      lowerResponse.includes('recommend') ||
      lowerResponse.includes('consider') ||
      lowerResponse.includes('improve') ||
      lowerResponse.includes('enhance') ||
      lowerResponse.includes('standardize') ||
      confidence === 'Medium'
    ) {
      return 'suggestion';
    }
    
    // Default to info
    return 'info';
  };
  
  // Extract title, details, and solution from response
  const extractFeedbackParts = (response: string): { title: string | null; details: string; solution: string | null } => {
    if (!response) {
      return { title: null, details: '', solution: null };
    }
    
    // Try to extract a title from the first line or sentence
    let title = null;
    let details = response;
    let solution = null;
    
    // Get first line or sentence for title
    const firstLine = response.split('\n')[0].trim();
    if (firstLine && firstLine.length < 100) {
      title = firstLine;
      details = response.replace(firstLine, '').trim();
    } else {
      const firstSentence = response.split('.')[0];
      if (firstSentence && firstSentence.length < 100) {
        title = firstSentence;
        details = response.replace(firstSentence, '').trim();
      }
    }
    
    // Try to find solution section
    const solutionPatterns = [
      /Solution:\s*([\s\S]+)/i,
      /Recommendation:\s*([\s\S]+)/i,
      /Suggested fix:\s*([\s\S]+)/i,
      /How to fix:\s*([\s\S]+)/i,
      /To improve:\s*([\s\S]+)/i
    ];
    
    for (const pattern of solutionPatterns) {
      const match = details.match(pattern);
      if (match && match[1]) {
        solution = match[1].trim();
        details = details.replace(pattern, '').trim();
        break;
      }
    }
    
    // If no specific solution section was found but we have implement/standardize keywords
    if (!solution) {
      const implementPattern = /implement\s+a\s+([\s\S]+)/i;
      const match = details.match(implementPattern);
      if (match && match[0]) {
        solution = match[0].trim();
        // Don't remove this from details as it might be important context
      }
    }
    
    return { title, details, solution };
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

  // Format analysis results for export
  const formatResultsForExport = (results: AnalysisResult[]) => {
    // Group results by category
    const categorizedResults: Record<string, AnalysisResult[]> = {};
    
    // Initialize all categories with empty arrays
    Object.keys(categoryMapping).forEach(tab => {
      const categoryLabel = categoryMapping[tab];
      categorizedResults[categoryLabel] = [];
    });
    
    // Populate with actual results
    results.forEach(result => {
      const category = result.label;
      if (!categorizedResults[category]) {
        categorizedResults[category] = [];
      }
      categorizedResults[category].push(result);
    });
    
    return categorizedResults;
  };

  // Update the EnhancedReportSection to handle initial state
  const EnhancedReportSection = ({ title, description, items }: { 
    title: string, 
    description: string, 
    items: AnalysisResult[] 
  }) => {
    // If analysis hasn't started yet, show welcome state
    if (!analyzeStarted && !loading) {
      return <WelcomeState />;
    }

    return (
      <div className="bg-white rounded-lg shadow-md overflow-hidden p-6">
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-800">{title}</h2>
          <p className="text-gray-600 text-sm">{description}</p>
        </div>
        
        <div className="divide-y divide-gray-100">
          {items.map((item, index) => (
            <FeedbackItem key={index} item={item} />
          ))}
        </div>

        {/* Feedback section */}
        {analyzeStarted && items.length > 0 && items[0].confidence !== 'N/A' && (
          <div className="p-4 mt-4 pt-3 border-t border-gray-200 flex justify-center">
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
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
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
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14H5.236a2 2 0 01-1.789-2.894l3.5-7A2 2 0 018.736 3h4.018a2 2 0 01.485.06l3.76.94m-7 10v5a2 2 0 002 2h.096c.5 0 .905-.405.905-.904 0-.715.211-1.413.608-2.008L17 13V4m-7 10h2m5-10h2a2 2 0 012 2v6a2 2 0 01-2 2h-2.5" />
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

// Update the getActiveItems function
const getActiveItems = () => {
    // If analysis hasn't started and there's no loading, return empty items
    if (!analyzeStarted && !loading) {
      return {
        title: "",
        description: "",
        items: []
      };
    }

    // Map category names to their display labels
    const categoryToLabel = {
      'visual': 'Visual Design Analysis',
      'ux-laws': 'UX Laws Design Analysis',
      'cognitive': 'Cognitive Design Analysis',
      'psychological': 'Psychological Design Analysis',
      'gestalt': 'Gestalt Design Analysis'
    };

    // Get results for the active tab
    const activeResults = analysisResults.filter(result => {
      const resultCategory = result.category?.toLowerCase() || '';
      return resultCategory === activeTab;
    });

    // Get the section details
    const sectionTitle = categoryToLabel[activeTab as keyof typeof categoryToLabel] || 'Analysis Results';
    const sectionDescription = getSectionDescription(activeTab);

    // If no results for active tab after analysis has started, provide a placeholder
    if (activeResults.length === 0 && analyzeStarted) {
      return {
        title: sectionTitle,
        description: sectionDescription,
        items: [{
          label: sectionTitle,
        confidence: "N/A",
          response: "No analysis results found for this category.",
          status: 'info' as const,
          category: activeTab,
          isPositive: false
        }] as AnalysisResult[]
      };
    }

    return {
      title: sectionTitle,
      description: sectionDescription,
      items: activeResults
    };
  };

  // Helper function to get section descriptions
  const getSectionDescription = (category: string): string => {
    const descriptions: Record<string, string> = {
      visual: "Analysis of visual design inconsistencies and proposed improvements for a cohesive user interface.",
      "ux-laws": "Evaluating UX laws and principles applied in the interface design.",
      cognitive: "Assessing cognitive load and mental effort required from users.",
      psychological: "Analysis of psychological impact and behavior triggers in the design.",
      gestalt: "Evaluating design patterns and visual organization according to Gestalt principles."
    };
    return descriptions[category] || "Detailed analysis of UI design elements.";
  };

  // Update the processAnalysisResults function to better handle implementation details
const processAnalysisResults = (results: any[]): AnalysisResult[] => {
  if (!results || !Array.isArray(results)) return [];
  
    // Check if the first result indicates a non-UI image
    if (results.length === 1 && results[0].category === 'error' && 
        results[0].items && results[0].items[0] && 
        results[0].items[0].title === 'Non-UI Image Detected') {
      return [{
        label: "Invalid Image Type",
        confidence: "High",
        response: "Please upload a UI-related image (website, app interface, or digital product design).",
        status: 'issue',
        category: 'error',
        details: "This tool is specifically designed to analyze user interfaces.",
        solution: "Upload a screenshot of a website, mobile app, or digital interface.",
        type: 'issue',
        isPositive: false
      }];
    }
    
    const processedResults = results.map(result => {
      const items = result.items || [];
      const category = result.category || '';
      
      return items.map((item: any): AnalysisResult => {
        const isRecommendation = item.type === 'recommendation';
        const isIssue = item.type === 'issue';
        
        // Extract core implementation suggestion
        const getImplementationSuggestion = (description: string) => {
          if (!description) return "";
          
          // Extract specific implementation suggestion
          const suggestions = description.match(/(?:implement|use|add|create|apply|reduce|increase|decrease|modify|change|update)(.*?)(?:\.|\n|$)/i);
          if (suggestions && suggestions[0]) {
            return suggestions[0].trim();
          }
          
          // Fallback to first sentence if no specific implementation found
          return description.split('.')[0].trim();
        };
        
        return {
          label: item.title || "Unknown",
          confidence: result.confidence || "N/A",
          response: item.description || "",
          status: isIssue ? 'issue' : 
                 isRecommendation ? 'suggestion' : 'info',
          category: category,
          details: item.description || "",
          solution: isRecommendation ? getImplementationSuggestion(item.description) : item.solution,
          type: item.type || 'info',
          isPositive: isRecommendation
        };
      });
    }).flat();

    // Group by category and ensure mix of positive and negative feedback
    const groupedByCategory = processedResults.reduce((acc: GroupedResults, item) => {
      const category = item.category || 'unknown';
      if (!acc[category]) {
        acc[category] = [];
      }
      
      // Keep a balance of positive and negative items
      const currentItems = acc[category];
      const positiveCount = currentItems.filter(i => i.isPositive).length;
      const negativeCount = currentItems.filter(i => !i.isPositive).length;
      
      if (currentItems.length < 4) { // Allow up to 4 items per category
        if (item.isPositive && positiveCount < 2) {
          acc[category].push(item);
        } else if (!item.isPositive && negativeCount < 2) {
          acc[category].push(item);
        }
      }
      
      return acc;
    }, {} as GroupedResults);

    return Object.values(groupedByCategory).flat() as AnalysisResult[];
  };

  // Update the handleAnalyze function to default to visual design analysis
const handleAnalyze = async () => {
  if (!uploadedImage) {
    alert("Please upload an image first!");
    return;
  }

  setLoading(true);
  setError(null);
  setFeedbackStatus({}); // Reset feedback status for new analysis
  setLoadingProgress(30);
    setAnalyzeStarted(true);
    setActiveTab('visual'); // Always set visual design as the default tab

  const progressInterval = setInterval(() => {
    setLoadingProgress(prev => {
      const newProgress = prev + Math.floor(Math.random() * 15);
        return newProgress > 90 ? 90 : newProgress;
    });
  }, 400);

  try {
      const formData = new FormData();
      formData.append("image", uploadedImage);
      const response = await axios.post(`${BACKEND_URL}/analyze`, formData);
    
    clearInterval(progressInterval);
    setLoadingProgress(100);
    
      console.log("Raw API Response:", response.data);
    
    if (response.data && Array.isArray(response.data)) {
        const processedResults = processAnalysisResults(response.data);
        console.log("Processed Results:", processedResults);
        setAnalysisResults(processedResults);
    } else {
      setError("Received unexpected data format from server.");
    }
  } catch (error) {
    clearInterval(progressInterval);
    console.error("Error analyzing image:", error);
    setError("Failed to analyze image. Please try again.");
  } finally {
      setLoading(false);
  }
};

  // Function to generate a formatted HTML export of all results
  const generateExportHTML = () => {
    const categorizedResults = formatResultsForExport(analysisResults);
    
    // Create HTML sections for each category
    let sectionsHTML = '';
    Object.entries(categoryMapping).forEach(([tabKey, categoryLabel]) => {
      const results = analysisResults.filter(result => 
        result.label.toLowerCase() === categoryLabel.toLowerCase()
      );
      
      if (results.length > 0) {
        sectionsHTML += `
          <div style="margin-bottom: 20px; page-break-inside: avoid;">
            <h2 style="color: #2563eb; margin-bottom: 10px;">${categoryLabel}</h2>
            <div style="border: 1px solid #e5e7eb; border-radius: 8px; overflow: hidden;">
              ${results.map(item => {
                const status = item.status || 'info';
                const statusColor = 
                  status === 'issue' ? '#f87171' : 
                  status === 'suggestion' ? '#4ade80' : 
                  '#60a5fa';
                
                return `
                <div style="padding: 15px; border-bottom: 1px solid #e5e7eb;">
                  <div style="display: flex; align-items: flex-start;">
                    <div style="margin-right: 15px; width: 24px; height: 24px; border-radius: 50%; background-color: ${
                      status === 'issue' ? '#fee2e2' : 
                      status === 'suggestion' ? '#dcfce7' : 
                      '#dbeafe'
                    }; display: flex; align-items: center; justify-content: center;">
                      <div style="width: 16px; height: 16px; color: ${statusColor};">
                        ${status === 'issue' ? '⚠️' : status === 'suggestion' ? '✅' : 'ℹ️'}
                      </div>
                    </div>
                    <div style="flex: 1;">
                      <div style="display: flex; align-items: center; margin-bottom: 8px;">
                      ${item.confidence !== 'N/A' ? `
                        <span style="background-color: ${
                          item.confidence === 'High' ? '#dcfce7' : 
                          item.confidence === 'Medium' ? '#fef3c7' : 
                          '#fee2e2'
                        }; color: ${
                          item.confidence === 'High' ? '#166534' : 
                          item.confidence === 'Medium' ? '#92400e' : 
                          '#991b1b'
                        }; padding: 4px 8px; border-radius: 9999px; font-size: 12px; font-weight: 600; margin-right: 8px;">
                          ${item.confidence}
                        </span>
                      ` : ''}
                      <h3 style="font-weight: 500; color: #1f2937;">${item.label}</h3>
                    </div>
                    <div style="font-size: 14px; line-height: 1.5; color: #4b5563; margin-bottom: 12px;">
                      ${item.details || item.response}
                    </div>
                    ${item.solution ? `
                      <div style="margin-top: 12px; padding-top: 12px; border-top: 1px solid #f3f4f6;">
                        <div style="display: flex; align-items: center; color: #059669; margin-bottom: 4px;">
                          <span style="margin-right: 4px;">🛡️</span>
                          <span style="font-weight: 500;">Solution</span>
                        </div>
                        <p style="font-size: 14px; color: #4b5563; padding-left: 20px;">${item.solution}</p>
                      </div>
                    ` : ''}
                  </div>
                </div>
              </div>
              `;
              }).join('')}
            </div>
          </div>
        `;
      }
    });
    
    // Full HTML document with styling
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <title>UI Design Analysis Report</title>
        <meta charset="UTF-8">
        <style>
          body { font-family: system-ui, -apple-system, sans-serif; line-height: 1.5; color: #374151; max-width: 800px; margin: 0 auto; padding: 20px; }
          h1 { color: #1f2937; margin-bottom: 24px; }
          img { max-width: 100%; border-radius: 8px; margin-bottom: 24px; }
          @media print {
            body { padding: 0; }
            h1 { margin-top: 0; }
          }
        </style>
      </head>
      <body>
        <h1>UI Design Analysis Report</h1>
        ${previewImage ? `<img src="${previewImage}" alt="Analyzed UI" />` : ''}
        ${sectionsHTML}
        <div style="margin-top: 30px; font-size: 12px; color: #6b7280; text-align: center;">
          Generated by UI Feedback Tool on ${new Date().toLocaleDateString()}
        </div>
      </body>
      </html>
    `;
  };

  // Function to handle export to HTML file
  const handleExportHTML = () => {
    if (!analysisResults.length) {
      setShowNotification({
        message: "No analysis results to export",
        type: "info"
      });
      return;
    }
    
    const htmlContent = generateExportHTML();
    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'ui-analysis-report.html';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    setShowNotification({
      message: "Report exported successfully",
      type: "success"
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Show notification if available */}
      {showNotification && (
        <Notification message={showNotification.message} type={showNotification.type} />
      )}
      
      <main className="container max-w-7xl mx-auto px-4 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          {/* Left Column - Upload and Preview */}
          <div className="md:col-span-1">
            <div className="bg-white rounded-lg shadow-md overflow-hidden p-6 mb-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Upload UI</h2>
              
              {/* File upload component */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Upload a UI screenshot
                </label>
                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                  <div className="space-y-1 text-center">
                    <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                      <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <div className="flex text-sm text-gray-600">
                      <label htmlFor="file-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500">
                        <span>Upload a file</span>
                        <input id="file-upload" name="file-upload" type="file" className="sr-only" accept="image/*" onChange={handleImageUpload} />
                      </label>
                      <p className="pl-1">or drag and drop</p>
                    </div>
                    <p className="text-xs text-gray-500">
                      PNG, JPG, GIF up to 10MB
                    </p>
                  </div>
                </div>
              </div>
              
              {/* Preview */}
              {previewImage && (
                <div className="mt-4">
                  <h3 className="text-sm font-medium text-gray-700 mb-2">Preview</h3>
                  <div className="rounded-lg overflow-hidden border border-gray-200">
                    <img src={previewImage} alt="Preview" className="w-full object-cover" />
                  </div>
                </div>
              )}
            </div>
            
            {/* Analysis Button */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <button
                onClick={handleAnalyze}
                disabled={!uploadedImage || loading}
                className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
                  !uploadedImage || loading ? 'bg-blue-300 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
                }`}
              >
                {loading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Analyzing...
                  </>
                ) : analyzeStarted ? 'Analyze Again' : 'Analyze UI Design'}
              </button>
              
              {analyzeStarted && (
                <button
                  onClick={handleExportHTML}
                  className="w-full mt-3 flex justify-center py-3 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4-4m0 0L8 8m4-4v12"/>
                  </svg>
                  Export Report
                </button>
              )}
            </div>
          </div>
          
          {/* Right Column - Analysis Results */}
          <div className="md:col-span-2">
            {error ? (
              <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-red-700">{error}</p>
                  </div>
                </div>
              </div>
            ) : (
              <>
                {/* Show welcome message when no image is uploaded and analysis hasn't started */}
                {!uploadedImage && !analyzeStarted ? (
                  <div className="bg-white rounded-lg shadow-md p-8 text-center">
                    <div className="max-w-md mx-auto">
                      <svg 
                        className="mx-auto h-12 w-12 text-gray-400 mb-4" 
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 48 48"
                      >
                        <path 
                          strokeLinecap="round" 
                          strokeLinejoin="round" 
                          strokeWidth="2" 
                          d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                        />
                      </svg>
                      <h2 className="text-xl font-semibold text-gray-800 mb-2">
                        Ready to Analyze Your UI
                      </h2>
                      <p className="text-gray-600">
                        Upload a screenshot of your UI design on the left to get started with the analysis.
                      </p>
                    </div>
                  </div>
                ) : (
                  <>
                    {/* Always show tabs when image is uploaded */}
                <div className="bg-white shadow-md rounded-lg overflow-hidden mb-6">
                  <div className="flex overflow-x-auto">
                    {Object.entries(categoryMapping).map(([key, label]) => (
                      <button
                        key={key}
                        className={`flex-shrink-0 px-6 py-3 text-sm font-medium ${
                          activeTab === key
                            ? "text-blue-600 border-b-2 border-blue-600"
                            : "text-gray-500 hover:text-gray-700 hover:border-gray-300"
                        }`}
                        onClick={() => setActiveTab(key)}
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                </div>

                    {/* Show loading or analysis results */}
{loading ? (
  <LoadingComponent />
) : (
  <EnhancedReportSection
    title={getActiveItems().title}
    description={getActiveItems().description}
    items={getActiveItems().items}
  />
                    )}
                  </>
)}
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;