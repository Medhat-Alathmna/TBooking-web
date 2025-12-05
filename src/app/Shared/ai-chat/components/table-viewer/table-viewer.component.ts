import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { TooltipModule } from 'primeng/tooltip';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-table-viewer',
  standalone: true,
  imports: [CommonModule, TableModule, CardModule, ButtonModule, DialogModule, TooltipModule,TranslateModule],
  templateUrl: './table-viewer.component.html',
  styleUrls: ['./table-viewer.component.scss']
})
export class TableViewerComponent implements OnInit {
  @Input() data: any[] = [];
  columns: string[] = [];
  showPreview = false;
  constructor(public translate: TranslateService) { }
  ngOnInit() {
    if (this.data && this.data.length > 0) {
      // Extract columns from first row, excluding 'id' and objects/arrays
      this.columns = Object.keys(this.data[0]).filter(key => {
        const value = this.data[0][key];
        // Exclude id, objects, and arrays
        return key !== 'id' && key !=='hide'&&key !=='publishedAt' && key !=='createdAt' && key !=='updatedAt' && key !=='notes' &&
               typeof value !== 'object' &&
               !Array.isArray(value);
      });
    }
  }

  formatValue(value: any): string {
    if (value === null || value === undefined) {
      return '-';
    }
    if (typeof value === 'boolean') {
      return value ? 'Yes' : 'No';
    }

    // Check if value is a date string (ISO format)
    if (typeof value === 'string' && this.isISODate(value)) {
      return this.formatDate(value);
    }

    return String(value);
  }

  private isISODate(value: string): boolean {
    // Check if string matches ISO 8601 date format
    const isoDateRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{3})?Z?$/;
    if (!isoDateRegex.test(value)) {
      return false;
    }

    // Verify it's a valid date
    const date = new Date(value);
    return !isNaN(date.getTime());
  }

  private formatDate(isoString: string): string {
    const date = new Date(isoString);

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');

    return `${year}-${month}-${day} ${hours}:${minutes}`;
  }

  openPreview(): void {
    this.showPreview = true;
  }

  closePreview(): void {
    this.showPreview = false;
  }
}
