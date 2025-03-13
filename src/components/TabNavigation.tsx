import React from "react";

interface TabNavigationProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const TabNavigation: React.FC<TabNavigationProps> = ({ activeTab, setActiveTab }) => {
  const tabs = [
    { id: "visual", label: "Visual Design" },
    { id: "ux-laws", label: "UX Laws" },
    { id: "cognitive", label: "Cognitive Load" },
    { id: "psychological", label: "Psychological Effects" },
    { id: "gestalt", label: "Gestalt Principles" },
  ];

  return (
    <div className="flex flex-wrap gap-2 mb-6">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => setActiveTab(tab.id)}
          className={`px-4 py-2 rounded-full transition-colors ${
            activeTab === tab.id
              ? "bg-black text-white"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
};

export default TabNavigation;