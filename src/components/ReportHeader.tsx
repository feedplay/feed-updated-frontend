import React from 'react';
import { CalendarIcon, Clock, Layout, BarChart2 } from 'lucide-react';

interface ReportHeaderProps {
  projectName: string;
  date?: string;
  duration?: string;
  screens?: number;
  issues?: number;
}

const ReportHeader: React.FC<ReportHeaderProps> = ({ 
  projectName, 
  date = "N/A", 
  duration = "N/A", 
  screens = 0, 
  issues = 0 
}) => {
  return (
    <div className="glass-panel p-6 mb-6 animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between gap-4">
        <div>
          <h2 className="text-2xl font-semibold mb-2">{projectName}</h2>
          <p className="text-muted-foreground">
            Comprehensive UX evaluation with actionable recommendations
          </p>
        </div>
      </div>
    </div>
  );
};

export default ReportHeader;
