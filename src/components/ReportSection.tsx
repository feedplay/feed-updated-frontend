import React from "react";

interface Item {
  label: string;
  confidence: string;
  response: string;
}

interface ReportSectionProps {
  title: string;
  description: string;
  items: Item[];
}

const ReportSection: React.FC<ReportSectionProps> = ({ title, description, items }) => {
  // Function to format markdown-like text with basic styling
  const formatResponse = (text: string) => {
    // Handle bullet points
    let formattedText = text.replace(/^\s*[-*•]\s+(.+)$/gm, '<li>$1</li>');
    formattedText = formattedText.replace(/<li>(.+?)<\/li>/g, function(match) {
      if (!match.startsWith('<ul>')) {
        return '<ul class="list-disc ml-5 my-2">' + match + '</ul>';
      }
      return match;
    });
    
    // Handle headings
    formattedText = formattedText.replace(/^###\s+(.+)$/gm, '<h3 class="text-lg font-medium mt-3 mb-1">$1</h3>');
    formattedText = formattedText.replace(/^##\s+(.+)$/gm, '<h2 class="text-xl font-medium mt-4 mb-2">$1</h2>');
    formattedText = formattedText.replace(/^#\s+(.+)$/gm, '<h1 class="text-2xl font-bold mt-4 mb-2">$1</h1>');
    
    // Handle paragraphs and line breaks
    formattedText = formattedText.replace(/\n\n/g, '</p><p class="my-2">');
    
    return '<p class="my-2">' + formattedText + '</p>';
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-2">{title}</h2>
      <p className="text-gray-600 mb-6">{description}</p>

      {items.map((item, index) => (
        <div key={index} className="mb-6 pb-6 border-b border-gray-200 last:border-0">
          {item.confidence !== "N/A" && (
            <div className="flex items-center mb-2">
              <span 
                className={`px-2 py-1 text-xs rounded mr-2 ${
                  item.confidence === "High" 
                    ? "bg-green-100 text-green-800" 
                    : "bg-blue-100 text-blue-800"
                }`}
              >
                {item.confidence}
              </span>
              {item.label !== title && <span className="text-sm text-gray-500">{item.label}</span>}
            </div>
          )}
          
          <div 
            className="prose max-w-none"
            dangerouslySetInnerHTML={{ __html: formatResponse(item.response) }}
          />
        </div>
      ))}
    </div>
  );
};

export default ReportSection;