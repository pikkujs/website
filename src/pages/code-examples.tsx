import React from 'react';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';
import CodeBlock from '@theme/CodeBlock';
import { tObject } from '../i18n';
import { TransportIcon } from '../components/TransportIcons';
import { TabComponent } from '../components/TabComponent';

/** Enhanced header for the code examples page */
function EnhancedHeader() {
  return (
    <header className="relative bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-blue-900 py-24 text-center overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-grid-pattern"></div>
      </div>
      
      <div className="relative max-w-screen-lg mx-auto px-4">
        <div className="flex justify-center mb-8">
          <div className="relative">
            <img
              src="/img/pikku-gradient.svg"
              alt="Pikku Logo"
              className="h-20 w-20 drop-shadow-lg"
            />
            <div className="absolute -inset-2 bg-white/20 rounded-full blur-xl"></div>
          </div>
        </div>
        
        <Heading as="h1" className="text-5xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
          Transport Examples
        </Heading>
        
        <p className="text-xl text-gray-700 dark:text-gray-200 max-w-3xl mx-auto leading-relaxed">
          See how the same business logic adapts seamlessly across HTTP, WebSockets, scheduled tasks, and more
        </p>
        
        <div className="mt-8 flex justify-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 dark:bg-gray-800/80 rounded-full text-sm text-gray-600 dark:text-gray-300 backdrop-blur-sm">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
            One function, every protocol
          </div>
        </div>
      </div>
    </header>
  );
}

/** Sticky navigation bar */
function StickyNav() {
  const navItems = [
    { id: 'functions', label: 'Functions', color: 'bg-blue-50 dark:bg-blue-900/20' },
    { id: 'http', label: 'HTTP', color: 'bg-green-50 dark:bg-green-900/20' },
    { id: 'websocket', label: 'WebSocket', color: 'bg-purple-50 dark:bg-purple-900/20' },
    { id: 'sse', label: 'SSE', color: 'bg-orange-50 dark:bg-orange-900/20' },
    { id: 'queues', label: 'Queues', color: 'bg-red-50 dark:bg-red-900/20' },
    { id: 'cron', label: 'Cron', color: 'bg-yellow-50 dark:bg-yellow-900/20' },
    { id: 'rpc', label: 'RPC', color: 'bg-indigo-50 dark:bg-indigo-900/20' },
    { id: 'mcp', label: 'MCP', color: 'bg-pink-50 dark:bg-pink-900/20' }
  ];

  return (
    <nav className="sticky top-[4rem] z-[100] bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm border-b border-gray-200 dark:border-gray-700 shadow-sm">
      <div className="max-w-screen-xl max-w-screen mx-auto px-4">
        <div className="flex flex-wrap items-center gap-2 justify-center py-3">
            {navItems.map((item) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                className={`px-3 py-2 text-sm font-medium rounded-lg transition-all hover:scale-105 whitespace-nowrap ${item.color} text-gray-700 dark:text-gray-200 hover:shadow-sm`}
              >
                {item.label}
              </a>
            ))}
          </div>
      </div>
    </nav>
  );
}

/** Pikku function definitions section */
function PikkuFunctionsSection() {
  const pikkuFunctionCode = `// Generated imports from Pikku CLI
import { 
  pikkuFunc, 
  pikkuSessionlessFunc, 
  pikkuChannelFunc,
  addHTTPRoute,
  addChannel,
  APIPermission
} from '../.pikku/pikku-types.gen.js'

// Type definitions
import type { Board, Card, OverdueCard } from '../types/kanban.js'

// Permission functions
const canAccessBoard: APIPermission<{ boardId: string }> = async (
  { boardService }, 
  { boardId }, 
  session
) => {
  return await boardService.userHasAccess(boardId, session.userId)
}

const canCreateCard: APIPermission = async (
  { }, 
  data, 
  session
) => {
  return session?.role === 'member' || session?.role === 'admin'
}

// Business logic functions

/** Retrieve a kanban board with all lists and cards */
export const getBoard = pikkuFunc({
  func: async (
    { boardService, logger },
    { boardId }: { boardId: string },
    { userId }
  ): Promise<Board> => {
    logger.info(\`Fetching board \${boardId} for user \${userId}\`)
    
    return await boardService.getBoard(boardId, userId)
  },
  permissions: {
    canAccessBoard
  }
})

/** Create a new card and broadcast the update to subscribers */
export const createCard = pikkuFunc({
  func: async (
    { boardService, eventHub, logger, channel },
    { listId, title, description }: { listId: string, title: string, description?: string },
    { userId }
  ): Promise<{ cardId: string }> => {
    logger.info(\`User \${userId} creating card: \${title}\`)
    
    const card = await boardService.createCard(listId, title, description, userId)

    // Broadcast card creation to board subscribers
    await eventHub?.publish(\`board:\${card.boardId}\`, {
      type: 'cardCreated',
      boardId: card.boardId,
      cardId: card.cardId,
      listId: card.listId
    }, channel?.channelId)
    
    return { cardId: card.cardId }
  },
  permissions: {
    canCreateCard
  }
})

/** Find overdue cards and send email notifications to users */
export const sendOverdueNotifications = pikkuSessionlessFunc<void, void>(
  async ({ boardService, emailService, logger }) => {
    logger.info(\`Checking for overdue cards at \${new Date().toISOString()}\`)
    
    const overdueCards = await boardService.getOverdueCards()
    
    await Promise.all(
      overdueCards.map(card => 
        emailService.sendOverdueNotification({
          to: card.userEmail,
          cardTitle: card.title,
          boardTitle: card.boardTitle,
          dueDate: card.dueDate
        })
      )
    )
    
    logger.info(\`Sent notifications for \${overdueCards.length} overdue cards\`)
  }
)

/** Subscribe to real-time updates for a specific board */
export const subscribeToBoardUpdates = pikkuChannelFunc<
  { boardId: string }, 
  void
>(async (
  { eventHub, channel, logger },
  { boardId }
) => {
  logger.info(\`Subscribing to updates for board \${boardId}\`)
  
  await eventHub?.subscribe(\`board:\${boardId}\`, channel.channelId)
})

/** Generate a PDF report of board status and notify when complete */
export const generateBoardReport = pikkuSessionlessFunc<
  { boardId: string },
  void
>(async (
  { boardService, pdfService, eventHub, logger },
  { boardId }
) => {
  logger.info(\`Generating PDF report for board \${boardId}\`)
  
  // Get board data with full details
  const boardData = await boardService.getBoardWithStats(boardId)
  
  // Generate PDF report
  const pdfPath = await pdfService.generateBoardReport(boardData)
  
  // Notify completion
  await eventHub?.publish(\`board:\${boardId}\`, {
    type: 'reportGenerated',
    boardId,
    pdfPath,
    timestamp: Date.now()
  })
  
  logger.info(\`PDF report generated: \${pdfPath}\`)
})`;

  return (
    <section className="py-16 bg-blue-50 dark:bg-blue-900/20">
      <div className="max-w-screen-xl mx-auto px-4">
        <div className="text-center mb-8">
          <Heading as="h2" className="text-3xl font-bold mb-4">
            Pikku Function Definitions
          </Heading>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Define your business logic once: Kanban boards, card management, notifications, and real-time collaboration
          </p>
        </div>
        
        <CodeBlock language="typescript" title="functions.ts">
          {pikkuFunctionCode}
        </CodeBlock>
      </div>
    </section>
  );
}


/** Simplified transport code example section */
function TransportCodeSection({
  title,
  description,
  functions,
  wiring,
  client,
  id,
  bgColor
}: {
  title: string;
  description: string;
  functions?: string;
  wiring?: string;
  client?: string;
  id: string;
  bgColor: string;
}) {
  return (
    <section id={id} className={`py-16 ${bgColor}`}>
      <div className="max-w-screen-xl mx-auto px-4">
        <div className="mb-8 text-center">
          <div className="flex items-center justify-center mb-4">
            <TransportIcon transportId={id} size={40} />
            <Heading as="h2" className="text-3xl font-bold ml-4">
              {title}
            </Heading>
          </div>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            {description}
          </p>
        </div>

        {/* Mobile Layout - Stacked */}
        <div className="block md:hidden w-full">
          <TabComponent
            className="w-full"
            tabs={[
              ...(wiring ? [{
                id: 'wiring',
                label: 'Wiring',
                content: (
                  <CodeBlock language="typescript" title={`${id}.wiring.ts`}>
                    {wiring}
                  </CodeBlock>
                )
              }] : []),
              ...(client ? [{
                id: 'client',
                label: 'Client',
                content: (
                  <CodeBlock language="typescript" title={`${id}.client.ts`}>
                    {client}
                  </CodeBlock>
                )
              }] : []),
              ...(functions ? [{
                id: 'functions',
                label: 'Functions',
                content: (
                  <CodeBlock language="typescript" title={`${id}.functions.ts`}>
                    {functions}
                  </CodeBlock>
                )
              }] : [])
            ]}
            defaultTab="wiring"
          />
        </div>

        {/* Desktop Layout - Stacked */}
        <div className="hidden md:block w-full space-y-8">
          {wiring && (
            <div>
              <h3 className="text-lg font-semibold mb-3">Wiring</h3>
              <CodeBlock language="typescript" title={`${id}.wiring.ts`}>
                {wiring}
              </CodeBlock>
            </div>
          )}
          
          {client && (
            <div>
              <h3 className="text-lg font-semibold mb-3">Client</h3>
              <CodeBlock language="typescript" title={`${id}.client.ts`}>
                {client}
              </CodeBlock>
            </div>
          )}
          
          {functions && (
            <div>
              <h3 className="text-lg font-semibold mb-3">Functions</h3>
              <CodeBlock language="typescript" title={`${id}.functions.ts`}>
                {functions}
              </CodeBlock>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

/** Main Code Examples page component */
export default function CodeExamples() {
  const transportSections = [
    { key: 'http', bgColor: 'bg-green-50 dark:bg-green-900/20' },
    { key: 'websocket', bgColor: 'bg-purple-50 dark:bg-purple-900/20' },
    { key: 'sse', bgColor: 'bg-orange-50 dark:bg-orange-900/20' },
    { key: 'queues', bgColor: 'bg-red-50 dark:bg-red-900/20' },
    { key: 'cron', bgColor: 'bg-yellow-50 dark:bg-yellow-900/20' },
    { key: 'rpc', bgColor: 'bg-indigo-50 dark:bg-indigo-900/20' },
    { key: 'mcp', bgColor: 'bg-pink-50 dark:bg-pink-900/20' }
  ];

  return (
    <Layout
      title="Transport Examples"
      description="See how the same business logic adapts seamlessly across HTTP, WebSockets, scheduled tasks, and more"
    >
      <EnhancedHeader />
      <StickyNav />
      <main>
        <div id="functions">
          <PikkuFunctionsSection />
        </div>
        
        {transportSections.map(({ key, bgColor }) => {
          const transport = tObject(`transports.${key}`) as {
            title: string;
            description: string;
            functions?: string;
            wiring?: string;
            client?: string;
          };

          return (
            <TransportCodeSection
              key={key}
              id={key}
              title={transport.title}
              description={transport.description}
              functions={transport.functions}
              wiring={transport.wiring}
              client={transport.client}
              bgColor={bgColor}
            />
          );
        })}
      </main>
    </Layout>
  );
}