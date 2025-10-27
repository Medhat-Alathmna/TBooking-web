import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChartModule } from 'primeng/chart';
import { DashboardService } from '../dashboard.service';

@Component({
  selector: 'app-ai-dashboard',
  standalone: true,
  imports: [CommonModule,ChartModule],
  templateUrl: './ai-dashboard.component.html',
  styleUrls: ['./ai-dashboard.component.scss']
})
export class AiDashboardComponent implements OnInit {
dashboardWidgets=[]
dashboardData:any
  @Input() data: any;

  constructor(private dashboardService:DashboardService) { }

  ngOnInit(): void {
     this.dashboardService.dashboard$.subscribe((data) => {
      if (data) {
        this.dashboardData = data;
        this.generateDashboardFromJson(data);
      }
    });
  }
generateDashboardFromJson(dashboardData: any) {
      console.log('🎨 Generating dashboard', dashboardData);

  if (!dashboardData || !dashboardData.widgets) {
    console.warn('⚠️ Invalid dashboard data:', dashboardData);
    return;
  }

  // استخراج الألوان من الـ CSS Variables (PrimeNG Theme)
  const documentStyle = getComputedStyle(document.documentElement);
  const textColor = documentStyle.getPropertyValue('--text-color');
  const textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary');
  const surfaceBorder = documentStyle.getPropertyValue('--surface-border');

  // إعادة ضبط الرسوم السابقة
  this.dashboardWidgets = [];

  dashboardData.widgets.forEach((widget: any, index: number) => {
    // 🟢 1️⃣ إذا كان كارت إحصائي (Stat)
    if (widget.type === 'stat') {
      this.dashboardWidgets.push({
        type: 'stat',
        title: widget.label,
        value: widget.value,
        unit: widget.unit || '',
      });
    }

    // 🔵 2️⃣ إذا كان رسم بياني (Chart)
    else if (widget.type === 'chart') {
      const chartType = widget.chartType || dashboardData.dashboardType || 'bar';

      // تحديد المحاور
      const labels: string[] = [];
      const datasets: any[] = [];

      // 🧩 إذا كانت البيانات مفصولة داخل "datasets" (مثلاً double-bar)
      if (widget.datasets && Array.isArray(widget.datasets)) {
        widget.datasets.forEach((ds: any) => {
          datasets.push({
            label: ds.label,
            data: ds.data,
            backgroundColor: this.randomColor(0.3),
            borderColor: this.randomColor(1),
            borderWidth: 1,
          });
        });

        // في حالة double-bar نأخذ labels من widget.labels
        if (widget.labels) labels.push(...widget.labels);
      }

      // 🧩 أما إذا كانت بيانات بسيطة تحتوي على {date, value}
      else if (widget.data && Array.isArray(widget.data)) {
        const values = [];
        widget.data.forEach((d) => {
          const firstKey = Object.keys(d).find((k) => k !== 'date' && k !== 'label');
          labels.push(d.date || d.label || '');
          values.push(d[firstKey]);
        });

        datasets.push({
          label: widget.label,
          data: values,
          backgroundColor: this.randomColor(0.3),
          borderColor: this.randomColor(1),
          borderWidth: 1,
        });
      }

      const chartConfig = {
        type: chartType,
        data: { labels, datasets },
        options: {
          maintainAspectRatio: false,
          aspectRatio: 1.0,
          plugins: {
            legend: { labels: { color: textColor } },
            title: { display: !!widget.label, text: widget.label, color: textColor },
          },
          scales: {
            x: {
              ticks: { color: textColorSecondary, font: { weight: 500 } },
              grid: { color: surfaceBorder, drawBorder: false },
            },
            y: {
              ticks: { color: textColorSecondary },
              grid: { color: surfaceBorder, drawBorder: false },
            },
          },
        },
      };

      this.dashboardWidgets.push({
        type: 'chart',
        chartType,
        config: chartConfig,
      });
    }

    // 🟣 3️⃣ إذا كان جدول (Table)
    else if (widget.type === 'table') {
      this.dashboardWidgets.push({
        type: 'table',
        columns: widget.columns,
        rows: widget.data,
      });
    }
  });
}

/**
 * 🔹 Helper function to generate random colors for charts
 */
private randomColor(opacity = 1): string {
  const r = Math.floor(Math.random() * 255);
  const g = Math.floor(Math.random() * 255);
  const b = Math.floor(Math.random() * 255);
  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
}

}
