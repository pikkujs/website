import React from 'react';

interface WiringIconProps {
  className?: string;
  size?: number;
}

export const HttpIcon: React.FC<WiringIconProps> = ({ className = "", size = 16 }) => (
  <div className={`inline-flex items-center justify-center ${className}`} style={{ width: size, height: size }}>
    <svg width={size} height={size} viewBox="0 0 32 32" className="text-green-600 dark:text-green-400" fill="currentColor">
      <path d="M30,11H25V21h2V18h3a2.0027,2.0027,0,0,0,2-2V13A2.0023,2.0023,0,0,0,30,11Zm-3,5V13h3l.001,3Z"/>
      <polygon points="10 13 12 13 12 21 14 21 14 13 16 13 16 11 10 11 10 13"/>
      <polygon points="23 11 17 11 17 13 19 13 19 21 21 21 21 13 23 13 23 11"/>
      <polygon points="6 11 6 15 3 15 3 11 1 11 1 21 3 21 3 17 6 17 6 21 8 21 8 11 6 11"/>
    </svg>
  </div>
);

export const WebSocketIcon: React.FC<WiringIconProps> = ({ className = "", size = 16 }) => (
  <div className={`inline-flex items-center justify-center ${className}`} style={{ width: size, height: size }}>
    <svg width={size} height={size} viewBox="0 -31.5 256 256" className="text-purple-600 dark:text-purple-400" fill="currentColor">
      <path d="M192.440223,144.644612 L224.220111,144.644612 L224.220111,68.3393384 L188.415329,32.5345562 L165.943007,55.0068785 L192.440223,81.5040943 L192.440223,144.644612 L192.440223,144.644612 Z M224.303963,160.576482 L178.017688,160.576482 L113.451687,160.576482 L86.954471,134.079266 L98.1906322,122.843105 L120.075991,144.728464 L165.104487,144.728464 L120.746806,100.286931 L132.06682,88.9669178 L176.4245,133.324599 L176.4245,88.2961022 L154.622994,66.4945955 L165.775303,55.3422863 L110.684573,0 L56.3485097,0 L56.3485097,0 L0,0 L31.6960367,31.6960367 L31.6960367,31.7798886 L31.8637406,31.7798886 L97.4359646,31.7798886 L120.662954,55.0068785 L86.7029152,88.9669178 L63.4759253,65.7399279 L63.4759253,47.7117589 L31.6960367,47.7117589 L31.6960367,78.9046839 L86.7029152,133.911562 L64.3144448,156.300033 L100.119227,192.104815 L154.45529,192.104815 L256,192.104815 L256,192.104815 L224.303963,160.576482 L224.303963,160.576482 Z"/>
    </svg>
  </div>
);

export const SSEIcon: React.FC<WiringIconProps> = ({ className = "", size = 16 }) => (
  <div className={`inline-flex items-center justify-center ${className}`} style={{ width: size, height: size }}>
    <svg width={size} height={size} viewBox="0 0 16 16" className="text-orange-600 dark:text-orange-400">
      <rect x="1.5" y="3.5" width="13" height="9" rx="1.5" stroke="currentColor" strokeWidth="1.5" fill="none"/>
      <path d="M4 6h8M4 8h6M4 10h4" stroke="currentColor" strokeWidth="1" strokeLinecap="round"/>
      <path d="M12 1l2 2-2 2M11 5V1" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  </div>
);

export const CronIcon: React.FC<WiringIconProps> = ({ className = "", size = 16 }) => (
  <div className={`inline-flex items-center justify-center ${className}`} style={{ width: size, height: size }}>
    <svg width={size} height={size} viewBox="0 0 24 24" className="text-yellow-600 dark:text-yellow-400" fill="none">
      <path d="M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" strokeWidth="2"/>
      <path d="M12 7L12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M21 4L20 3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  </div>
);

export const QueueIcon: React.FC<WiringIconProps> = ({ className = "", size = 16 }) => (
  <div className={`inline-flex items-center justify-center ${className}`} style={{ width: size, height: size }}>
    <svg width={size} height={size} viewBox="0 0 48 48" className="text-red-600 dark:text-red-400" fill="currentColor">
      <path d="M16,36a2,2,0,0,1-2-2V6a2,2,0,0,1,2-2h0a2,2,0,0,1,2,2V34a2,2,0,0,1-2,2Z"/>
      <path d="M24,36a2,2,0,0,1-2-2V6a2,2,0,0,1,2-2h0a2,2,0,0,1,2,2V34a2,2,0,0,1-2,2Z"/>
      <path d="M32,36a2,2,0,0,1-2-2V6a2,2,0,0,1,2-2h0a2,2,0,0,1,2,2V34a2,2,0,0,1-2,2Z"/>
      <path d="M39.7,26A2.1,2.1,0,0,0,38,28.1V40H10V28.1A2.1,2.1,0,0,0,8.3,26,2,2,0,0,0,6,28V42a2,2,0,0,0,2,2H40a2,2,0,0,0,2-2V28A2,2,0,0,0,39.7,26Z"/>
      <path d="M9.8,15.7,2.5,11.1c-.3-.2-.5-.1-.5.3v9.2c0,.4.2.5.5.3l7.3-4.6Q10.3,16,9.8,15.7Z"/>
      <path d="M45.8,15.7l-7.3-4.6c-.3-.2-.5-.1-.5.3v9.2c0,.4.2.5.5.3l7.3-4.6Q46.3,16,45.8,15.7Z"/>
    </svg>
  </div>
);

export const RPCIcon: React.FC<WiringIconProps> = ({ className = "", size = 16 }) => (
  <div className={`inline-flex items-center justify-center ${className}`} style={{ width: size, height: size }}>
    <svg width={size} height={size} viewBox="0 0 16 16" className="text-blue-600 dark:text-blue-400">
      <rect x="1.5" y="6.5" width="5" height="3" rx="0.5" stroke="currentColor" strokeWidth="1.5" fill="none"/>
      <rect x="9.5" y="6.5" width="5" height="3" rx="0.5" stroke="currentColor" strokeWidth="1.5" fill="none"/>
      <path d="M6.5 8h3" stroke="currentColor" strokeWidth="1.5"/>
      <path d="M7 7.5l1 0.5-1 0.5M9 7.5l-1 0.5 1 0.5" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  </div>
);

export const MCPIcon: React.FC<WiringIconProps> = ({ className = "", size = 16 }) => (
  <div className={`inline-flex items-center justify-center ${className}`} style={{ width: size, height: size }}>
    <svg width={size} height={size} viewBox="0 0 24 24" className="text-pink-600 dark:text-pink-400" fill="currentColor">
      <path d="M15.688 2.343a2.588 2.588 0 00-3.61 0l-9.626 9.44a.863.863 0 01-1.203 0 .823.823 0 010-1.18l9.626-9.44a4.313 4.313 0 016.016 0 4.116 4.116 0 011.204 3.54 4.3 4.3 0 013.609 1.18l.05.05a4.115 4.115 0 010 5.9l-8.706 8.537a.274.274 0 000 .393l1.788 1.754a.823.823 0 010 1.18.863.863 0 01-1.203 0l-1.788-1.753a1.92 1.92 0 010-2.754l8.706-8.538a2.47 2.47 0 000-3.54l-.05-.049a2.588 2.588 0 00-3.607-.003l-7.172 7.034-.002.002-.098.097a.863.863 0 01-1.204 0 .823.823 0 010-1.18l7.273-7.133a2.47 2.47 0 00-.003-3.537z"/>
      <path d="M14.485 4.703a.823.823 0 000-1.18.863.863 0 00-1.204 0l-7.119 6.982a4.115 4.115 0 000 5.9 4.314 4.314 0 006.016 0l7.12-6.982a.823.823 0 000-1.18.863.863 0 00-1.204 0l-7.119 6.982a2.588 2.588 0 01-3.61 0 2.47 2.47 0 010-3.54l7.12-6.982z"/>
    </svg>
  </div>
);

export const CLIIcon: React.FC<WiringIconProps> = ({ className = "", size = 16 }) => (
  <div className={`inline-flex items-center justify-center ${className}`} style={{ width: size, height: size }}>
    <svg width={size} height={size} viewBox="0 0 24 24" className="text-cyan-600 dark:text-cyan-400" fill="none">
      <rect x="2" y="4" width="20" height="16" rx="2" stroke="currentColor" strokeWidth="2"/>
      <path d="M7 10l3 3-3 3M12 16h5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  </div>
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
    cli: CLIIcon,
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