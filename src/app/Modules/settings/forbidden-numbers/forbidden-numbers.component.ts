import { Component, OnInit, ViewChild } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { MessageService, ConfirmationService } from 'primeng/api';
import { BaseComponent, isSet } from 'src/app/core/base/base.component';
import { Notifications } from 'src/app/modals/notfi';
import { SettingsService } from '../settings.service';
import { CalenderService } from '../../calender/calender.service';

@Component({
  selector: 'app-forbidden-numbers',
  templateUrl: './forbidden-numbers.component.html',
  styleUrls: ['./forbidden-numbers.component.scss']
})
export class ForbiddenNumbersComponent extends BaseComponent implements OnInit {

  numbers:any=[]
  total:number
  rowNum: any = 10
  bodyDialog:boolean=false
  selectedNumber={number:null,name:null}
  currentPage: any = 1


  @ViewChild('kt') table: any;

  constructor(public translates: TranslateService, public messageService: MessageService, private calenderService:CalenderService,
    private confirmationService: ConfirmationService, private settingsService: SettingsService) { super(messageService, translates) }

  ngOnInit(): void {
    this.getNumbers(1, null)
  }


  getNumbers(pageNum?: number, query?: any) {
    this.loading=true
    const subscription = this.calenderService.getlist('forbidden-numbers',pageNum,10,query).subscribe((results: any) => {
      if (!isSet(results)) {
        return
      }
      this.loading=false
      const clone=results.data      
      this.total=results.meta.pagination.total
      if (!isSet(this.numbers)) {
        this.numbers = Array(this.total).fill(0)
      }
      if (clone.length < this.rowNum) {
        for (let index = clone.length; index < this.rowNum; index++) {
          clone[index] = null
        }
      }
      //
      if (!isSet(pageNum)) {
        clone.map((item, index) => {
          this.numbers[index] = item
        })

      } else {
        const currentPage = pageNum * this.rowNum
        let cloneObjIndex = 0
        for (let index = currentPage - this.rowNum; index < currentPage; index++) {
          this.numbers[index] = clone[cloneObjIndex++]
        }
      }
      //
      if (!isSet(this.numbers?.next)) {
        this.numbers = this.numbers.filter(item => {
          return isSet(item)
        })
      }
      setTimeout(() => {
        this.table.first = pageNum > 1 ? (pageNum - 1) * this.rowNum : 0
      });
      subscription.unsubscribe()
    }, error => {
      this.loading=false
      console.log(error);
      subscription.unsubscribe()
    })
  }
  initBody() {  
    this.selectedNumber={number:null,name:null}
    this.bodyDialog=true
  }
  createForbidNumbers() {
    this.loading=true
    const subscription = this.settingsService.createForbidNumbers(this.selectedNumber).subscribe((data) => {
      if (!isSet(data)) {
        return
      }      
      this.bodyDialog = false
      this.loading = false
      this.getNumbers(1, null)    
      subscription.unsubscribe()
    }, error => {
      this.loading = false
      subscription.unsubscribe()
    })
  }
  deleteNumber(id) {
    this.loading=true
    const subscription = this.settingsService.deletenumber(id).subscribe((data) => {
      if (!isSet(data)) {
        return
      }      
      this.loading = false
      this.getNumbers(1, null)
      subscription.unsubscribe()
    }, error => {
      this.loading = false
      subscription.unsubscribe()
    })
  }
  confirmDelete(id) {
    this.confirmationService.confirm({
      message: this.trans('Are you sure that you want to Delete this Entry ?'),
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => { this.deleteNumber(id) },
    });
  }
}

