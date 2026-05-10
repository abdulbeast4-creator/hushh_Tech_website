import React from 'react';'
import * as LucideIcons from 'lucide-react';

export interface DataCategory {
  id: string;
  label: string;
  iconName: keyof typeof LucideIcons;
}

interface CategoryPillProps {
  category: DataCategory;
  isSelected: boolean;
  onToggle: (id: string) => void;
  isLoading?: boolean;
}

export const CategoryPill: React.FC<CategoryPillProps> = ({
  category,
  isSelected,
  onToggle,
  isLoading = false,
}) => {
  const IconComponent = LucideIcons[category.iconName] as React.ElementType;

  const handleClick = () => {
    onToggle(category.id);
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      onToggle(category.id);
    }
  };

  // Skeleton loading state - matches pill shape exactly to prevent CLS
  if (isLoading) {
    return (
      <div
        className="flex items-center gap-2 px-4 py-2 rounded-full bg-gray-200 animate-pulse"
        style={{ minWidth: '120px' }}
        aria-hidden="true"
      >
        <div className="w-4 h-4 rounded-full bg-gray-300 animate-pulse" />
        <div className="h-4 w-20 bg-gray-300 rounded animate-pulse" />
      </div>
    );
  }

  return (
    <button
      type="button"
      role="switch"
      aria-pressed={isSelected}
      aria-label={`Select ${category.label} category`}
      tabIndex={0}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      className={`
        flex items-center gap-2 px-4 py-2 rounded-full
        transition-all duration-200 ease-in-out
        focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2
        ${
          isSelected
            ? 'bg-blue-600 text-white focus-visible:ring-blue-600'
            : 'bg-gray-100 text-gray-700 hover:bg-gray-200 focus-visible:ring-gray-400'
        }
      `}
    >
      {IconComponent && (
        <IconComponent
          size={16}
          strokeWidth={2}
          aria-hidden="true"
        />
      )}
      <span className="text-sm font-medium whitespace-nowrap">
        {category.label}
      </span>
    </button>
  );
};