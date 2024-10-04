import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { MessageService } from 'primeng/api';
import { BaseComponent, isSet } from 'src/app/core/base/base.component';
import { RoleInfo } from 'src/app/modals/role';
import { RolesService } from './roles.service';

@Component({
  selector: 'app-roles',
  templateUrl: './roles.component.html',
  styleUrls: ['./roles.component.scss']
})
export class RolesComponent extends BaseComponent implements OnInit {

  roles
 showRoleSidebar:boolean=false
 detailMode: boolean = false
selectedRole:RoleInfo
id


  constructor(public translates: TranslateService,private roleService:RolesService,
    public messageService: MessageService,) { super(messageService, translates)}

  ngOnInit(): void {
    this.getRoles()
  }

  showRoleSide(){
    this.selectedRole=new RoleInfo()
    this.detailMode=false
    this.showRoleSidebar=true
  }
  getRoles() {
    this.loading = true
    const subscription = this.roleService.getRoles().subscribe((results: any) => {
      this.loading = false
      if (!isSet(results)) {
        return
      }
      this.roles = results.data
      subscription.unsubscribe()
    }, error => {
      this.loading = false
      console.log(error);
      subscription.unsubscribe()
    })
  }
  showRoleDeatil(data:RoleInfo) {
    console.log(data.id);
    this.id=data.id
    this.detailMode = true
    this.selectedRole =data
    this.showRoleSidebar = true


  }
}
