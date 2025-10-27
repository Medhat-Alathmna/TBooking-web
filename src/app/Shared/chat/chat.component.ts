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

    try {
      // 🧩 تحقق إذا كان الرد من نوع Dashboard JSON
      if (res && (res.type === 'dashboard' || res.dashboardType || res.widgets)) {
        // 🧠 حفظ البيانات لعرضها في Dialog خاص
        this.dashboardData = res;
        this.showDashboard = true;

        // إضافة رد نصي في الشات للتأكيد فقط
        this.messages.push({
          role: 'assistant',
          text: `📊 تم إنشاء لوحة القيادة (${res.title || 'Dashboard'})`
        });
      } else {
        // 🔹 الرد النصي العادي
        this.messages.push({
          role: 'assistant',
          text: res.reply || '🤖 لم يتم العثور على نتيجة.'
        });
      }
    } catch (err) {
      console.error('Error parsing assistant response:', err);
      this.messages.push({
        role: 'assistant',
        text: '⚠️ حدث خطأ أثناء تحليل الرد من المساعد.'
      });
    }
  },
  error: (err) => {
    console.error('Error:', err);
    this.messages.push({
      role: 'assistant',
      text: 'حدث خطأ أثناء الاتصال بالمساعد 😔'
    });
    this.loading = false;
  }
});
  }

  closeDashboard() {
    this.showDashboard = false;
    this.dashboardData = null;
  }
}
