import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { ApiService } from 'src/app/core/api.service';
import { AiResponse, BackendResponse } from '../models/ai-response.interface';
import { ConversationHistoryItem } from '../models/chat-message.interface';

@Injectable({ providedIn: 'root' })
export class AiChatService {
  private conversationHistory: ConversationHistoryItem[] = [];
  private sidebarOpenSubject = new BehaviorSubject<boolean>(false);
  private chatWidthSubject = new BehaviorSubject<number>(50); // percentage

  sidebarOpen$ = this.sidebarOpenSubject.asObservable();
  chatWidth$ = this.chatWidthSubject.asObservable();

  constructor(private api: ApiService) {
    this.loadHistory();
    this.loadWidth();
  }

  sendMessage(userMessage: string): Observable<AiResponse> {
    // Add user message to history
    this.conversationHistory.push({
      role: 'user',
      content: userMessage
    });

    // Send to backend
    return this.api.post<BackendResponse>('/assistant', {
      userMessage,
      conversationHistory: this.conversationHistory.map(h => ({
        role: h.role,
        content: h.content
      }))
    }).pipe(
      map(response => this.parseResponse(response)),
      tap(parsed => {
        // Save AI response to history with all data
        if (parsed.message) {
          this.conversationHistory.push({
            role: 'assistant',
            content: parsed.message,
            chartData: parsed.chartData,
            listData: parsed.listData,
            singleData: parsed.singleData,
            toolsUsed: parsed.toolsUsed
          });
          this.saveHistory();
        }
      })
    );
  }

  private parseResponse(response: BackendResponse): AiResponse {
    // Extract text from AIMessage (LangChain format)
    let message = 'No response available';

    if (response.response) {
      // Try to extract from different possible formats
      if (response.response.kwargs?.content) {
        message = response.response.kwargs.content;
      } else if (response.response.content) {
        message = response.response.content;
      } else if (typeof response.response === 'string') {
        message = response.response;
      }
    }

    const chartData = response.chartData?.used ? response.chartData.data : null;
    const listData = response.listData?.used ? response.listData.data : null;
    const singleData = response.singleData?.used ? response.singleData.data : null;

    // Save chart and table data to localStorage
    if (chartData) {
      this.saveChartData(chartData);
    }
    if (listData) {
      this.saveTableData(listData);
    }

    return {
      message,
      chartData,
      listData,
      singleData,
      toolsUsed: response.toolsUsed || []
    };
  }

  private saveChartData(chartData: any): void {
    try {
      const timestamp = Date.now();
      const chartItem = {
        id: `chart_${timestamp}`,
        data: chartData,
        timestamp
      };

      // Get existing charts
      const existing = this.getSavedCharts();
      existing.unshift(chartItem);

      // Keep only last 20 charts
      const limited = existing.slice(0, 20);

      localStorage.setItem('ai_charts', JSON.stringify(limited));
    } catch (error) {
      console.error('Failed to save chart data:', error);
    }
  }

  private saveTableData(tableData: any): void {
    try {
      const timestamp = Date.now();
      const tableItem = {
        id: `table_${timestamp}`,
        data: tableData,
        timestamp
      };

      // Get existing tables
      const existing = this.getSavedTables();
      existing.unshift(tableItem);

      // Keep only last 20 tables
      const limited = existing.slice(0, 20);

      localStorage.setItem('ai_tables', JSON.stringify(limited));
    } catch (error) {
      console.error('Failed to save table data:', error);
    }
  }

  getSavedCharts(): any[] {
    try {
      const saved = localStorage.getItem('ai_charts');
      return saved ? JSON.parse(saved) : [];
    } catch (error) {
      console.error('Failed to load saved charts:', error);
      return [];
    }
  }

  getSavedTables(): any[] {
    try {
      const saved = localStorage.getItem('ai_tables');
      return saved ? JSON.parse(saved) : [];
    } catch (error) {
      console.error('Failed to load saved tables:', error);
      return [];
    }
  }

  private saveHistory(): void {
    try {
      localStorage.setItem('ai_chat_history', JSON.stringify(this.conversationHistory));
    } catch (error) {
      console.error('Failed to save chat history:', error);
    }
  }

  private loadHistory(): void {
    try {
      const saved = localStorage.getItem('ai_chat_history');
      if (saved) {
        this.conversationHistory = JSON.parse(saved);
      }
    } catch (error) {
      console.error('Failed to load chat history:', error);
      this.conversationHistory = [];
    }
  }

  private loadWidth(): void {
    try {
      const savedWidth = localStorage.getItem('ai_chat_width');
      if (savedWidth) {
        const width = parseInt(savedWidth, 10);
        if (!isNaN(width) && width >= 20 && width <= 100) {
          this.chatWidthSubject.next(width);
        }
      }
    } catch (error) {
      console.error('Failed to load chat width:', error);
    }
  }

  clearHistory(): void {
    this.conversationHistory = [];
    try {
      localStorage.removeItem('ai_chat_history');
    } catch (error) {
      console.error('Failed to clear chat history:', error);
    }
  }

  getHistory(): ConversationHistoryItem[] {
    return [...this.conversationHistory];
  }

  toggleSidebar(): void {
    this.sidebarOpenSubject.next(!this.sidebarOpenSubject.value);
  }

  openSidebar(): void {
    this.sidebarOpenSubject.next(true);
  }

  closeSidebar(): void {
    this.sidebarOpenSubject.next(false);
  }

  setSidebarWidth(width: number): void {
    if (width >= 20 && width <= 100) {
      this.chatWidthSubject.next(width);
      try {
        localStorage.setItem('ai_chat_width', width.toString());
      } catch (error) {
        console.error('Failed to save chat width:', error);
      }
    }
  }

  getSidebarWidth(): number {
    return this.chatWidthSubject.value;
  }
}
