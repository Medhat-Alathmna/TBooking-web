import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';

interface FieldDisplay {
  key: string;
  value: string;
}

@Component({
  selector: 'app-record-viewer',
  standalone: true,
  imports: [CommonModule, CardModule, ButtonModule],
  templateUrl: './record-viewer.component.html',
  styleUrls: ['./record-viewer.component.scss']
})
export class RecordViewerComponent {
  @Input() data: any;
  @Input() aiResponseText?: string;
  @Output() recordOpen = new EventEmitter<{ id: number; type: string }>();

  getFields(): FieldDisplay[] {
    if (!this.data?.record) {
      return [];
    }

    const record = this.data.record;
    return Object.keys(record)
      .filter(k => {
        const value = record[k];

        // Exclude id
        if (k === 'id') return false;

        // Exclude null/undefined
        if (value === null || value === undefined) return false;

        // Exclude objects and arrays to prevent JSON display
        if (typeof value === 'object') return false;

        return true;
      })
      .map(k => ({
        key: this.formatKey(k),
        value: this.formatValue(record[k])
      }));
  }

  formatKey(key: string): string {
    // Convert camelCase to Title Case
    return key
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, str => str.toUpperCase())
      .trim();
  }

  formatValue(value: any): string {
    // Objects should already be filtered out in getFields()
    // This is just a safety fallback
    if (typeof value === 'object' && value !== null) {
      return '[Object]';
    }
    if (typeof value === 'boolean') {
      return value ? 'Yes' : 'No';
    }
    if (typeof value === 'number') {
      return value.toString();
    }
    return String(value);
  }

  openRecord(): void {
    if (this.data?.id && this.data?.type) {
      this.recordOpen.emit({
        id: this.data.id,
        type: this.data.type
      });
      // Future: Add navigation
      // this.router.navigate([`/${this.data.type}`, this.data.id]);
    }
  }
}
