import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { MessageService } from 'primeng/api';
import { BaseComponent } from 'src/app/core/base/base.component';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent extends BaseComponent implements OnInit {

  tabSelected = 'users'
  users:any=[]


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
   this.users=[{
    name:'Medhat Alathamna',
    email:'MedhatAlathamna@gmail.com',
    role:'Employee',
    status:'Active',
  }]
  }

}
