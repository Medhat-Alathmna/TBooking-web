import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { MessageService } from 'primeng/api';
import { BaseComponent, isSet } from 'src/app/core/base/base.component';
import { PrimengComponentsModule } from 'src/app/primeng-components.module';
import { VendorsService } from '../vendors.service';
import { FromToDateComponent } from 'src/app/Shared/from-to-date/from-to-date.component';
import { ModalComponent } from 'src/app/Shared/modal/modal.component';
import { PurchaseOrderFormComponent } from '../../purchase-order/purchase-order-form/purchase-order-form.component';

@Component({
  selector: 'app-statics',
  templateUrl: './statics.component.html',
  styleUrls: ['./statics.component.scss'],
  standalone: true,
  imports: [FormsModule,
    TranslateModule,
    FromToDateComponent,
    CommonModule,
    ModalComponent,
    PurchaseOrderFormComponent,
    PrimengComponentsModule,
  ]
})
export class StaticsComponent extends BaseComponent implements OnInit {
  fromDate: any
  toDate: any
  data
  basicOptions
  topProductsChart
  topCostProducts
  items
  selectedPo
  showPoOrderSidebar
  displayDate = false
  poDashboard = false
  textSecondaryColor = getComputedStyle(
    document.documentElement
  ).getPropertyValue('--surface-500');
  @Input() name
  @Input() id
  constructor(private vendorService: VendorsService, public translates: TranslateService, public messageService: MessageService,) { super(messageService, translates) }

  ngOnInit(): void {
    this.getVendorStatics({ fromDate: new Date(), toDate: new Date() })
    this.items = [
      {
        icon: 'pi pi-calendar text-primary',
        command: () => {
          this.displayDate = true;
        },
      },
      {
        icon: 'pi pi-money-bill text-primary',
        command: () => {
          this.poDashboard = true;
        },
      },
      {
        icon: 'pi pi-refresh text-primary',
        command: () => {
          this.fromDate = new Date();
          this.toDate = new Date();
          this.getVendorStatics({ fromDate: new Date(), toDate: new Date() })
        },
      },
    ];
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
      this.topProductsCharts(data)
      this.topCostProductsCharts(data)
      subscription.unsubscribe()
    }, error => {
      this.loading = false
      subscription.unsubscribe()
    })
  }
  topProductsCharts(data) {
    let name = [];
    let qty = [];
    let sellPrice = [];
    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue('--text-color');
    const textColorSecondary = documentStyle.getPropertyValue(
      '--text-color-secondary'
    );
    const surfaceBorder = documentStyle.getPropertyValue('--surface-border');
    data.topProducts.map((x) => {
      name.push(x.name);
      qty.push(x.qty);
      sellPrice.push(x.sellPrice);
    });
    this.topProductsChart = {
      labels: name,
      datasets: [
        {
          label: this.trans('QTY'),
          data: qty,
          backgroundColor: [
            'rgba(75, 192, 192, 0.2)',
            'rgba(255, 159, 64, 0.2)',
            'rgba(54, 162, 235, 0.2)',
            'rgba(153, 102, 255, 0.2)',
          ],
          borderColor: [
            'rgb(75, 192, 192)',
            'rgb(255, 159, 64)',
            'rgb(54, 162, 235)',
            'rgb(153, 102, 255)',
          ],
          borderWidth: 1,
        },
        {
          label:
            this.trans('Cash') + ' ' + this.getCurrencySymbol(this.cur.code),
          data: sellPrice,
          backgroundColor: [
            'rgba(255, 159, 64, 0.2)',
            'rgba(54, 162, 235, 0.2)',
            'rgba(153, 102, 255, 0.2)',
          ],
          borderColor: [
            'rgb(255, 159, 64)',
            'rgb(54, 162, 235)',
            'rgb(153, 102, 255)',
          ],
          borderWidth: 1,
        },
      ],
    };
    this.basicOptions = {
      maintainAspectRatio: false,
      aspectRatio: 0.8,
      plugins: {
        legend: {
          labels: {
            color: textColor,
          },
        },
      },
      scales: {
        x: {
          ticks: {
            color: textColorSecondary,
            font: {
              weight: 500,
            },
          },
          grid: {
            color: surfaceBorder,
            drawBorder: false,
          },
        },
        y: {
          ticks: {
            color: textColorSecondary,
          },
          grid: {
            color: surfaceBorder,
            drawBorder: false,
          },
        },
      },
    };
  }
  topCostProductsCharts(data) {
    const documentStyle = getComputedStyle(document.documentElement);
    let name = [];
    let qty = [];
    let sellPrice = [];
    data.costestPorducts.map((x) => {
      name.push(x.name);
      qty.push(x.qty);
      sellPrice.push(x.sellPrice);
    });
    this.topCostProducts = {
      labels: name,
      datasets: [
        {
          label:
            this.trans('Sell Price') + ' ' + this.getCurrencySymbol(this.cur.code),
          data: sellPrice,
          backgroundColor: documentStyle.getPropertyValue('--blue-500'),
          borderColor: documentStyle.getPropertyValue('--blue-500'),
          borderWidth: 1,
        },
        {
          label: this.trans('QTY'),
          data: qty,
          backgroundColor: documentStyle.getPropertyValue('--pink-500'),
          borderColor: documentStyle.getPropertyValue('--pink-500'),
          borderWidth: 1,
        },
      ],
    };
    this.basicOptions = {
      plugins: {
        legend: { labels: { boxWidth: 10, color: this.textSecondaryColor } },
      },
      scales: {
        x: {
          ticks: {
            display: true,
          },
          grid: { color: 'white' },
        },
        y: {
          grid: { color: 'white' },
        },
      },
    };
  }

  viewPoOrder(event) {
    this.poDashboard = false
    this.selectedPo = event.id;
    this.showPoOrderSidebar = true;

  }
}
