
import React from 'react';
import { AlertTriangle, CheckCircle, ExternalLink } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface IssueItemProps {
  type: 'problem' | 'solution';
  title: string;
  description: string;
  index: number;
  linkText?: string;
  linkUrl?: string;
}

const IssueItem: React.FC<IssueItemProps> = ({ 
  type, 
  title, 
  description, 
  index,
  linkText,
  linkUrl
}) => {
  return (
    <div 
      className="issue-item" 
      style={{ '--item-index': index } as React.CSSProperties}
    >
      <div className={cn('issue-icon', type === 'problem' ? 'problem-icon' : 'solution-icon')}>
        {type === 'problem' ? (
          <AlertTriangle className="h-5 w-5" />
        ) : (
          <CheckCircle className="h-5 w-5" />
        )}
      </div>
      <div className="flex-1">
        <h4 className={cn(
          "font-medium mb-1",
          type === 'problem' ? 'text-issue' : 'text-solution'
        )}>
          {title}
        </h4>
        <p className="text-sm text-muted-foreground">{description}</p>
        {linkText && linkUrl && (
          <a 
            href={linkUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 inline-flex items-center text-xs text-primary hover:underline gap-1"
          >
            {linkText}
            <ExternalLink className="h-3 w-3" />
          </a>
        )}
      </div>
    </div>
  );
};

export default IssueItem;
