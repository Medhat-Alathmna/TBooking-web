import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ModalComponent } from '../modal/modal.component';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { CalendarModule } from 'primeng/calendar';
import { SpeedDialModule } from 'primeng/speeddial';

@Component({
  selector: 'app-from-to-date',
  templateUrl: './from-to-date.component.html',
  styleUrls: ['./from-to-date.component.scss'],
  imports: [CalendarModule, CommonModule, FormsModule, TranslateModule, ModalComponent, SpeedDialModule],
  standalone: true,

})
export class FromToDateComponent implements OnInit {

  fromDate: any = new Date()
  toDate: any = new Date()
  @Input() display: boolean = false
  @Output() displayChange: EventEmitter<boolean> = new EventEmitter(false);
  @Output() dateChange = new EventEmitter<{ fromDate: string; toDate: string }>();
  constructor() { }

  ngOnInit(): void {
  }
  emitDates() {
    this.dateChange.emit({ fromDate: this.fromDate, toDate: this.toDate });
    this.display=false
  }
  onHide() {
    this.displayChange.emit(false)
  }
}
