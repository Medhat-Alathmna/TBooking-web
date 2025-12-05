import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subject } from 'rxjs';
import { finalize, takeUntil } from 'rxjs/operators';

import { SidebarModule } from 'primeng/sidebar';
import { ButtonModule } from 'primeng/button';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { TooltipModule } from 'primeng/tooltip';
import { AvatarModule } from 'primeng/avatar';

import { AiChatService } from '../../services/ai-chat.service';
import { ChatMessage } from '../../models/chat-message.interface';
import { MessageBubbleComponent } from '../message-bubble/message-bubble.component';
import { ChartViewerComponent } from '../chart-viewer/chart-viewer.component';
import { TableViewerComponent } from '../table-viewer/table-viewer.component';
import { RecordViewerComponent } from '../record-viewer/record-viewer.component';
import { LoadingComponent } from '../../../loading/loading.component';

@Component({
  selector: 'app-chat-sidebar',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    SidebarModule,
    ButtonModule,
    InputTextareaModule,
    TooltipModule,
    AvatarModule,
    MessageBubbleComponent,
    ChartViewerComponent,
    TableViewerComponent,
    RecordViewerComponent,
    LoadingComponent
  ],
  templateUrl: './chat-sidebar.component.html',
  styleUrls: ['./chat-sidebar.component.scss']
})
export class ChatSidebarComponent implements OnInit, OnDestroy {
  visible = false;
  sidebarWidth = 50; // percentage
  message = '';
  messages: ChatMessage[] = [];
  loading = false;
  sidebarPosition: 'left' | 'right' = 'right';

  // Suggestion prompts
  suggestions = [
    {
      category: 'Analytics & Reports',
      icon: 'pi-chart-bar',
      prompts: [
        'Show chart for total cash sales in last 7 days',
        'What are the most requested services this month?',
        'Give me a report of pending orders',
        'Total revenue this month'
      ]
    },
    {
      category: 'Appointments & Bookings',
      icon: 'pi-calendar',
      prompts: [
        'Show upcoming appointments for this week',
        'Display cancelled appointments in last month'
      ]
    },
    {
      category: 'Orders & Sales',
      icon: 'pi-shopping-cart',
      prompts: [
        'List of incomplete orders'
      ]
    },
    {
      category: 'Customers & Users',
      icon: 'pi-users',
      prompts: [
        'Who are the most active customers?',
        'Number of new customers this month',
        'Show customers who haven\'t booked in 3 months'
      ]
    },
    {
      category: 'Products & Services',
      icon: 'pi-box',
      prompts: [
        'What are the most profitable services?',
        'Show low stock products',
        'List of newly added services'
      ]
    }
  ];

  @ViewChild('messagesContainer') messagesContainer?: ElementRef<HTMLDivElement>;
  private destroy$ = new Subject<void>();

  constructor(private chatService: AiChatService) {}

  ngOnInit(): void {
    // Determine sidebar position based on language direction
    const currentLang = localStorage.getItem('currentLang') || 'en';
    this.sidebarPosition = (currentLang === 'ar') ? 'left' : 'right';

    // Listen to sidebar state
    this.chatService.sidebarOpen$
      .pipe(takeUntil(this.destroy$))
      .subscribe(open => {
        this.visible = open;
        if (open) {
          this.loadHistory();
          setTimeout(() => this.scrollToBottom(), 100);
        }
      });

    // Load saved width
    this.sidebarWidth = this.chatService.getSidebarWidth();
  }

  sendMessage(messageText?: string): void {
    const trimmed = (messageText || this.message).trim();
    if (!trimmed || this.loading) {
      return;
    }

    // Add user message
    this.messages.push({
      role: 'user',
      content: trimmed,
      timestamp: new Date()
    });

    this.message = '';
    this.loading = true;
    this.scrollToBottom();

    // Send to backend
    this.chatService.sendMessage(trimmed)
      .pipe(
        takeUntil(this.destroy$),
        finalize(() => {
          this.loading = false;
          this.scrollToBottom();
        })
      )
      .subscribe({
        next: (response) => {
          // Add AI response
          this.messages.push({
            role: 'assistant',
            content: response.message,
            timestamp: new Date(),
            chartData: response.chartData,
            listData: response.listData,
            singleData: response.singleData,
            toolsUsed: response.toolsUsed
          });
        },
        error: (err) => {
          console.error('AI Error:', err);
          this.messages.push({
            role: 'assistant',
            content: 'Sorry, an error occurred. Please try again.',
            timestamp: new Date(),
            isError: true
          });
        }
      });
  }

  selectSuggestion(prompt: string): void {
    this.sendMessage(prompt);
  }

  loadHistory(): void {
    const history = this.chatService.getHistory();
    this.messages = history.map(h => ({
      role: h.role as 'user' | 'assistant',
      content: h.content,
      timestamp: new Date(),
      chartData: h.chartData,
      listData: h.listData,
      singleData: h.singleData,
      toolsUsed: h.toolsUsed
    }));
  }

  clearChat(): void {
    if (confirm('Are you sure you want to clear the chat history?')) {
      this.chatService.clearHistory();
      this.messages = [];
    }
  }

  closeSidebar(): void {
    this.chatService.closeSidebar();
  }

  scrollToBottom(): void {
    setTimeout(() => {
      if (this.messagesContainer) {
        const element = this.messagesContainer.nativeElement;
        element.scrollTop = element.scrollHeight;
      }
    }, 100);
  }

  onKeyDown(event: KeyboardEvent): void {
    // Send on Enter (without Shift)
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.sendMessage();
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
