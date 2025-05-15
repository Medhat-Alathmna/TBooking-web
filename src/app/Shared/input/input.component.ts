import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, ElementRef, Input, ViewChild , forwardRef,ChangeDetectorRef} from '@angular/core';
import { ControlValueAccessor, FormControl, FormsModule, NG_VALUE_ACCESSOR } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { ButtonModule } from 'primeng/button';
import {InputTextModule} from 'primeng/inputtext';
import { OverlayPanelModule } from 'primeng/overlaypanel';

@Component({
  selector: 'app-input',
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.scss'],
  standalone:true,
  imports:[InputTextModule,CommonModule,FormsModule,TranslateModule,OverlayPanelModule,ButtonModule ],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
          useExisting: forwardRef(() => InputComponent),
      multi: true
    }]
})
export class InputComponent implements ControlValueAccessor,AfterViewInit {
  
  @Input() title: string
  @Input() number: number =0
  @Input() title2: string
  @Input() type: string='text'
  @Input() class: string
  @Input() required: boolean=false
  @Input() plus: boolean=false
  @Input() placeholder: string
  @Input() hideTitle: boolean
  @Input() disabled: boolean
  @Input() focus: boolean=false

  @ViewChild('op') op: any;
  @ViewChild('inputShared') inputShared: ElementRef<HTMLInputElement>;

  constructor(private cdr: ChangeDetectorRef) { }
  innervalue
  innernumber
 

  private onTouchedCallback: () => void = () => {};
  private onChangeCallback: (_: any) => void = () => {};

  ngAfterViewInit(): void {
    if (this.focus) {
       setTimeout(() => {
      this.inputShared.nativeElement.select();
          this.cdr.detectChanges();

    });
    }
  }

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

  onKeyEnter(event) {
    if (event.keyCode === 13) {
      this.op.hide()
      this.value=+this.number
      this.cdr.detectChanges();

    }
  }
  public selectInput() {
    if (this.focus) {
      setTimeout(() => {
        this.inputShared.nativeElement.select();
        this.cdr.detectChanges();
      });
    }
  }

}
