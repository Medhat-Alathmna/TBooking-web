import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DashboardService } from '../dashboard.service';
import { th, tr } from 'date-fns/locale';
import { CommonModule } from '@angular/common';
import { AiDashboardComponent } from '../ai-dashboard/ai-dashboard.component';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { FormsModule } from '@angular/forms';
import { AssistantService } from '../assistant.service';
import { ChipsModule } from "primeng/chips";
import { InputTextareaModule } from "primeng/inputtextarea";

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss'],
  standalone: true,
  imports: [CommonModule, AiDashboardComponent, DialogModule, ButtonModule, FormsModule, ChipsModule, InputTextareaModule]
})
export class ChatComponent {
  @Input() type
  visible = false; // نافذة الشات
  showDashboard = false; // نافذة الداشبورد
  dashboardData: any;
  message = '';
  messages: any[] = [];
  loading = false;
  @ViewChild('chatBody') chatBody!: ElementRef

  constructor(private http: HttpClient, private dashboardService: DashboardService, private assistant: AssistantService) {
    this.dashboardService.dashboard$.subscribe((data) => {
      if (data) {
        this.dashboardData = data;
        this.showDashboard = true; // فتح نافذة الداشبورد
      }
    });
  }

  sendMessage() {

    if (!this.message.trim()) return;
    this.dashboardData = null;
    this.showDashboard = false;
    this.loading = true;
    const userMsg = { text: this.message, isUser: true, time: new Date() };
    this.messages.push(userMsg);
    this.scrollToBottom();
    let copyMsg = this.message;
    console.log(copyMsg);
    
    this.message = '';
    const sub = this.assistant.ask(copyMsg, this.type).subscribe({
      next: (res) => {
        this.loading = false;
        // 🧠 منطق موحّد لمعالجة الأنواع الجديدة
        switch (res.type) {
          case 'summary':
            this.messages.push({
              role: 'assistant',
              text: res.summary?.text || '🤖 لا يوجد ملخص متاح.'
            });
            break;

          case 'dashboard':
            this.messages.push({
              role: 'assistant',
              text: `📊 تم إنشاء لوحة "${res.title}" بنجاح!`
            });
            this.dashboardData = res; // <-- لتخزين JSON
            this.dashboardService.createDashboard(res);

            this.showDashboard = true; // <-- لفتح نافذة الداشبورد
            break;

          case 'clarify':
            this.messages.push({
              role: 'assistant',
              text:
                res.summary?.text ||
                '❓ لم أفهم سؤالك بدقة. هل يمكنك التوضيح أكثر؟'
            });
            if (res.suggestions?.length) {
              res.suggestions.forEach((s: string) =>
                this.messages.push({ role: 'assistant', text: `💡 ${s}` })
              );
            }
            break;

          default:
            this.messages.push({
              role: 'assistant',
              text: res.reply || '🤖 لا يوجد رد.'
            });
        }
      },
      error: (err) => {
        console.error('Error:', err);
        this.loading = false;
        this.messages.push({
          role: 'assistant',
          text: 'حدث خطأ أثناء الاتصال بالمساعد 😔'
        });
      }
    });
  }
  scrollToBottom() {
    setTimeout(() => {
      this.chatBody.nativeElement.scrollTop = this.chatBody.nativeElement.scrollHeight;
    }, 100);
  }
  closeDashboard() {
    this.showDashboard = false;
    this.dashboardData = null;
  }
}
