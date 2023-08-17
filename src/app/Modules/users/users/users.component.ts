import { Component, OnInit, ViewChild } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { MessageService } from 'primeng/api';
import { BaseComponent, isSet } from 'src/app/core/base/base.component';
import { UserInfo } from 'src/app/modals/User';
import { UsersService } from '../users.service';
import { CalenderService } from '../../calender/calender.service';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent extends BaseComponent implements OnInit {

  tabSelected = 'users'
  detailMode: boolean = false
  showUserSidebar: boolean = false
  users: any = []
  selectedUser: UserInfo
  rowNum: any = 10
  currentPage: any = 1
  total

  @ViewChild('kt') table: any;

  tabIndex = [
    {
      label: 'Users',
      command: event => {
        this.tabSelected = 'users'
      }
    },
    {
      label: 'Roles',
      command: event => {
        this.tabSelected = 'roles'
      }
    }
  ]

  constructor(public translates: TranslateService, public messageService: MessageService, private calenderService:CalenderService, private userService: UsersService) { super(messageService, translates) }

  ngOnInit(): void {
    this.getUsers(1,null)
  }
  showUserSide() {
    this.selectedUser = new UserInfo
    this.showUserSidebar = true
    this.detailMode = false
  }

  getUsers(pageNum?: number, query?: any) {
    this.loading = true
    const subscription = this.calenderService.getlist('users',pageNum,10,query).subscribe((results: any) => {
      this.loading = false
      if (!isSet(results)) {
        return
      }
      console.log(results);
      
      const clone=results
      if (!isSet(this.users)) {
        this.users = Array(this.total).fill(0)
      }
      if (clone.length < this.rowNum) {
        for (let index = clone.length; index < this.rowNum; index++) {
          clone[index] = null
        }
      }
      //
      if (!isSet(pageNum)) {
        clone.map((item, index) => {
          this.users[index] = item
        })

      } else {
        const currentPage = pageNum * this.rowNum
        let cloneObjIndex = 0
        for (let index = currentPage - this.rowNum; index < currentPage; index++) {
          this.users[index] = clone[cloneObjIndex++]
        }
      }
      //
      if (!isSet(this.users?.next)) {
        this.users = this.users.filter(item => {
          return isSet(item)
        })
      }
      setTimeout(() => {
        this.table.first = pageNum > 1 ? (pageNum - 1) * this.rowNum : 0
      });
      subscription.unsubscribe()
    }, error => {
      this.loading = false
      console.log(error);
      subscription.unsubscribe()
    })
  }
  showUserDeatil(data:UserInfo) {
    this.detailMode = true
    this.selectedUser =UserInfo.cloneObject(data) 
    this.showUserSidebar = true


  }
}
