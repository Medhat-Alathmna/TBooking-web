import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { InputComponent } from 'src/app/Shared/input/input.component';
import { LoadingComponent } from 'src/app/Shared/loading/loading.component';
import { SidebarComponent } from 'src/app/Shared/sidebar/sidebar.component';
import { UserInfo } from 'src/app/modals/User';
import { PrimengComponentsModule } from 'src/app/primeng-components.module';
import { UsersService } from '../users.service';
import { BaseComponent, isSet } from 'src/app/core/base/base.component';
import * as moment from 'moment';
import { EntityViewerComponent } from 'src/app/Shared/entity-viewer/entity-viewer.component';
import { ConfirmationService } from 'primeng/api';
import { PermissionService } from 'src/app/core/permission.service';
import { RolesService } from '../roles/roles.service';

@Component({
  selector: 'app-add-edit-user',
  templateUrl: './add-edit-user.component.html',
  styleUrls: ['./add-edit-user.component.scss'],
  standalone: true,
  imports: [FormsModule,
    TranslateModule,
    PrimengComponentsModule,
    InputComponent,
    SidebarComponent,
    EntityViewerComponent,
    LoadingComponent,
  ],
})
export class AddEditUserComponent extends BaseComponent implements OnInit {


  selectRold
  roles: any[] = []
  acions: any = []
  genders: any[] = [
    {name:'Male',src:'./assets/images/man.jpg'},
    {name:'Female',src:'./assets/images/woman.png'}
  ]
  roleMode: boolean = false
  selectedPrev
  countries: any[] | undefined;

  selectedCountry: string | undefined;

  @Input() selectedUser: UserInfo
  @Input() display: boolean = false
  @Input() detailMode: boolean = false
  @Output() displayChange: EventEmitter<boolean> = new EventEmitter();
  @Output() refreshLish: EventEmitter<boolean> = new EventEmitter();

  constructor(private userService: UsersService,  confirmationService: ConfirmationService,private roleService:RolesService,
    public permissionService:PermissionService,
    public translates: TranslateService,) { super(null,translates,confirmationService) }

  ngOnInit(): void {
   
    // this.selectedUser.role=this.roles[0]
    this.selectedUser.gender= this.selectedUser.gender=='Male'?{name:'Male',src:'./assets/images/man.jpg'}:{name:'Female',src:'./assets/images/woman.png'}
    if (this.detailMode) {
      this.selectedUser.createdAt = moment(this.selectedUser.createdAt).format('YYYY-MM-DD HH:ss')
      this.selectRold = this.selectedUser.role
      this.selectedPrev=this.selectRold.privilege
      this.roleMode = true
    }
    this.acions = [
      {
        label: this.selectedUser.isToday ? this.trans('UnAvilabale Today') :  this.trans('Availbale Today'),
        icon: 'pi pi-power-off',
        command: () => {
          this.userAvialble()
        }
      },
      {
        label: this.selectedUser.blocked ?  this.trans('Activation') :  this.trans('Suspend'),
        icon: 'pi pi-power-off',
        command: () => {
          this.userStatus()
        }
      },
      {
        label: this.trans('Delete'),
        icon: 'pi pi-times',
        disabled:!this.permissionService.hasPermission('Users','delete'),
        command: () => {
          this.confirm1Delete()
        }
      }
    ]
    this.getRoles()
  }

  onHide() {
    this.display = false
    setTimeout(() => {
      this.displayChange.emit(false)
    }, 300);
  }
  createUser() {    
    this.loading = true
    const subscription = this.userService.createUser(this.selectedUser).subscribe((data) => {
      if (!isSet(data)) {
        return
      }
      this.loading = false
      this.refreshLish.emit(true)
      this.display = false
      subscription.unsubscribe()
    }, error => {
      console.log(error);
      
      this.loading = false
      subscription.unsubscribe()
    })
  }

  getRoles() {
    this.loading = true
    const subscription = this.roleService.getRoles().subscribe((results: any) => {
      this.loading = false
      if (!isSet(results)) {
        return
      }
   results.data.forEach(element => {
    element.attributes.id=element.id
    this.roles.push(element.attributes)
   });
   
      subscription.unsubscribe()
    }, error => {
      this.loading = false
      console.log(error);
      subscription.unsubscribe()
    })
  }

  // getRoles() {
  //   this.loading = true
  //   const subscription = this.userService.getRoles().subscribe((results: any) => {
  //     this.loading = false
  //     if (!isSet(results)) {
  //       return
  //     }
  //     this.roles = results.roles
  //     subscription.unsubscribe()
  //   }, error => {
  //     this.loading = false
  //     subscription.unsubscribe()
  //   })
  // }
  updateUser() {
    this.loading = true
    const subscription = this.userService.updateUser(this.selectedUser).subscribe((results: any) => {
      this.loading = false
      if (!isSet(results)) {
        return
      }
      this.refreshLish.emit(true)
      this.display = false
      subscription.unsubscribe()
    }, error => {
      this.loading = false
      subscription.unsubscribe()
    })
  }
  userStatus() {
    this.selectedUser.blocked = !this.selectedUser.blocked
    this.loading = true
    const subscription = this.userService.userStatus(this.selectedUser).subscribe((results: any) => {
      this.loading = false
      if (!isSet(results)) {
        return
      }
      this.refreshLish.emit(true)
      this.display = false
      subscription.unsubscribe()
    }, error => {
      this.loading = false
      subscription.unsubscribe()
    })
  }
  userAvialble() {
    this.selectedUser.isToday = !this.selectedUser.isToday
    this.loading = true
    const subscription = this.userService.userAvialble(this.selectedUser).subscribe((results: any) => {
      this.loading = false
      if (!isSet(results)) {
        return
      }
      this.refreshLish.emit(true)
      this.display = false
      subscription.unsubscribe()
    }, error => {
      this.loading = false
      subscription.unsubscribe()
    })
  }
  confirm1Delete() {
    this.confirmMessage('Are you sure that you want to delete this User ?', () => {
      this.deleteUser();
    });
  }
  deleteUser() {
    const subscription = this.userService.hideUser(this.selectedUser).subscribe((data) => {
      if (!isSet(data)) {
        return
      }
      // this.successMessage('The Appontment deleted successfully')
      this.display = false
      this.refreshLish.emit(true)
      subscription.unsubscribe()
    }, error => {
      subscription.unsubscribe()
    })
  }
  selectRole(event) {
    this.selectedUser.privilege = event     
    this.roleMode = true

  }
}
