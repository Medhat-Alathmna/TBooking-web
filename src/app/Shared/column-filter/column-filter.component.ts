import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { ControlValueAccessor } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { TranslateModule } from '@ngx-translate/core';
import { Filter } from 'src/app/modals/filter';
import { PrimengComponentsModule } from 'src/app/primeng-components.module';

@Component({
  selector: 'app-column-filter',
  templateUrl: './column-filter.component.html',
  styleUrls: ['./column-filter.component.scss'],
  standalone: true,

  imports: [CommonModule, PrimengComponentsModule, TranslateModule],
})
export class ColumnFilterComponent implements ControlValueAccessor {
  @Input() filterValue: Filter = new Filter();
  @Output() refresh = new EventEmitter<Filter>(null);
  @Output() clear = new EventEmitter<boolean>(false);
  queryTypes = [
    {
      type: 'Not Equal',
      value: '$ne',
    },
    {
      type: 'Equal',
      value: '$containsi',
    },
    {
      type: 'Less than',
      value: '$lte',
    },
    {
      type: 'Greater Than',
      value: '$gte',
    },
  ];
   booleanList = [
      { label: 'Yes', value: true },
      { label: 'No', value: false },
    ];
  private onTouchedCallback: () => void = () => {};
  private onChangeCallback: (_: any) => void = () => {};
  constructor(private cdr: ChangeDetectorRef) {}

 get value(): any {
    return this.filterValue;
  }

  set value(v: any) {
    if (v !== this.filterValue) {
      this.filterValue = v;
      this.onChangeCallback(v);
    }
  }

  writeValue(value: any) {
    if (value !== this.filterValue) {
      this.filterValue = value;
    }
  }

  registerOnChange(fn: any) {
    this.onChangeCallback = fn;
  }

  registerOnTouched(fn: any) {
    this.onTouchedCallback = fn;
  }
  applyFilter() {
    if( this.value.name=='createdAt') this.value.status = true
    this.refresh.emit(this.value);
    this.cdr.detectChanges();
  }
  clearFilter() {
    this.value.status = false;
    this.value.value = null;
    this.clear.emit(true);
    this.cdr.detectChanges();
  }

}
