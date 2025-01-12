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
import { CalenderService } from '../../calender/calender.service';
import { Products } from 'src/app/modals/products';
import { Services } from 'src/app/modals/service';
import { ProductsService } from '../../products/services.service';

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
   selectEmployee: any 
    newEmpe: any 
    selectServices: Services[] = []
    selectProducts: Products[] = []
    users: any = []
    products: any = []
    services: Services[] = []
    newValue: any
    showAddValue: boolean = false
    servType: any
    showEmployiesDialog: boolean = false
    employeeMode: boolean = false
    title: string
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
  coCash

  @Input() selectedOrder: Order | any
  @Input() display: boolean = false
  @Input() isAttributes: boolean = true
  @Output() displayChange: EventEmitter<boolean> = new EventEmitter();
  @Output() refreshLish: EventEmitter<boolean> = new EventEmitter();

  constructor(public translate: TranslateService, public permissionService: PermissionService, private fontSerivces: FontsService,private productsService:ProductsService,
    public messageService: MessageService, private orderService: OrdersService, private settingsService: SettingsService, private calenderService: CalenderService,
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
    this.selectedOrder?.appointment?.employee?.map(x => {
      x.services?.map(rs => {
        serviceAmount += rs?.price
      })
    })
    this.selectProducts?.map(x => {
      productsAmount += x.price * x.qty
    })
    const products = serviceAmount + productsAmount
    if (this.selectedOrder?.discountType == 'cash') {
      total = products - this.selectedOrder.discount - this.selectedOrder.cash - this.selectedOrder.appointment.deposit
    } else {
      const cash = products - this.selectedOrder?.appointment?.deposit
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
  getUsers() {
    if (this.users.length) {
      this.showEmployiesDialog = true
      this.newValue = null
      return
    }
    const subscription = this.calenderService.getEmployee().subscribe((data) => {
      if (!isSet(data)) {
        return
      }
      this.users = data
      this.showEmployiesDialog = true
      this.newValue = null
      subscription.unsubscribe()
    }, error => {
      subscription.unsubscribe()
    })
  }

  listServices() {
    if (this.services.length) {
      this.showAddValue = true
      return
    }
    this.loading = true
    const subscription = this.productsService.getServices().subscribe((results: any) => {
      this.loading = false
      if (!isSet(results)) {
        return
      }
      results.data.map(item => {
        this.services.push({ id: item?.id, ar: item?.attributes?.ar, en: item?.attributes?.en, price: item?.attributes?.price })
      })
      this.showAddValue = true
      subscription.unsubscribe()
    }, error => {
      this.loading = false

      subscription.unsubscribe()
    })
  }
  updateOrder() {
    if (this.getTotalPrice().total < 0) {
      this.errorMessage('Total Price can not be less than 0')
      return
    }
    if (this.selectedOrder.cash < 0) {
      this.errorMessage('Cash can not be less than 0')
      this.selectedOrder.cash = 0
      return
    }

    if (this.selectedOrder.cash == 0 && this.getTotalPrice().total != 0) {
      this.selectedOrder.status = 'Draft'
    } else if ( this.getTotalPrice().total == 0) {
      this.selectedOrder.status = 'Paid'
    } else {
      this.selectedOrder.status = 'Unpaid'
    }  
  
    if (this.selectedOrder.attributes.status == 'Draft') this.updateAppointemt()

    if(this.coCash> this.selectedOrder.cash) return this.errorMessage('fuck you')
    
    this.loading = true
    const subscription = this.orderService.updateOrder(this.selectedOrder).subscribe((data) => {
      if (!isSet(data)) {
        return
      }
      this.refreshLish.emit(true)
      this.display = false
      this.loading = false
      if ((data.data.attributes.cash != 0 && this.selectedOrder.appointment.status=='Draft')||data.data.attributes.status =="Paid") this.completeAppointment()
      subscription.unsubscribe()
    }, error => {
      this.loading = false
      subscription.unsubscribe()
    })
  }
  showAddNewServProd(type, index?) {
    this.title = type == 'ser' ? this.trans('New Service') : this.trans('New Product')
    type == 'ser' ? this.listServices() : this.getProducts(1, null)
    if (!this.selectedOrder.appointment.employee[index]?.services && type == 'ser') {
      this.selectedOrder.appointment.employee[index] = Object.assign(this.selectedOrder.appointment.employee[index], {
        services: []
      });
    }
    this.selectEmployee = index
    this.newValue = ''
    this.servType = type
  }
  updateProduct(prod, id) {
    const subscription = this.calenderService.updateProduct(prod, id).subscribe((results: any) => {
      this.loading = false
      if (!isSet(results)) {
        return
      }
      subscription.unsubscribe()
    }, error => {
      this.loading = false

      subscription.unsubscribe()
    })
  }
  showAddNewEmp(type) {
    this.showEmployiesDialog = true

    this.newValue = null
  }
    selectEmployees(event) {
      if (!this.selectedOrder.appointment.employee) this.selectedOrder.appointment.employee=[]
      for (const employee of this.selectedOrder.appointment.employee) {
        if (employee.username === event.username) {
          this.newEmpe = null
          this.errorMessage(this.trans('This employee has already been selected'))
          return;
        }
      }  
        this.selectedOrder.appointment.employee.push(event)
      this.showAddValue = false
      this.showEmployiesDialog = false
      this.newEmpe = null
    }
    selectService() {
      if (!isSet(this.selectedOrder.appointment.employee[this.selectEmployee].services)) {
        this.selectedOrder.appointment.employee[this.selectEmployee].services = []
      }
      const existServ =this.selectedOrder.appointment.employee[this.selectEmployee].services.find(x => x.id == this.newValue.id)    
      if (existServ) {
        this.errorMessage(this.trans('This Service Already Selected'))
        return
      }
      this.selectedOrder.appointment.employee[this.selectEmployee].services.push({
        id: this.newValue?.id,
        ar: this.newValue?.ar,
        en: this.newValue?.en,
        price: this.newValue?.price
      }
      );
      this.showAddValue = false
    }
    selectProduct() {
      if (!isSet(this.selectProducts)) {
        this.selectProducts = []
      }
      if (this.newValue.stocks == 0) {
        this.errorMessage(this.trans('This Product Out of stock'))
        return
      }
      const existServ = this.selectProducts.find(x => x.id == this.newValue.id)
      if (existServ) {
        this.errorMessage(this.trans('This Product Already Selected'))
        return
      }
      this.selectProducts.push(Products.cloneObject({
        id: this.newValue?.id,
        name: this.newValue?.name,
        stocks: this.newValue?.stocks,
        brand: this.newValue?.brand,
        qty: 1,
        price: this.newValue?.price
      }))
      this.showAddValue = false
      this.newValue = null
    }
    deleteValue(index, type) {
      type == 'emp' ? this.selectedOrder.appointment.employee.splice(index, 1) : this.selectProducts.splice(index, 1)
    }
    deleteValueServ(i, child) {
      this.selectedOrder.appointment.employee[i].services.splice(child, 1)
    }
    getProducts(pageNum?: number, query?: any) {
      if (this.products.length) {
        this.showAddValue = true
        return
      }
      this.loading = true
      const subscription = this.calenderService.getlist('products', pageNum, 1000, query).subscribe((results: any) => {
        this.loading = false
        if (!isSet(results)) {
          return
        }
        results.data.map(item => {
          this.products.push({ id: item?.id, name: item?.attributes?.name, stocks: item?.attributes?.stocks, price: item?.attributes?.price, brand: item?.attributes?.brand?.data?.attributes })
        })
        this.showAddValue = true
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
  cancelAppointment() {
    const subscription = this.orderService.cancelAppointment(this.selectedOrder.appointment).subscribe((data) => {
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
      accept: () => { this.cancelOrder();this.cancelAppointment()  },
    });
  }
  replaceValuesStrings(body) {
    var startDate = moment(this.selectedOrder.appointment.fromDate).format('YYYY-MM-D')
    var startTime = moment(this.selectedOrder.appointment.fromDate).format('HH-MM A')
    var customer = this.selectedOrder.appointment.customer.firstName + ' ' + this.selectedOrder.appointment.customer.middleName + ' ' + this.selectedOrder.appointment.customer.lastName
    var number = this.selectedOrder.attributes.orderNo
    var notes = this.selectedOrder.attributes.notes
    var cash = this.selectedOrder.cash
    var discount = this.selectedOrder.discount
    var employee = this.selectedOrder.appointment.employee
    var deposit = this.selectedOrder.appointment.deposit
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
            window.open(`https://web.whatsapp.com/send?phone=${this.selectedOrder.appointment.phone}&text=${body}`, "_blank")
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
    doc.text(this.invoiceInfo?.address ? this.invoiceInfo?.address : '', 150, 40, { align: 'center' });
    doc.text(this.invoiceInfo?.phone, 150, 50, { align: 'center' });


    // Add Invoice Title
    doc.setFontSize(12);
    const customer = this.selectedOrder?.appointment?.customer;
    const address = this.selectedOrder?.appointment?.address
    doc.text(`${customer.firstName} ${customer.middleName} ${customer.lastName}`, 15, 70);
    doc.text(`${address ? address : ''}`, 15, 80);
    doc.text(`${this.selectedOrder?.appointment?.phone}`, 15, 90);

    // Invoice details
    doc.text(`${this.selectedOrder?.attributes?.orderNo}`, 150, 70, { align: 'center' });
    doc.text(`${new Date(this.selectedOrder?.attributes?.createdAt).toLocaleString()}`, 150, 80, { align: 'center' });

    // Table with autoTable
    const tableBody = this.selectedOrder.appointment.products.map((product: any, index: number) => ([
      index + 1,
      product.name,
      product.qty,
      product.price,
      (product.qty * product.price).toFixed(2),
    ]));
    if (isSet(this.selectedOrder.appointment.products)) {
      autoTable(doc, {
        startY: 115,
        theme: 'grid',
        tableWidth: 'auto',
        styles: { font: 'amiri' },
        head: [[this.trans('Product Name'), this.trans('Quantity'), this.trans('Price')]],
        body: this.selectedOrder.appointment.products.map((product) => [
          product.name || 'N/A',
          product.qty || 0,
          product.price || 0
        ])
      });

    }

    // Employee Services Table (Ensure values are not undefined)
    if (isSet(this.selectedOrder.appointment.employee)) {
      const employeeTableBody = this.selectedOrder.appointment.employee.map((employee: any, index: number) => {
        const services = employee.services.map((service: any) => `${this.lang == 'en' ? service.en : service.ar} (${service.price})`).join(", ");
        return [
          index + 1,
          employee.username,
          services
        ];
      });
      autoTable(doc, {
        startY: isSet(this.selectedOrder.appointment.products) ? (doc as any).lastAutoTable.finalY + 10 : 100,
        styles: { font: 'amiri' },
        tableWidth: 'auto',
        head: [['#', this.trans('Employee'), this.trans('Services')]],
        body: employeeTableBody
      });
    }
    doc.setFontSize(12);
    doc.text(this.trans('Services'), 150, (doc as any).lastAutoTable.finalY + 30, { align: 'center' })
    doc.text(`${this.getTotalPrice().products}` + `    ${this.getCurrencySymbol(this.cur.name)}`, 180, (doc as any).lastAutoTable.finalY + 30, { align: 'center' });
    doc.text(this.trans('Deposit'), 150, (doc as any).lastAutoTable.finalY + 35, { align: 'center' })
    doc.text(`${this.selectedOrder.appointment?.deposit}` + `    ${this.getCurrencySymbol(this.cur.name)}`, 180, (doc as any).lastAutoTable.finalY + 35, { align: 'center' });
    doc.setTextColor('green')
    doc.text(this.trans('Paid'), 150, (doc as any).lastAutoTable.finalY + 40, { align: 'center' })
    doc.text(`${this.selectedOrder.attributes.cash}` + `    ${this.getCurrencySymbol(this.cur.name)}`, 180, (doc as any).lastAutoTable.finalY + 40, { align: 'center' });
    doc.setTextColor('red')
    doc.text(this.trans('Unpaid'), 150, (doc as any).lastAutoTable.finalY + 45, { align: 'center' })
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
    this.imgDealog = true
    this.link = document.createElement('a');
    this.imgData = imageData
    // console.log( encodeURIComponent(imageData));
    // window.open(`https://web.whatsapp.com/send?phone=${this.selectedOrder.appointment.phone}&text=${encodeURIComponent(imageData)}`, "_blank")


  }
  downloadImg() {
    this.link.href = this.imgData
    this.link.download = this.selectedOrder.attributes.orderNo;
    this.link.click();
  }
  getOrder(id) {
    const subscription = this.orderService.getOrder(id).subscribe((results: any) => {
      if (!isSet(results)) {
        return
      }
      
      this.selectedOrder = results.data
      this.selectedOrder.appointment = this.selectedOrder.attributes.appointment.data.attributes
      this.selectedOrder.appointment.id = this.selectedOrder.attributes.appointment.data.id
      this.selectedOrder.attributes.createdAt = moment(this.selectedOrder.attributes.createdAt).format('YYYY-MM-DD HH:ss')
      this.selectedOrder.appointment.fromDate = new Date(this.selectedOrder.appointment.fromDate)
      this.selectedOrder.appointment.toDate = new Date(this.selectedOrder.appointment.toDate)
      this.selectedOrder.discount = !this.selectedOrder.attributes.discount ? 0 : this.selectedOrder.attributes.discount
      this.selectedOrder.cash = !this.selectedOrder.attributes.cash ? 0 : this.selectedOrder.attributes.cash
      this.selectProducts=this.selectedOrder.appointment.products
      if (this.selectedOrder.attributes.discountType) {
        this.selectedOrder.discountType = this.selectedOrder.attributes.discountType
        this.discountMode = 'show'
      }
      if (this.selectedOrder.attributes.pay_by.data) {
        this.selectedOrder.pay_by = this.selectedOrder?.attributes?.pay_by?.data?.attributes
        this.payByMode = true
      } else {
        this.
          payByMode = false
      }      
      this.coCash= this.selectedOrder.cash
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
  completeAppointment() {
    const subscription = this.calenderService.completeAppointment(this.selectedOrder.attributes.appointment.data).subscribe((data) => {
      if (!isSet(data)) {
        return
      }
         if (this.selectProducts.length) {
          this.selectProducts.map(prod => {  
            this.updateProduct(prod, prod.id)
          })
        }
      subscription.unsubscribe()
    }, error => {
      subscription.unsubscribe()
    })
  }
  updateAppointemt() {
    this.selectedOrder.appointment.fromDate = new Date(this.selectedOrder.appointment.fromDate).toISOString()
    this.selectedOrder.appointment.toDate = new Date(this.selectedOrder.appointment.toDate).toISOString()
    this.selectedOrder.appointment.firstName = this.selectedOrder.appointment?.customer?.firstName
    this.selectedOrder.appointment.middleName = this.selectedOrder.appointment?.customer?.middleName
    this.selectedOrder.appointment.lastName = this.selectedOrder.appointment?.customer?.lastName
    this.selectedOrder.appointment.products= this.selectProducts
    const subscription = this.calenderService.updateAppointemt(this.selectedOrder.appointment).subscribe((results: any) => {
      if (!isSet(results)) {
        return
      }
      subscription.unsubscribe()
    }, error => {
      subscription.unsubscribe()
    })
  }

}
