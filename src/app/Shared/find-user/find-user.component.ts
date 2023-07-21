import { CommonModule } from '@angular/common';
import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { ControlValueAccessor, FormControl, FormsModule, NG_VALUE_ACCESSOR } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { UserInfo } from 'os';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { isSet } from 'src/app/core/base/base.component';
import { ResponseBody } from 'src/app/modals/response';

@Component({
  selector: 'app-find-user',
  templateUrl: './find-user.component.html',
  styleUrls: ['./find-user.component.scss'],
  standalone: true,
  imports: [AutoCompleteModule, FormsModule, TranslateModule,CommonModule ],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: FindUserComponent,
      multi: true
    }]
})
export class FindUserComponent implements ControlValueAccessor {


  constructor() {
  }
  // selectedUser: UserInfo
  private innerselectedUser: any 

  @ViewChild('myinput') input;
  @Input() title: string
  @Input() multiple = false
  @Input() required: boolean=false
  @Input() hideTitle: boolean=false
  usersSuggestions: any[]=[]


  findUser(event) {
    setTimeout(() => {
      this.usersSuggestions.push(  {label:'Leena' },{label:'Hnan'})

    }, 1000);
    // this.coreService.findUser(event.query).subscribe((users: ResponseBody<any[]>) => {
    //   this.usersSuggestions = users.data
    // }, error => {
    // })
  }

  onBlur(){
    
    if (!this.selectedUser?.userName && this.multiple==false ) this.selectedUser=null
    if (!isSet(this.selectedUser) && this.multiple==true ) this.selectedUser=null

  }

  private onTouchedCallback: () => void = () => {};
  private onChangeCallback: (_: any) => void = () => {};

  get selectedUser(): any {
    return this.innerselectedUser;
  }

  set selectedUser(v: any) {
    if (v !== this.innerselectedUser) {
      this.innerselectedUser = v;
      this.onChangeCallback(v);
    }
  }

  writeValue(selectedUser: any) {
    if (selectedUser !== this.innerselectedUser) {
      this.innerselectedUser = selectedUser;
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
