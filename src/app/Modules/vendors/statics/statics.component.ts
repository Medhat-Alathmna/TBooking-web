import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { MessageService } from 'primeng/api';
import { BaseComponent, isSet } from 'src/app/core/base/base.component';
import { PrimengComponentsModule } from 'src/app/primeng-components.module';
import { SidebarComponent } from 'src/app/Shared/sidebar/sidebar.component';
import { VendorsService } from '../vendors.service';

@Component({
  selector: 'app-statics',
  templateUrl: './statics.component.html',
  styleUrls: ['./statics.component.scss'],
  standalone: true,
  imports: [FormsModule,
    TranslateModule,

    CommonModule,
    SidebarComponent,
    PrimengComponentsModule,
  ]
})
export class StaticsComponent extends BaseComponent implements OnInit {
  fromDate: any
  toDate: any
  data
  @Input() name
  @Input() id
  constructor(private vendorService: VendorsService, public translates: TranslateService, public messageService: MessageService,) { super(messageService, translates) }

  ngOnInit(): void {
    this.getVendorStatics({ fromDate: new Date(), toDate: new Date() })

  }

  getVendorStatics(dates: { fromDate: any; toDate: any }) {
    this.fromDate = dates.fromDate
    this.toDate = dates.toDate
    this.loading = true
    const subscription = this.vendorService.getVendorStatics(this.id, this.fromDate, this.toDate).subscribe((data: any) => {
      this.loading = false
      if (!isSet(data)) {
        return
      }
      this.data = data
      subscription.unsubscribe()
    }, error => {
      this.loading = false
      subscription.unsubscribe()
    })
  }

}
