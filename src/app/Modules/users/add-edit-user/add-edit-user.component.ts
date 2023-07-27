import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { DropdownComponent } from 'src/app/Shared/dropdown/dropdown.component';
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
    DropdownComponent,
    EntityViewerComponent,
    LoadingComponent,
  ],
})
export class AddEditUserComponent extends BaseComponent implements OnInit {


  selectRold
  roles: any[] = []
  acions: any = []

  @Input() selectedUser: UserInfo
  @Input() display: boolean = false
  @Input() detailMode: boolean = false
  @Output() displayChange: EventEmitter<boolean> = new EventEmitter();
  @Output() refreshLish: EventEmitter<boolean> = new EventEmitter();

  constructor(private userService: UsersService,private confirmationService: ConfirmationService,) { super() }

  ngOnInit(): void {
    console.log(this.selectedUser);

    // this.selectedUser.role=this.roles[0]
    if (this.detailMode) {
      this.selectedUser.createdAt = moment(this.selectedUser.createdAt).format('YYYY-MM-DD HH:ss')

    }
    this.acions = [
      {
        label: this.selectedUser.blocked ? 'Activation' : 'Suspend',
        icon: 'pi pi-power-off',
        command: () => {
          this.userStatus()
        }
      },
      {
        label: 'Delete',
        icon: 'pi pi-times',
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
    console.log(this.selectedUser);
    const subscription = this.userService.createUser(this.selectedUser, this.selectRold).subscribe((data) => {
      if (!isSet(data)) {
        return
      }
      console.log(data);

      this.refreshLish.emit(true)
      this.display = false
      subscription.unsubscribe()
    }, error => {
      subscription.unsubscribe()
    })
  }

  getRoles() {
    this.loading = true
    const subscription = this.userService.getRoles().subscribe((results: any) => {
      this.loading = false
      if (!isSet(results)) {
        return
      }
      this.roles = results.roles
      if (this.detailMode) {
        this.selectRold = this.roles.find(role => { role.name == this.selectedUser.role.name })
        console.log(this.selectRold);

      }
      subscription.unsubscribe()
    }, error => {
      this.loading = false
      console.log(error);
      subscription.unsubscribe()
    })
  }
  updateUser() {
    this.loading = true
    const subscription = this.userService.updateUser(this.selectedUser, this.selectRold).subscribe((results: any) => {
      this.loading = false
      if (!isSet(results)) {
        return
      }
      this.refreshLish.emit(true)
      this.display = false
      subscription.unsubscribe()
    }, error => {
      this.loading = false
      console.log(error);
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
      console.log(error);
      subscription.unsubscribe()
    })
  }
  confirm1Delete() {
    this.confirmationService.confirm({
        message: 'Are you sure that you want to delete this User ?',
        header: 'Confirmation',
        icon: 'pi pi-exclamation-triangle',
        accept: () => {this.deleteUser()},
    });
  }
  deleteUser(){
    const subscription = this.userService.hideUser(this.selectedUser).subscribe((data) => {
      if (!isSet(data)) {
        return
      }
      // this.successMessage('The Appontment deleted successfully')
      this.display=false
      this.refreshLish.emit(true)
      subscription.unsubscribe()
    }, error => {
      subscription.unsubscribe()
    })
  }
}
