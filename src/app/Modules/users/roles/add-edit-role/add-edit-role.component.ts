import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { MessageService } from 'primeng/api';
import { InputComponent } from 'src/app/Shared/input/input.component';
import { LoadingComponent } from 'src/app/Shared/loading/loading.component';
import { SidebarComponent } from 'src/app/Shared/sidebar/sidebar.component';
import { TextAreaComponent } from 'src/app/Shared/text-area/text-area.component';
import { BaseComponent, isSet } from 'src/app/core/base/base.component';
import { RoleInfo } from 'src/app/modals/role';
import { PrimengComponentsModule } from 'src/app/primeng-components.module';
import { RolesService } from '../roles.service';

@Component({
  selector: 'app-add-edit-role',
  templateUrl: './add-edit-role.component.html',
  styleUrls: ['./add-edit-role.component.scss'],
  standalone: true,
  imports: [FormsModule,
    TranslateModule,
    PrimengComponentsModule,
    InputComponent,
    SidebarComponent,
    TextAreaComponent,
    LoadingComponent,
  ],
})
export class AddEditRoleComponent extends BaseComponent implements OnInit {

  @Input() selectedRole: RoleInfo
  @Input() display: boolean = false
  @Input() detailMode: boolean = false
  @Output() displayChange: EventEmitter<boolean> = new EventEmitter();
  @Output() refreshLish: EventEmitter<boolean> = new EventEmitter();

  constructor(public translates: TranslateService,
    public messageService: MessageService,private roleService:RolesService) { super(messageService, translates) }
    prev=[
      {name:'Appointments',isAllowed:false},
      {name:'Appointments',isAllowed:false},
      {name:'Appointments',isAllowed:false},
      {name:'Appointments',isAllowed:false},
      {name:'Appointments',isAllowed:false},
    ]
  ngOnInit(): void {
    this.selectedRole=this.detailMode? this.selectedRole.attributes:null
 console.log(this.selectedRole.pages);

    // this.selectedRole.description=this.selectedRole.attributes.description
    // this.selectedRole.pages=this.selectedRole.pages
  }

  onHide() {
    this.display = false
    setTimeout(() => {
      this.displayChange.emit(false)
    }, 300);
  }
  createRole(){
    console.log(this.selectedRole);
    
    this.loading = true
    const subscription = this.roleService.createRole(this.selectedRole).subscribe((data) => {
      if (!isSet(data)) {
        return
      }
      this.loading = false
      this.refreshLish.emit(true)
      this.display = false
      subscription.unsubscribe()
    }, error => {
      this.loading = false
      subscription.unsubscribe()
    })    
  }
}
