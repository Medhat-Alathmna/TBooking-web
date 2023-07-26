import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ControlValueAccessor, FormControl, FormsModule, NG_VALUE_ACCESSOR } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { MultiSelectModule } from 'primeng/multiselect';

@Component({
  selector: 'app-multi-select',
  templateUrl: './multi-select.component.html',
  styleUrls: ['./multi-select.component.scss'],
  standalone: true,
  imports: [MultiSelectModule, FormsModule, TranslateModule, CommonModule],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: MultiSelectComponent,
      multi: true
    }]

})
export class MultiSelectComponent implements ControlValueAccessor {

  constructor() { }
  @Input() title: string
  @Input() price: number
  @Input() placeholder: string
  @Input() required: boolean = false
  @Input() disabled: boolean

  innerSelectedStatus
  @Input() statues: any[] = []
  @Input() showColor: boolean = true
  @Input() optionLabel = 'name'


  private onTouchedCallback: () => void = () => { };
  private onChangeCallback: (_: any) => void = () => { };

  get selectedStatus(): any {
    return this.innerSelectedStatus;
  }

  set selectedStatus(v: any) {
    if (v !== this.innerSelectedStatus) {
      this.innerSelectedStatus = v;
      this.onChangeCallback(v);
    }
  }

  writeValue(selectedStatus: any) {
    if (selectedStatus !== this.innerSelectedStatus) {
      this.innerSelectedStatus = selectedStatus;
    }
  }

  registerOnChange(fn: any) {
    this.onChangeCallback = fn;
  }

  registerOnTouched(fn: any) {
    this.onTouchedCallback = fn;
  }

  public validate(c: FormControl) {
    return c.errors;
  }
  selectedStatusChange(items) {
    this.statues.map(item => {
      if (item['active'] == true) {
        item['active'] = false
      }
    })
    
    items.map(item => {

      item['active'] = true


    })
 


  }
}