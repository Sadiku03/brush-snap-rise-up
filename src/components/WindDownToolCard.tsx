
import React from 'react';
import { Button } from '@/components/ui/button';
import { ChevronRight } from 'lucide-react';

interface WindDownToolCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  onClick: () => void;
  actionLabel?: string;
  color?: 'blue' | 'purple' | 'coral';
}

const WindDownToolCard = ({
  icon,
  title,
  description,
  onClick,
  actionLabel = "Start",
  color = 'blue'
}: WindDownToolCardProps) => {
  const getColorClasses = () => {
    switch (color) {
      case 'purple':
        return 'bg-lilac/10 border-lilac/20';
      case 'coral':
        return 'bg-coral/10 border-coral/20';
      default:
        return 'bg-skyblue/10 border-skyblue/20';
    }
  };

  return (
    <div 
      className={`rounded-2xl p-5 border shadow-sm transition-all duration-300 hover:shadow-md ${getColorClasses()}`}
      onClick={onClick}
    >
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0 p-3 rounded-xl bg-white/60 shadow-sm">
          {icon}
        </div>
        
        <div className="flex-1">
          <h3 className="font-semibold text-lg text-indigo mb-1">{title}</h3>
          <p className="text-indigo/70 text-sm leading-relaxed">{description}</p>
        </div>
        
        <Button 
          variant="ghost" 
          size="sm" 
          className="mt-1 text-indigo/70 hover:text-indigo"
          onClick={(e) => {
            e.stopPropagation();
            onClick();
          }}
        >
          {actionLabel} <ChevronRight className="h-4 w-4 ml-1" />
        </Button>
      </div>
    </div>
  );
};

export default WindDownToolCard;
