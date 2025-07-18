import React, { useState } from 'react';
import clsx from 'clsx';

interface Tab {
  id: string;
  label: string;
  content: React.ReactNode;
}

interface TabComponentProps {
  tabs: Tab[];
  defaultTab?: string;
  className?: string;
}

export const TabComponent: React.FC<TabComponentProps> = ({ 
  tabs, 
  defaultTab, 
  className = "" 
}) => {
  const [activeTab, setActiveTab] = useState(defaultTab || tabs[0]?.id);

  const activeTabContent = tabs.find(tab => tab.id === activeTab)?.content;

  return (
    <div className={`${className} w-full min-w-0`}>
      {/* Tab Headers */}
      <div className="flex gap-2 border-b border-gray-200 dark:border-gray-700 mb-6">
        {tabs.map((tab) => (
          <div
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={clsx(
              "px-6 cursor-pointer rounded py-3 font-medium text-md transition-colors border-b-2 -mb-px",
              activeTab === tab.id
                ? "border-blue-500 text-blue-600 dark:text-blue-400"
                : "border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
            )}
          >
            {tab.label}
          </div>
        ))}
      </div>

      {/* Tab Content */}
      <div className="tab-content w-full min-w-0">
        <div className="overflow-x-auto">
          {activeTabContent}
        </div>
      </div>
    </div>
  );
};