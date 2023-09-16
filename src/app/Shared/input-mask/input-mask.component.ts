import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ControlValueAccessor, FormControl, FormsModule, NG_VALUE_ACCESSOR } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import {InputTextModule} from 'primeng/inputtext';
import {ButtonModule} from 'primeng/button';
import {InputNumberModule} from 'primeng/inputnumber';
import { InputMaskModule } from 'primeng/inputmask';
import { SettingsService } from 'src/app/Modules/settings/settings.service';
import { isSet } from 'src/app/core/base/base.component';
import { TooltipModule } from 'primeng/tooltip';
import { ModalComponent } from '../modal/modal.component';


@Component({
  selector: 'app-input-mask',
  templateUrl: './input-mask.component.html',
  styleUrls: ['./input-mask.component.scss'],
  standalone:true,
  imports:[InputTextModule,CommonModule,FormsModule,TranslateModule,ButtonModule,InputMaskModule,TooltipModule,ModalComponent],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: InputMaskComponent,
      multi: true
    }]
 
})

export class InputMaskComponent implements  ControlValueAccessor {
  
  @Input() title: string
  @Input() class: string
  @Input() required: boolean=false
  @Input() placeholder: string
  @Input() hideTitle: boolean
  @Input() disabled: boolean
  @Input() numberInput: boolean=false
  lang = localStorage.getItem('currentLang')
  loading:any
  innervalue

  private onTouchedCallback: () => void = () => {};
  private onChangeCallback: (_: any) => void = () => {};

  @Output() clickBtn: EventEmitter<any> = new EventEmitter();

  constructor(private settingsService: SettingsService,) { }




 


 

  get value(): any {
    return this.innervalue;
  }

  set value(v: any) {
    
      this.innervalue = v;
      this.onChangeCallback(v);
    
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
  clickBtn_(){
this.clickBtn.emit('')
  }

  checkForbidenNumber(){
    this.loading = 'pros'
    const subscription = this.settingsService.checkForbidNumbers(this.value).subscribe((data:any) => {
      this.loading = false
      if (!isSet(data)) {
        return
      }
      this.loading=data.data.length?'no':'ok'
      console.log(data);
      
      subscription.unsubscribe()
    }, error => {
      this.loading = null
      subscription.unsubscribe()
    })
  }

}
