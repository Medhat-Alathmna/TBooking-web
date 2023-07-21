import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { ControlValueAccessor, FormControl, FormsModule, NG_VALUE_ACCESSOR } from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { PrimeNGConfig } from 'primeng/api';
import { CalendarModule } from 'primeng/calendar';

@Component({
  selector: 'app-calender',
  templateUrl: './calender.component.html',
  styleUrls: ['./calender.component.scss'],
  standalone:true,
  imports:[CalendarModule,CommonModule,FormsModule,TranslateModule],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: CalenderComponent,
      multi: true
    }]
})
export class CalenderComponent implements ControlValueAccessor {

  constructor(private config: PrimeNGConfig, private translateService: TranslateService) {
    this.translateService.get('calendar').subscribe(res => this.config.setTranslation(res));
   }
   innervalue
   @Input() title: string
   @Input() required: boolean=false
   @Input() placeholder: string
   @Input() showIcon: boolean =false
   @Input() showTime: boolean =false
   @Input() timeOnly: boolean =false
 
   private onTouchedCallback: () => void = () => {};
   private onChangeCallback: (_: any) => void = () => {};
 
   get value(): any {
     return this.innervalue;
   }
 
   set value(v: any) {
     if (v !== this.innervalue) {
       this.innervalue = v;
       this.onChangeCallback(v);
     }
   }
 
   writeValue(value: any) {
     if (value !== this.innervalue) {
       this.innervalue = value;
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

}
