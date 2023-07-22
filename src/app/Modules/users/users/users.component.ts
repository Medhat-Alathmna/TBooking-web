import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { MessageService } from 'primeng/api';
import { BaseComponent } from 'src/app/core/base/base.component';
import { UserInfo } from 'src/app/modals/User';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent extends BaseComponent implements OnInit {

  tabSelected = 'users'
  detailMode:boolean=false
  showUserSidebar:boolean=false
  users:UserInfo[]=[]
  selectedUser:UserInfo


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

  constructor(public translates: TranslateService,public messageService: MessageService,)
   { super(messageService,translates)}

  ngOnInit(): void {
  }
  showUserSide(){
    this.selectedUser=new UserInfo
    this.showUserSidebar=true
    this.detailMode=false
  }
}
