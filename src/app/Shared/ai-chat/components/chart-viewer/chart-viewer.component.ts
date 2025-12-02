import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChartModule } from 'primeng/chart';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { TooltipModule } from 'primeng/tooltip';

@Component({
  selector: 'app-chart-viewer',
  standalone: true,
  imports: [CommonModule, ChartModule, CardModule, ButtonModule, DialogModule, TooltipModule],
  templateUrl: './chart-viewer.component.html',
  styleUrls: ['./chart-viewer.component.scss']
})
export class ChartViewerComponent implements OnInit {
  @Input() data: any;
  chartConfig: any;
  showPreview = false;

  ngOnInit() {
    this.buildChart();
  }

  buildChart() {
    if (!this.data || !Array.isArray(this.data)) {
      return;
    }

    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue('--text-color') || '#333';
    const surfaceBorder = documentStyle.getPropertyValue('--surface-border') || '#ddd';

    // Extract data from series
    const labels: string[] = [];
    const datasets: any[] = [];

    this.data.forEach((series: any, index: number) => {
      if (series.labels && series.points) {
        // Use labels from first series
        if (labels.length === 0) {
          labels.push(...series.labels);
        }

        // Generate color based on index
        const hue = (index * 60) % 360;
        const backgroundColor = `hsla(${hue}, 70%, 60%, 0.2)`;
        const borderColor = `hsl(${hue}, 70%, 50%)`;

        datasets.push({
          label: series.metric || 'Data',
          data: series.points,
          backgroundColor: backgroundColor,
          borderColor: borderColor,
          borderWidth: 2,
          fill: true,
          tension: 0.4
        });
      }
    });

    if (datasets.length === 0) {
      return;
    }

    this.chartConfig = {
      type: 'line',
      data: { labels, datasets },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            labels: { color: textColor }
          }
        },
        scales: {
          x: {
            ticks: { color: textColor },
            grid: { color: surfaceBorder }
          },
          y: {
            ticks: { color: textColor },
            grid: { color: surfaceBorder }
          }
        }
      }
    };
  }

  openPreview(): void {
    this.showPreview = true;
  }

  closePreview(): void {
    this.showPreview = false;
  }
}
