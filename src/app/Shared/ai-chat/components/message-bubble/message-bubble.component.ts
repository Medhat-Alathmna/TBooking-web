import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChipModule } from 'primeng/chip';
import { ChatMessage } from '../../models/chat-message.interface';

@Component({
  selector: 'app-message-bubble',
  standalone: true,
  imports: [CommonModule, ChipModule],
  templateUrl: './message-bubble.component.html',
  styleUrls: ['./message-bubble.component.scss']
})
export class MessageBubbleComponent {
  @Input() message!: ChatMessage;
  @Input() isUser = false;

  getToolLabel(tool: string): string {
    const labels: { [key: string]: string } = {
      'get_list_data': 'قائمة البيانات',
      'get_chart_data': 'رسم بياني',
      'get_single_data': 'سجل واحد'
    };
    return labels[tool] || tool;
  }
}
