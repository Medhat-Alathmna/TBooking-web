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
      label: this.trans('Users'),
      command: event => {
        this.tabSelected = 'users'
      }
    },
    {
      label: this.trans('Roles'),
      command: event => {
        this.tabSelected = 'roles'
      }
    },
    
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
      this.users=results

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
