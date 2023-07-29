import { AfterContentChecked, ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { PrimengComponentsModule } from 'src/app/primeng-components.module';
import { CommonModule, DatePipe } from '@angular/common';
import { InputSwitchModule } from 'primeng/inputswitch';
import { BaseComponent, isSet } from 'src/app/core/base/base.component';
import { MessageService } from 'primeng/api';
import { CalenderService } from 'src/app/Modules/calender/calender.service';

@Component({
  selector: 'app-table',
  standalone: true,
  templateUrl: './table.component.html',
  imports: [CommonModule, PrimengComponentsModule, InputSwitchModule],
  styleUrls: ['./table.component.scss']
})
export class TableComponent extends BaseComponent implements OnInit, AfterContentChecked {

  constructor(private datePipe: DatePipe,messageService: MessageService,private cdr: ChangeDetectorRef,private calenderService:CalenderService) {
super(messageService)
  }
  @ViewChild('dt') table: any;

  @Input() lodaing: boolean = false
  @Input() caption: any
  @Input() data = []
  @Input() columns = []
  @Input() reorderableColumns: boolean = false
  @Input() actionsColumns = []
  @Input() actionsTemplate: any
  @Input() expandedTable: boolean = false
  @Input() paginator: any = true
  @Input() rowClass: any = ''
  @Input() scrollable = true
  @Input() scrollHeight: any = '75vh'
  @Input() moudleName: any
  @Input() endPoint: any
  @Input() hideSearch: boolean=false
  @Input() clearAllFillterBtn: boolean=false

  
  @Input() rowNum: any = 10
  @Input() currentPage: any = 1

  recoderDone = false
  @Output() inputSwitchChange: EventEmitter<any> = new EventEmitter();
  @Output() reorderColumn: EventEmitter<any> = new EventEmitter();
  @Output() onExpanded: EventEmitter<any> = new EventEmitter();

  selectedItem: any
  sortField: any
  sortMode: number = 1
  fillterFildes: any = {}
  queryTypes = {
    types1: [
      {
        type: 'Not Equal',
        value: 'ne'
      },
      {
        type: 'Equal',
        value: 'exact'
      },
      {
        type: 'Less than',
        value: 'lt'
      },
      {
        type: 'Greater Than',
        value: 'gt'
      },
    ],
    types2: [
      {
        type: 'Starts With',
        value: 'startswith'

      },
      {
        type: 'Equal',
        value: 'exact'
      },
      {
        type: 'Contains',
        value: 'contains'

      },
      {
        type: 'Ends With',
        value: 'endswith'

      },
    ],
    types3: [

      {
        type: 'true',
        value: 'true'
      },
      {
        type: 'false',
        value: 'false'
      }, {
        type: 'null',
        value: 'null'
      }
    ]


  }
  ngOnInit(): void {
    window.innerHeight > 1000 ? this.rowNum = 20 : this.rowNum = 10
  }


  getList(pageNum?: number, filter?: any, reset?: boolean) {
    if (!isSet(this.endPoint)) {
      return
    }
    this.lodaing = true
    this.currentPage = pageNum || 1
if (filter?.value instanceof Date) {
  console.log(filter?.value instanceof Date);
  
  filter.value =  this.datePipe.transform(filter?.value, 'dd/MM/yyy')
}
    this.calenderService.getlist(this.endPoint, this.currentPage, this.rowNum, filter,).subscribe((results:any) => {

      const cloneObj = results.data
      //
      this.lodaing = false

      if (reset) {
        this.data = Array(results.data?.count).fill(0)
      }
      if (!isSet(this.data)) {
        this.data = Array(results.data?.count).fill(0)
      }

      if (cloneObj.length < this.rowNum) {
        for (let index = cloneObj.length; index < this.rowNum; index++) {
          cloneObj[index] = null
        }
      }
      //
      if (!isSet(pageNum)) {
        cloneObj.map((item, index) => {
          this.data[index] = item
        })

      } else {
        const currentPage = pageNum * this.rowNum
        let cloneObjIndex = 0
        for (let index = currentPage - this.rowNum; index < currentPage; index++) {
          this.data[index] = cloneObj[cloneObjIndex++]
        }
      }
      //
      if (!isSet(results.data?.next)) {
        this.data = this.data.filter(item => {
          return isSet(item)
        })
      }
      // page param

      setTimeout(() => {
        this.table.first = pageNum > 1 ? (pageNum - 1) * this.rowNum : 0
      });

    },error=>{
      this.lodaing = false

    })
  }
  // clearFillter(query) {
  //   this.sharedService.queryFilters.map((item, index) => {
  //     if (item.type == query.type) {
  //       this.sharedService.queryFilters.splice(index, 1);
  //       this.getList(null, null, true)
  //     }
  //   })
  // }



  ngAfterContentChecked() {
    this.cdr.detectChanges();
  }
  onChangeInputSwitch(item) {
    this.inputSwitchChange.emit(item)
  }
  onChangeReorderColumn(evnent) {
    console.log(evnent);
    
    this.recoderDone = true
    this.reorderColumn.emit(evnent)
  }

  onExpandedColumn(evnent) {

    this.onExpanded.emit(evnent)
  }
}
export class Filter {
  name: string;
  value: any;
  type: string;
  status: boolean;

}