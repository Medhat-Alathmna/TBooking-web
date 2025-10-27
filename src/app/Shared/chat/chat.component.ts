import { Component, Input } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DashboardService } from '../dashboard.service';
import { tr } from 'date-fns/locale';
import { CommonModule } from '@angular/common';
import { AiDashboardComponent } from '../ai-dashboard/ai-dashboard.component';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { FormsModule } from '@angular/forms';
import { AssistantService } from '../assistant.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss'],
  standalone:true,
  imports:[CommonModule,AiDashboardComponent,DialogModule,ButtonModule,FormsModule]
})
export class ChatComponent {
  @Input() type
  visible = false; // نافذة الشات
  showDashboard = false; // نافذة الداشبورد
  dashboardData: any;
  message = '';
  messages: any[] = [];
  loading = false;

  constructor(private http: HttpClient, private dashboardService: DashboardService,private assistant:AssistantService) {
    this.dashboardService.dashboard$.subscribe((data) => {
      if (data) {
        this.dashboardData = data;
        this.showDashboard = true; // فتح نافذة الداشبورد
      }
    });
  }

  sendMessage() {
  const sub = this.assistant.ask(this.message, this.type).subscribe({
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

  closeDashboard() {
    this.showDashboard = false;
    this.dashboardData = null;
  }
}
