import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { MultiSelectModule } from 'primeng/multiselect';
import { saveAs } from 'file-saver';
import { HttpClient } from '@angular/common/http';
import { ButtonModule } from 'primeng/button';
import { isSet } from 'src/app/core/base/base.component';
import { CalenderService } from 'src/app/Modules/calender/calender.service';
import { is } from 'date-fns/locale';
import { DialogModule } from 'primeng/dialog';
import { InputComponent } from '../input/input.component';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { PermissionService } from 'src/app/core/permission.service';

@Component({
  selector: 'app-excel-export',
  templateUrl: './excel-export.component.html',
  styleUrls: ['./excel-export.component.scss'],
  standalone: true,
  providers: [MessageService],
  imports: [CommonModule, TranslateModule, MultiSelectModule, FormsModule, ButtonModule, DialogModule, InputComponent, ToastModule]
})
export class ExcelExportComponent implements OnInit {
  selectedKeys = [];
  loading = false
  showDialog = false
  password
    lang = localStorage.getItem('currentLang')
  @Input() keys = [];
  @Input() collection;
  @Input() page;
  //  @Output() export = new EventEmitter<any>();

  constructor(public permissionService: PermissionService,private http: HttpClient, private calenderService: CalenderService, public messageService?: MessageService, ) { }

  ngOnInit(): void {
  }
  exportExcel() {
    this.loading = true
    this.calenderService.exportExcel(this.selectedKeys, this.collection, this.password).subscribe({
      next: (blob) => saveAs(blob, `${this.collection}.xlsx`),
      error: (error) => {
        this.messageService.add({ severity: 'error', detail: error?.error?.message || error?.error.error?.message || 'Something went wrong' })
      },
      complete: () => {
        this.loading = false;
        this.showDialog = false;
        this.password = null;
        this.selectedKeys = [];
      }
    });
  }

  onSubmit(event) {
    if (!isSet(this.selectedKeys)) {
      return alert('Please select at least one key to export.');
    }
    this.showDialog = true
    this.password = null
  }

}
