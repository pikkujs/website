import React from 'react';

interface WiringIconProps {
  className?: string;
  size?: number;
}

export const HttpIcon: React.FC<WiringIconProps> = ({ className = "", size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" className={`text-green-600 dark:text-green-400 ${className}`}>
    <path d="M2 4h12a1 1 0 0 1 1 1v6a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1z" stroke="currentColor" strokeWidth="1.5" fill="none"/>
    <path d="M5 7h6M5 9h4" stroke="currentColor" strokeWidth="1" strokeLinecap="round"/>
  </svg>
);

export const WebSocketIcon: React.FC<WiringIconProps> = ({ className = "", size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" className={`text-purple-600 dark:text-purple-400 ${className}`}>
    <circle cx="8" cy="8" r="6.5" stroke="currentColor" strokeWidth="1.5" fill="none"/>
    <path d="M5 6l3 3 3-3M11 10l-3-3-3 3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
    <circle cx="8" cy="8" r="1" fill="currentColor"/>
  </svg>
);

export const SSEIcon: React.FC<WiringIconProps> = ({ className = "", size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" className={`text-orange-600 dark:text-orange-400 ${className}`}>
    <rect x="1.5" y="3.5" width="13" height="9" rx="1.5" stroke="currentColor" strokeWidth="1.5" fill="none"/>
    <path d="M4 6h8M4 8h6M4 10h4" stroke="currentColor" strokeWidth="1" strokeLinecap="round"/>
    <path d="M12 1l2 2-2 2M11 5V1" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

export const CronIcon: React.FC<WiringIconProps> = ({ className = "", size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" className={`text-yellow-600 dark:text-yellow-400 ${className}`}>
    <circle cx="8" cy="8" r="6.5" stroke="currentColor" strokeWidth="1.5" fill="none"/>
    <path d="M8 4v4l3 2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <circle cx="8" cy="8" r="0.5" fill="currentColor"/>
  </svg>
);


export const QueueIcon: React.FC<WiringIconProps> = ({ className = "", size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" className={`text-red-600 dark:text-red-400 ${className}`}>
    <rect x="1.5" y="4.5" width="13" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.5" fill="none"/>
    <path d="M4 7h2M4 9h3M10 7h2M10 9h2" stroke="currentColor" strokeWidth="1" strokeLinecap="round"/>
    <path d="M7 6v4" stroke="currentColor" strokeWidth="1.5"/>
  </svg>
);


export const RPCIcon: React.FC<WiringIconProps> = ({ className = "", size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" className={`text-blue-600 dark:text-blue-400 ${className}`}>
    <rect x="1.5" y="6.5" width="5" height="3" rx="0.5" stroke="currentColor" strokeWidth="1.5" fill="none"/>
    <rect x="9.5" y="6.5" width="5" height="3" rx="0.5" stroke="currentColor" strokeWidth="1.5" fill="none"/>
    <path d="M6.5 8h3" stroke="currentColor" strokeWidth="1.5"/>
    <path d="M7 7.5l1 0.5-1 0.5M9 7.5l-1 0.5 1 0.5" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

export const MCPIcon: React.FC<TransportIconProps> = ({ className = "", size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" className={`text-pink-600 dark:text-pink-400 ${className}`}>
    <rect x="4" y="4" width="8" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.5" fill="none"/>
    <circle cx="6.5" cy="7" r="1" fill="currentColor"/>
    <circle cx="9.5" cy="7" r="1" fill="currentColor"/>
    <path d="M6 9.5h4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
    <path d="M6 4V2.5M10 4V2.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    <circle cx="6" cy="2.5" r="0.5" fill="currentColor"/>
    <circle cx="10" cy="2.5" r="0.5" fill="currentColor"/>
    <path d="M4 8h-1.5M12 8h1.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

interface WiringIconComponentProps {
  wiringId: string;
  className?: string;
  size?: number;
}

export const WiringIcon: React.FC<WiringIconComponentProps> = ({ wiringId, className, size }) => {
  const iconComponents: Record<string, React.FC<WiringIconProps>> = {
    http: HttpIcon,
    websocket: WebSocketIcon,
    sse: SSEIcon,
    cron: CronIcon,
    queue: QueueIcon,
    queues: QueueIcon, // alias
    rpc: RPCIcon,
    mcp: MCPIcon,
  };

  const IconComponent = iconComponents[wiringId];
  
  if (!IconComponent) {
    return null;
  }

  return <IconComponent className={className} size={size} />;
};

// Backward compatibility alias
export const TransportIcon: React.FC<{transportId: string; className?: string; size?: number}> = ({ transportId, className, size }) => {
  return <WiringIcon wiringId={transportId} className={className} size={size} />;
};