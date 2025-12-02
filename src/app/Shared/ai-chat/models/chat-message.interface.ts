export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  chartData?: any;
  listData?: any[];
  singleData?: any;
  toolsUsed?: string[];
  isError?: boolean;
}

export interface ConversationHistoryItem {
  role: string;
  content: string;
  chartData?: any;
  listData?: any[];
  singleData?: any;
  toolsUsed?: string[];
}
