import React from 'react';

interface TransportIconProps {
  className?: string;
  size?: number;
}

export const HttpIcon: React.FC<TransportIconProps> = ({ className = "", size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" className={`text-transport-http-light dark:text-transport-http-dark ${className}`}>
    <path d="M2 4h12a1 1 0 0 1 1 1v6a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1z" stroke="currentColor" strokeWidth="1.5" fill="none"/>
    <path d="M5 7h6M5 9h4" stroke="currentColor" strokeWidth="1" strokeLinecap="round"/>
  </svg>
);

export const WebSocketIcon: React.FC<TransportIconProps> = ({ className = "", size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" className={`text-transport-websocket-light dark:text-transport-websocket-dark ${className}`}>
    <circle cx="8" cy="8" r="6.5" stroke="currentColor" strokeWidth="1.5" fill="none"/>
    <path d="M5 6l3 3 3-3M11 10l-3-3-3 3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
    <circle cx="8" cy="8" r="1" fill="currentColor"/>
  </svg>
);

export const SSEIcon: React.FC<TransportIconProps> = ({ className = "", size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" className={`text-transport-sse-light dark:text-transport-sse-dark ${className}`}>
    <rect x="1.5" y="3.5" width="13" height="9" rx="1.5" stroke="currentColor" strokeWidth="1.5" fill="none"/>
    <path d="M4 6h8M4 8h6M4 10h4" stroke="currentColor" strokeWidth="1" strokeLinecap="round"/>
    <path d="M12 1l2 2-2 2M11 5V1" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

export const CronIcon: React.FC<TransportIconProps> = ({ className = "", size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" className={`text-transport-cron-light dark:text-transport-cron-dark ${className}`}>
    <circle cx="8" cy="8" r="6.5" stroke="currentColor" strokeWidth="1.5" fill="none"/>
    <path d="M8 4v4l3 2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <circle cx="8" cy="8" r="0.5" fill="currentColor"/>
  </svg>
);


export const QueueIcon: React.FC<TransportIconProps> = ({ className = "", size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" className={`text-transport-queue-light dark:text-transport-queue-dark ${className}`}>
    <rect x="1.5" y="4.5" width="13" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.5" fill="none"/>
    <path d="M4 7h2M4 9h3M10 7h2M10 9h2" stroke="currentColor" strokeWidth="1" strokeLinecap="round"/>
    <path d="M7 6v4" stroke="currentColor" strokeWidth="1.5"/>
  </svg>
);


export const RPCIcon: React.FC<TransportIconProps> = ({ className = "", size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" className={`text-transport-rpc-light dark:text-transport-rpc-dark ${className}`}>
    <rect x="1.5" y="6.5" width="5" height="3" rx="0.5" stroke="currentColor" strokeWidth="1.5" fill="none"/>
    <rect x="9.5" y="6.5" width="5" height="3" rx="0.5" stroke="currentColor" strokeWidth="1.5" fill="none"/>
    <path d="M6.5 8h3" stroke="currentColor" strokeWidth="1.5"/>
    <path d="M7 7.5l1 0.5-1 0.5M9 7.5l-1 0.5 1 0.5" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

interface TransportIconComponentProps {
  transportId: string;
  className?: string;
  size?: number;
}

export const TransportIcon: React.FC<TransportIconComponentProps> = ({ transportId, className, size }) => {
  const iconComponents: Record<string, React.FC<TransportIconProps>> = {
    http: HttpIcon,
    websocket: WebSocketIcon,
    sse: SSEIcon,
    cron: CronIcon,
    queue: QueueIcon,
    queues: QueueIcon, // alias
    rpc: RPCIcon,
  };

  const IconComponent = iconComponents[transportId];
  
  if (!IconComponent) {
    return null;
  }

  return <IconComponent className={className} size={size} />;
};