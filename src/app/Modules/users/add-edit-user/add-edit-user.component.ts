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
import { isSet } from 'src/app/core/base/base.component';

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
    LoadingComponent,
],
})
export class AddEditUserComponent implements OnInit {

  roles:any[]=[{name:'User'},{name:'Employee'},{name:'Admin'},]

  @Input() selectedUser: UserInfo 
  @Input() display: boolean = false
  @Input() detailMode: boolean = false
  @Output() displayChange: EventEmitter<boolean> = new EventEmitter();
  @Output() refreshLish: EventEmitter<boolean> = new EventEmitter();

  constructor(private userService:UsersService) { }

  ngOnInit(): void {
    console.log( this.selectedUser);
    
    this.selectedUser.role=this.roles[0]
  }

  onHide() {
    this.display = false
    setTimeout(() => {
      this.displayChange.emit(false)
    }, 300);
  }
  createUser(){
    console.log(this.selectedUser);
    const subscription = this.userService.createUser(this.selectedUser).subscribe((data) => {
      if (!isSet(data)) {
        return
      }
      this.refreshLish.emit(true)
      this.display = false
      subscription.unsubscribe()
    }, error => {
      subscription.unsubscribe()
    })    
  }
}
