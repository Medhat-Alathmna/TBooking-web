import { Component, OnDestroy, OnInit } from '@angular/core';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { MessageService } from 'primeng/api';
import { Subscription } from 'rxjs';
import { ToastModule } from 'primeng/toast';
import { LoadingComponent } from 'src/app/Shared/loading/loading.component';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-base',
  template: '',
  standalone: true,
  imports: [ToastModule, TranslateModule, LoadingComponent],
})
export class BaseComponent implements OnInit, OnDestroy {

  subscriptions: Subscription[] = [];
  public loading = false;
  currentlang = 'en'

  fileTypes = ['image/png', 'application/pdf', 'application/vnd.ms-excel', "image/jpeg", ".doc", '.docx', '.ppt', '.pptx', '.xls', '.xlsx', '.csv', '.mp4', '.mov', '.wmv', '.avi', '.mkv']

  constructor(public messageService?: MessageService, public translates?: TranslateService) {

  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    this.unsubscribeAll(this.subscriptions);
  }

  public unsubscribeAll(subscriptions: Subscription[] = null): void {
    try {
      subscriptions.forEach((subscription: Subscription) => {
        if (isSet(subscription) && !subscription.closed) {
          subscription.unsubscribe();
        }
      });
    } catch (error) {
    }
  }

  // toast messages
  public successMessage(header: string, detail?: string) {
    if (!isSet(header)) {
      header = 'Successful'
    }
    this.messageService.add({ severity: 'success', summary: header, detail: detail || '' });

  }
  public errorMessage(header: string, detail?: string,) {
    if (!isSet(header)) {
      header = 'Error'
    }
    this.messageService?.add({ severity: 'error', summary: header, detail: detail || '' });

  }
  public infoMessage(header: string, detail?: string) {
    if (!isSet(header)) {
      header = 'Info'
    }
    this.messageService.add({ severity: 'info', summary: header, detail: detail || '' });

  }
  minString(word: string, length?) {
    if (!isSet(length)) length = 25
    if (word?.length > length) {
      return word.slice(0, length) + '...';
    } else {
      return word;
    }
  }
  arrayInsert(array,index, ...items){
     return array.splice( index, 0, ...items )    
  
  }
  trans(key: any): any {
    return this.translates?.instant(key)
  }

 
}
export const isSet = (value: any): boolean => {
  return value !== null && value !== undefined && value !== '' && value?.length !== 0 ;;
};

