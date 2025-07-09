import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { MultiSelectModule } from 'primeng/multiselect';
import { saveAs } from 'file-saver';
import { HttpClient } from '@angular/common/http';
import { ButtonModule } from 'primeng/button';
import { isSet } from 'src/app/core/base/base.component';
import { CalenderService } from 'src/app/Modules/calender/calender.service';
import { is } from 'date-fns/locale';

@Component({
  selector: 'app-excel-export',
  templateUrl: './excel-export.component.html',
  styleUrls: ['./excel-export.component.scss'],
  standalone: true,
  imports: [CommonModule, TranslateModule, MultiSelectModule, FormsModule, ButtonModule]
})
export class ExcelExportComponent implements OnInit {
  selectedKeys = [];
  loading = false
  @Input() keys = [];
  @Input() collection;
  //  @Output() export = new EventEmitter<any>();

  constructor(private http: HttpClient, private calenderService: CalenderService) { }

  ngOnInit(): void {
  }
  exportExcel() {
    this.loading = true
    this.calenderService.exportExcel(this.selectedKeys, this.collection).subscribe({
      next: (blob) => saveAs(blob, `${this.collection}.xlsx`),
      error: (err) => console.error('Download failed', err),
    });
  }

  onSubmit(event) {
    if (!isSet(this.selectedKeys)) {
      return alert('Please select at least one key to export.');
    }
    this.exportExcel()
  }
}
