import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { MessageService, TreeNode } from 'primeng/api';
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

  @Input() id
  @Input() selectedRole: any
  @Input() display: boolean = false
  @Input() detailMode: boolean = false
  @Output() displayChange: EventEmitter<boolean> = new EventEmitter();
  @Output() refreshLish: EventEmitter<boolean> = new EventEmitter();

  constructor(public translates: TranslateService,
    public messageService: MessageService, private roleService: RolesService) { super(messageService, translates) }
  resources = [
    { name: 'Appointments', actions: ['create', 'view', 'update', 'delete', 'export'] },
    { name: 'Orders', actions: ['create', 'view', 'update', 'cancel', 'export'] },
    { name: 'PurchaseOrders', actions: ['create', 'view', 'update', 'cancel', 'export'] },
    { name: 'Vendors', actions: ['create', 'view', 'update', 'cancel', 'export'] },
    { name: 'Users', actions: ['create', 'view', 'update', 'delete', 'Roles', 'suspend'] },
    { name: 'Roles', actions: ['create', 'update', 'delete'] },
    { name: 'Dashboard', actions: ['view',] },
    { name: 'Products', actions: ['create', 'view', 'update', 'delete', 'Services', 'export'] },
    { name: 'Services', actions: ['create', 'update', 'delete', 'export'] },
    { name: 'Gallary', actions: ['create', 'view', 'update', 'delete'] },
    // { name: 'MobileApp', actions: ['create', 'view', 'update', 'delete'] },
    { name: 'SiteSittengs', actions: ['view', 'update', 'Notifications', 'ForbbidenNumber', 'AppointmentsSettings'] },
    { name: 'Notifications', actions: ['create', 'update', 'delete'] },
    { name: 'ForbbidenNumber', actions: ['create', 'update', 'delete'] },
  ];

  pages = {
    Appointments: { create: false, view: true, update: false, delete: false, export: false },
    Orders: { create: false, view: false, update: false, cancel: false, export: false },
    PurchaseOrders: { create: false, view: false, update: false, cancel: false, export: false },
    Vendors: { create: false, view: false, update: false, cancel: false, export: false },
    Users: { create: false, view: false, update: false, delete: false, suspend: false, Roles: false },
    Roles: { create: false, update: false, delete: false },
    Dashboard: { view: false },
    Products: { create: false, view: false, update: false, delete: false, Services: false, export: false },
    Services: { create: false, update: false, delete: false, export: false },
    Gallary: { create: false, view: false, update: false, delete: false },
    // MobileApp: { create: false, view: false, update: false, delete: false },
    SiteSittengs: { view: false, update: false, Notifications: false, ForbbidenNumber: false, AppointmentsSettings: false },
    Notifications: { create: false, update: false, delete: false },
    ForbbidenNumber: { create: false, update: false, delete: false },

  };

  selectedFiles
  ngOnInit(): void {
    this.selectedRole = this.detailMode ? this.selectedRole.attributes : new RoleInfo();

    if (this.detailMode) {
      this.selectedRole.id = this.id;

      this.syncPagesWithResourcesFromHttp();
    }
  }
  private syncPagesWithResourcesFromHttp(): void {
    this.pages = this.selectedRole.pages
    this.resources.forEach(resource => {
      if (!this.pages[resource.name]) {
        this.pages[resource.name] = {};
      }

      resource.actions.forEach(action => {
        if (typeof this.pages[resource.name][action] !== 'boolean') {
          this.pages[resource.name][action] = false;
        }
      });
    });
  }
  onHide() {
    this.display = false
    setTimeout(() => {
      this.displayChange.emit(false)
    }, 300);
  }
  createRole() {
    this.selectedRole.pages = this.pages
    this.loading = true
    const subscription = this.roleService.createRole(this.selectedRole).subscribe((data) => {
      if (!isSet(data)) {
        return
      }
      this.loading = false
      this.refreshLish.emit(true)
      this.successMessage(null, 'The new role has been created')
      this.display = false
      subscription.unsubscribe()
    }, error => {
      this.loading = false
      subscription.unsubscribe()
    })
  }
  updateRole() {
    this.selectedRole.pages = this.pages
    this.loading = true
    const subscription = this.roleService.updateRole(this.selectedRole).subscribe((data) => {
      if (!isSet(data)) {
        return
      }
      this.loading = false
      this.refreshLish.emit(true)
      this.successMessage(null, 'This role has been Changed')
      this.display = false
      subscription.unsubscribe()
    }, error => {
      this.loading = false
      subscription.unsubscribe()
    })
  }
}
