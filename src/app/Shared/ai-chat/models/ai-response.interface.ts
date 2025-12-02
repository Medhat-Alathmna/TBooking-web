export interface AiResponse {
  message: string;
  chartData: any | null;
  listData: any[] | null;
  singleData: any | null;
  toolsUsed: string[];
}

export interface BackendResponse {
  success: boolean;
  response: any;  // AIMessage from LangChain
  chartData?: {
    used: boolean;
    data: any;
  };
  listData?: {
    used: boolean;
    data: any[];
  };
  singleData?: {
    used: boolean;
    data: any;
  };
  toolsUsed?: string[];
  usedTool?: boolean;
  result?: any;
}
