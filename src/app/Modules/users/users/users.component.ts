import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { MessageService } from 'primeng/api';
import { BaseComponent, isSet } from 'src/app/core/base/base.component';
import { UserInfo } from 'src/app/modals/User';
import { UsersService } from '../users.service';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent extends BaseComponent implements OnInit {

  tabSelected = 'users'
  detailMode: boolean = false
  showUserSidebar: boolean = false
  users: UserInfo[] = []
  selectedUser: UserInfo


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

  constructor(public translates: TranslateService, public messageService: MessageService, private userService: UsersService) { super(messageService, translates) }

  ngOnInit(): void {
    this.getUsers()
  }
  showUserSide() {
    this.selectedUser = new UserInfo
    this.showUserSidebar = true
    this.detailMode = false
  }

  getUsers() {
    this.loading = true
    const subscription = this.userService.getUsers().subscribe((results: UserInfo[]) => {
      this.loading = false
      if (!isSet(results)) {
        return
      }
      this.users = UserInfo.cloneManyObjects(results)
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
