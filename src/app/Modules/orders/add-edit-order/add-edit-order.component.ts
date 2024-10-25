import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import * as moment from 'moment';
import { ConfirmationService, MessageService } from 'primeng/api';
import { CalenderComponent } from 'src/app/Shared/calender/calender.component';
import { EntityViewerComponent } from 'src/app/Shared/entity-viewer/entity-viewer.component';
import { InputMaskComponent } from 'src/app/Shared/input-mask/input-mask.component';
import { InputComponent } from 'src/app/Shared/input/input.component';
import { LoadingComponent } from 'src/app/Shared/loading/loading.component';
import { ModalComponent } from 'src/app/Shared/modal/modal.component';
import { SidebarComponent } from 'src/app/Shared/sidebar/sidebar.component';
import { TextAreaComponent } from 'src/app/Shared/text-area/text-area.component';
import { BaseComponent, isSet } from 'src/app/core/base/base.component';
import { PrimengComponentsModule } from 'src/app/primeng-components.module';
import { OrdersService } from '../orders.service';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Order } from 'src/app/modals/order';
import { SettingsService } from '../../settings/settings.service';
import { PayByComponent } from 'src/app/Shared/pay-by/pay-by.component';
import { PermissionService } from 'src/app/core/permission.service';
import { FontsService } from 'src/app/core/fonts.service';

@Component({
  selector: 'app-add-edit-order',
  templateUrl: './add-edit-order.component.html',
  styleUrls: ['./add-edit-order.component.scss'],
  standalone: true,
  imports: [FormsModule,
    TranslateModule,
    PrimengComponentsModule,
    InputComponent,
    SidebarComponent,
    CalenderComponent,
    EntityViewerComponent,
    TextAreaComponent,
    ModalComponent,
    InputMaskComponent,
    LoadingComponent,
    PayByComponent,
  ],
})
export class AddEditOrderComponent extends BaseComponent implements OnInit {

  acions: any[] = []
  notfiItems: any = []
  discountMode: string = 'type'
  cashMode: boolean = false
  iconLoading: boolean = false
  imgDealog: boolean = false
  payByMode: boolean = false
  blob
  body: string
  invoiceInfo
  link
  imgData

  @Input() selectedOrder: Order |any
  @Input() display: boolean = false
  @Input() isAttributes: boolean = true
  @Output() displayChange: EventEmitter<boolean> = new EventEmitter();
  @Output() refreshLish: EventEmitter<boolean> = new EventEmitter();

  constructor(public translate: TranslateService, public permissionService: PermissionService,private fontSerivces:FontsService,
    public messageService: MessageService, private orderService: OrdersService, private settingsService: SettingsService,
    private confirmationService: ConfirmationService,) { super(messageService, translate) }

  ngOnInit(): void {    
      this.getOrder(this.selectedOrder.id)
  }
  onHide() {

    this.display = false
    setTimeout(() => {
      this.displayChange.emit(false)
    }, 300);
  }
  getTotalPrice() {
    let total = 0
    let serviceAmount: number = 0
    let productsAmount: number = 0
    this.selectedOrder.attributes.employee?.map(x => {
      x.services?.map(rs => {
        serviceAmount += rs?.price
      })
    })
    this.selectedOrder.attributes.products?.map(x => {
      productsAmount += x.price * x.qty
    })
    const products = serviceAmount + productsAmount
    if (this.selectedOrder.discountType == 'cash') {
      total = products - this.selectedOrder.discount - this.selectedOrder.cash - this.selectedOrder.attributes.appointment.data.attributes.deposit
    } else {
      const cash = products - this.selectedOrder.attributes.appointment.data.attributes.deposit
      total = (cash * ((100 - this.selectedOrder.discount) / 100)) - this.selectedOrder.cash
    }
    return {
      products, total

    }
  }
  onKeyEnter(event, type?) {
    if (event.keyCode === 13) {
      type == 'cash' ? this.cashMode = false : this.discountMode = 'show'
    }
  }

  updateOrder() {
    if (this.getTotalPrice().total < 0) {
      this.errorMessage('Total Price can not be less than 0')
      return
    }
    this.selectedOrder.status = this.getTotalPrice().total == 0 ? "Paid" : "Unpaid"
    this.loading = true
    const subscription = this.orderService.updateOrder(this.selectedOrder).subscribe((data) => {
      if (!isSet(data)) {
        return
      }
      this.refreshLish.emit(true)
      this.display = false
      this.loading = false

      subscription.unsubscribe()
    }, error => {
      this.loading = false
      subscription.unsubscribe()
    })
  }

  cancelOrder() {
    this.loading = true
    const subscription = this.orderService.cancelOrder(this.selectedOrder).subscribe((data) => {
      if (!isSet(data)) {
        return
      }
      this.refreshLish.emit(true)
      this.display = false
      this.loading = false
      subscription.unsubscribe()
    }, error => {
      this.loading = false
      subscription.unsubscribe()
    })
  }

  draftAppointment() {
    const subscription = this.orderService.draftAppointment(this.selectedOrder.attributes.appointment.data).subscribe((data) => {
      if (!isSet(data)) {
        return
      }
      subscription.unsubscribe()
    }, error => {
      subscription.unsubscribe()
    })
  }

  confirm1Cancel() {
    this.confirmationService.confirm({
      message: 'Are you sure that you want to Cancel this Order ?',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => { this.cancelOrder(); this.draftAppointment() },
    });
  }
  replaceValuesStrings(body) {
    var startDate = moment(this.selectedOrder.attributes.appointment.data.attributes.fromDate).format('YYYY-MM-D')
    var startTime = moment(this.selectedOrder.attributes.appointment.data.attributes.fromDate).format('HH-MM A')
    var customer = this.selectedOrder.attributes.appointment.data.attributes.customer.firstName + ' ' + this.selectedOrder.attributes.appointment.data.attributes.customer.middleName + ' ' + this.selectedOrder.attributes.appointment.data.attributes.customer.lastName
    var number = this.selectedOrder.attributes.orderNo
    var notes = this.selectedOrder.attributes.notes
    var cash = this.selectedOrder.cash
    var discount = this.selectedOrder.discount
    var employee = this.selectedOrder.attributes.appointment.data.attributes.employee
    var deposit = this.selectedOrder.attributes.appointment.data.attributes.deposit
    var mapObj = {
      $date: startDate, $time: startTime, $customer: customer, $number: number, $notes: notes,
      $employee: employee, $discount: discount + ' دينار',
      $cash: cash + ' دينار', $deposit: deposit + ' دينار', $price: this.getTotalPrice().products + ' دينار'
    };
    return body = this.multiReplace(body, mapObj)
  }
  getNotfi() {
    const subscription = this.settingsService.getNotifications().subscribe((results: any) => {
      if (!isSet(results)) {
        return
      }
      var arr = results.data.filter(x => x.attributes.type == 'Orders')
      arr.map(notf => {
        this.notfiItems.push({
          label: notf.attributes.title, command: () => {
            var body = this.replaceValuesStrings(notf.attributes.body)
            window.open(`https://web.whatsapp.com/send?phone=${this.selectedOrder.attributes.appointment.data.attributes.phone}&text=${body}`, "_blank")
          }
        })
      })
      subscription.unsubscribe()
    }, error => {
      subscription.unsubscribe()
    })
  }
  siteInfo() {
    const subscription = this.orderService.siteInfo().subscribe((results: any) => {
      if (!isSet(results)) {
        return
      }
      this.invoiceInfo = results.data.attributes
      this.generateInvoice()
      subscription.unsubscribe()
    }, error => {
      subscription.unsubscribe()
    })
  }
  async generateInvoice() {
    
    const doc = new jsPDF();
    doc.addFileToVFS('Amiri-Regular-normal', this.fontSerivces.font);
        doc.addFont('Amiri-Regular-normal', 'amiri', 'normal');
    // Use the font
    doc.setFont('amiri');
    // Add header (business name, logo, etc.)
    doc.setFontSize(24);
    doc.text(this.invoiceInfo?.name, 150, 30, { align: 'center' });
    doc.setFontSize(12);
    doc.text(this.invoiceInfo?.address?this.invoiceInfo?.address:'', 150, 40, { align: 'center' });
    doc.text(this.invoiceInfo?.phone, 150, 50, { align: 'center' });


    // Add Invoice Title
    doc.setFontSize(12);
    const customer = this.selectedOrder?.attributes?.appointment?.data?.attributes?.customer;
    const address=this.selectedOrder?.attributes?.appointment?.data?.attributes?.address
    doc.text(`${customer.firstName} ${customer.middleName} ${customer.lastName}`, 15, 70);
    doc.text(`${address?address:''}`, 15, 80);
    doc.text(`${this.selectedOrder?.attributes?.appointment?.data?.attributes?.phone}`, 15, 90);

    // Invoice details
    doc.text(`${this.selectedOrder?.attributes?.orderNo}`, 150, 70, { align: 'center' });
    doc.text(`${new Date(this.selectedOrder?.attributes?.createdAt).toLocaleString()}`, 150, 80, { align: 'center' });

    // Table with autoTable
    const tableBody = this.selectedOrder.attributes.products.map((product: any, index: number) => ([
      index + 1,
      product.name,
      product.qty,
      product.price,
      (product.qty * product.price).toFixed(2),
    ]));
if (isSet(this.selectedOrder.attributes.products)) {
  autoTable(doc, {
    startY: 115,
    theme: 'grid',
    tableWidth:'auto',
    styles:{font:'amiri'},
    head: [[this.trans('Product Name'), this.trans('Quantity'),this.trans('Price')]],
    body: this.selectedOrder.attributes.products.map((product) => [
      product.name || 'N/A',   
      product.qty || 0,        
      product.price || 0       
    ])
  });
 
}
    
    // Employee Services Table (Ensure values are not undefined)
if (isSet(this.selectedOrder.attributes.employee)) {
  const employeeTableBody = this.selectedOrder.attributes.employee.map((employee: any, index: number) => {
    const services = employee.services.map((service: any) => `${this.lang =='en'?service.en:service.ar} (${service.price})`).join(", ");
    return [
      index + 1,
      employee.username,
      services
    ];
  });
  autoTable(doc, {
    startY:isSet(this.selectedOrder.attributes.products)? (doc as any).lastAutoTable.finalY + 10:100,
    styles:{font:'amiri'},
    tableWidth:'auto',
    head: [['#',this.trans('Employee'), this.trans('Services')]],
    body: employeeTableBody
  });
}
    doc.setFontSize(12);
    doc.text(this.trans('Services'),150, (doc as any).lastAutoTable.finalY + 30, { align: 'center' })
    doc.text(`${this.getTotalPrice().products}`+ `    ${this.getCurrencySymbol(this.cur.name)}`, 180, (doc as any).lastAutoTable.finalY + 30, { align: 'center' });
    doc.text(this.trans('Deposit'),150, (doc as any).lastAutoTable.finalY + 35, { align: 'center' })
    doc.text(`${this.selectedOrder.attributes.appointment.data.attributes.deposit}`+ `    ${this.getCurrencySymbol(this.cur.name)}`, 180, (doc as any).lastAutoTable.finalY + 35, { align: 'center' });
    doc.setTextColor('green')
    doc.text(this.trans('Paid'),150, (doc as any).lastAutoTable.finalY + 40, { align: 'center' })
    doc.text(`${this.selectedOrder.attributes.cash}`+ `    ${this.getCurrencySymbol(this.cur.name)}`, 180, (doc as any).lastAutoTable.finalY + 40, { align: 'center' });
    doc.setTextColor('red')
    doc.text(this.trans('Unpaid'),150, (doc as any).lastAutoTable.finalY + 45, { align: 'center' })
    doc.text(`${this.getTotalPrice().total}` + `    ${this.getCurrencySymbol(this.cur.name)}`, 180, (doc as any).lastAutoTable.finalY + 45, { align: 'center' });
    doc.setFontSize(10);
    doc.setTextColor('black')
    doc.text(this.invoiceInfo?.footer, 40, (doc as any).lastAutoTable.finalY + 70);
    this.blob = doc.output('blob');
   this.convertPdfToImage(this.blob)
  }
  async convertPdfToImage(pdfBlob) {
    const pdfjsLib = window['pdfjs-dist/build/pdf'];
    pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://mozilla.github.io/pdf.js/build/pdf.worker.js';
  
    // Load the PDF from the blob
    const pdf = await pdfjsLib.getDocument(URL.createObjectURL(pdfBlob)).promise;
  
    // Loop through each page
    const page = await pdf.getPage(1); // For simplicity, converting only the first page
  
    // Create a canvas element
    const scale = 2;
    const viewport = page.getViewport({ scale });
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    canvas.height = viewport.height;
    canvas.width = viewport.width;
  
    // Render the PDF page into the canvas context
    const renderContext = {
      canvasContext: context,
      viewport: viewport,
    };
  
    await page.render(renderContext).promise;
  
    // Convert the canvas to an image
    const imageData = canvas.toDataURL('image/png');
  
    // Create an image element to display or save
    const imgElement = document.createElement('img');
    imgElement.src = imageData;
    // document.body.appendChild(imgElement); // Optionally display the image
  
    // To download the image
    this.imgDealog=true
    this.link = document.createElement('a');
    this.imgData=imageData
    // console.log( encodeURIComponent(imageData));
    // window.open(`https://web.whatsapp.com/send?phone=${this.selectedOrder.attributes.appointment.data.attributes.phone}&text=${encodeURIComponent(imageData)}`, "_blank")

   
  }
  downloadImg(){
    this.link.href= this.imgData
    this.link.download = this.selectedOrder.attributes.orderNo;
    this.link.click();
  }
  getOrder(id) {
    const subscription = this.orderService.getOrder(id).subscribe((results: any) => {
      if (!isSet(results)) {
        return
      }
      this.selectedOrder=results.data
      this.selectedOrder.attributes.createdAt = moment(this.selectedOrder.attributes.createdAt).format('YYYY-MM-DD HH:ss')
      this.selectedOrder.attributes.appointment.data.attributes.fromDate = new Date(this.selectedOrder.attributes.appointment.data.attributes.fromDate)
      this.selectedOrder.attributes.appointment.data.attributes.toDate = new Date(this.selectedOrder.attributes.appointment.data.attributes.toDate)
      this.selectedOrder.discount = !this.selectedOrder.attributes.discount ? 0 : this.selectedOrder.attributes.discount
      this.selectedOrder.cash = !this.selectedOrder.attributes.cash ? 0 : this.selectedOrder.attributes.cash
      if (this.selectedOrder.attributes.discountType) {
        this.selectedOrder.discountType = this.selectedOrder.attributes.discountType
        this.discountMode = 'show'
      }
      if (this.selectedOrder.attributes.pay_by) {
        this.selectedOrder.pay_by = this.selectedOrder?.attributes?.pay_by?.data?.attributes
        this.payByMode = true
      } else {
        this.payByMode = false
      }
      this.acions = [
        {
          label: this.trans('Cancel the Order'),
          icon: 'pi pi-trash',
          disabled: !this.permissionService.hasPermission('Orders', 'cancel'),
          command: () => {
            this.confirm1Cancel()
          }
        },
  
      ]
      this.getNotfi()      
      subscription.unsubscribe()
    }, error => {
      subscription.unsubscribe()
    })
  }
  
}
