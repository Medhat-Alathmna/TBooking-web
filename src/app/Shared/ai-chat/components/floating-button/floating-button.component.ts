import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { BadgeModule } from 'primeng/badge';
import { TooltipModule } from 'primeng/tooltip';
import { AiChatService } from '../../services/ai-chat.service';
import { PrimengComponentsModule } from 'src/app/primeng-components.module';

@Component({
  selector: 'app-floating-chat-button',
  standalone: true,
  imports: [CommonModule, ButtonModule, TooltipModule,PrimengComponentsModule],
  templateUrl: './floating-button.component.html',
  styleUrls: ['./floating-button.component.scss']
})
export class FloatingChatButtonComponent {
  unreadCount = 0;
  isRTL = false;

  constructor(private chatService: AiChatService) {
    // Determine direction based on language
    const currentLang = localStorage.getItem('currentLang') || 'en';
    this.isRTL = (currentLang === 'ar');
  }

  toggleChat(): void {
    this.chatService.toggleSidebar();
  }
}
