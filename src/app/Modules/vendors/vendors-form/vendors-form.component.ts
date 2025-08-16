import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Vendor } from 'src/app/modals/vendors';
import { PrimengComponentsModule } from 'src/app/primeng-components.module';
import { EntityViewerComponent } from 'src/app/Shared/entity-viewer/entity-viewer.component';
import { InputMaskComponent } from 'src/app/Shared/input-mask/input-mask.component';
import { InputComponent } from 'src/app/Shared/input/input.component';
import { LoadingComponent } from 'src/app/Shared/loading/loading.component';
import { ModalComponent } from 'src/app/Shared/modal/modal.component';
import { SidebarComponent } from 'src/app/Shared/sidebar/sidebar.component';
import { TextAreaComponent } from 'src/app/Shared/text-area/text-area.component';
import { VendorsService } from '../vendors.service';
import { BaseComponent, isSet } from 'src/app/core/base/base.component';
import { MessageService, ConfirmationService } from 'primeng/api';
import { PermissionService } from 'src/app/core/permission.service';
import { StaticsComponent } from '../statics/statics.component';
import { Menu } from 'primeng/menu';

@Component({
  selector: 'app-vendors-form',
  templateUrl: './vendors-form.component.html',
  styleUrls: ['./vendors-form.component.scss'],
  standalone: true,
  imports: [FormsModule,
    TranslateModule,
    PrimengComponentsModule,
    InputComponent,
    SidebarComponent,
    EntityViewerComponent,
    StaticsComponent,
    ModalComponent,
    InputMaskComponent],
})
export class VendorsFormComponent extends BaseComponent implements OnInit {


  vendor: Vendor | any
  vendorTypes = []
  vendorTypeDialog = false
  headerDialog
  vendorName
  vendorEdit = false
  formTypes

  acions = []


  @Input() id
  @Input() display: boolean = false
  @Input() detailMode: boolean = false
  @Output() displayChange: EventEmitter<boolean> = new EventEmitter();
  @Output() refreshLish: EventEmitter<boolean> = new EventEmitter();
  @ViewChild('menu') menu: Menu
  constructor(private vendorService: VendorsService, public translates: TranslateService, public messageService: MessageService, public permissionService: PermissionService,
     confirmationService: ConfirmationService,) { super(messageService, translates,confirmationService) }

  ngOnInit(): void {
    this.formTypes = 'vendor'
    if (!this.detailMode || !this.id) {
      this.vendor = new Vendor
      this.getVendorTypes()

    } else {
      this.getVendor(this.id)
    }
  }
  onActionClick(event: MouseEvent) {
    this.acions = [
      {
        label: this.formTypes == 'vendor' ? this.trans('Statistics') : this.trans('Details'),
        icon: this.formTypes == 'vendor' ? 'pi pi-chart-pie' : 'pi pi-file',
        command: () => {
          this.formTypes = this.formTypes == 'vendor' ? 'statics' : 'vendor'

        }
      },
    ]
    this.menu.hide();
    setTimeout(() => this.menu.show(event), 0);
  }
  createVendor() {
    this.loading = true
    const subscription = this.vendorService.createVendor(this.vendor).subscribe((data) => {
      if (!isSet(data)) {
        return
      }
      this.loading = false
      this.successMessage(null, 'The Supplier has been created')
      this.refreshLish.emit(true)
      this.display = false
      subscription.unsubscribe()
    }, error => {
      this.loading = false
      subscription.unsubscribe()
    })
  }

  getVendorTypes() {
    const subscription = this.vendorService.getVendorType().subscribe((results) => {
      if (!isSet(results)) {
        return
      }
      this.vendorTypes = []
      this.vendorTypes.push({
        id: 0, name: `<span class="font-bold text-primary">${this.trans('New Supplier Type')}</span>`
      })
      results.data.map(item => {
        this.vendorTypes.push({
          id: item?.id, name: item?.attributes?.name
        })
      })
      if (this.vendor.vendor_type) {
        this.vendor.vendorType = this.vendorTypes.find(x => x.id == this.vendor.vendor_type.data.id)
      }

      subscription.unsubscribe()
    }, error => {
      subscription.unsubscribe()
    })
  }
  onHide() {

    this.display = false
    setTimeout(() => {
      this.displayChange.emit(false)
    }, 300);
  }

  selectVendorType(event) {
    if (event.value.id == 0) {
      this.vendorTypeDialog = true
      this.vendorName = null
      this.vendor.vendorType = null
      this.vendorEdit = false
    }
    this.headerDialog = this.vendorEdit ? this.trans('Supplier Type Modification') : this.trans('New Supplier Type')
  }

  createvendorType() {
    this.loading = true
    const subscription = this.vendorService.createVendorType(this.vendorName).subscribe((data) => {
      if (!isSet(data)) {
        return
      }
      this.loading = false
      this.vendorTypeDialog = false

      this.getVendorTypes()
      subscription.unsubscribe()
    }, error => {
      this.loading = false
      subscription.unsubscribe()
    })
  }
  updateVendorType(type) {
    this.loading = true
    const subscription = this.vendorService.updateVendorType(this.vendorName, this.vendor.vendorType.id, type).subscribe((data) => {
      if (!isSet(data)) {
        return
      }
      this.loading = false
      this.vendorTypeDialog = false
      this.getVendorTypes()
      subscription.unsubscribe()
    }, error => {
      this.loading = false
      subscription.unsubscribe()
    })
  }
  selectUpdatVendorType(value) {
    this.vendorEdit = true
    this.vendorName = value.name
  }
  confirmCancel() {
    this.confirmMessage(null, () => {
      this.updateVendorType('delete') ;
    });
  }

  getVendor(id) {
    this.loading = true
    const subscription = this.vendorService.getVendor(id).subscribe((data) => {
      if (!isSet(data)) {
        return
      }
      this.vendor = data.data.attributes
      this.getVendorTypes()

      subscription.unsubscribe()
    }, error => {
      this.loading = false
      subscription.unsubscribe()
    })
  }


  updateVendor() {
    this.loading = true
    const subscription = this.vendorService.updateVendor(this.vendor, this.id, 'update').subscribe((data) => {
      if (!isSet(data)) {
        return
      }
      this.loading = false
      this.refreshLish.emit(true)
      this.successMessage(null, 'This Supplier has been changed')
      this.display = false
      subscription.unsubscribe()
    }, error => {
      this.loading = false
      subscription.unsubscribe()
    })
  }

}
