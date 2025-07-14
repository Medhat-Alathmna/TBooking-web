import { Component, OnInit, ViewChild } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { MessageService } from 'primeng/api';
import { Table } from 'primeng/table';
import { CalenderService } from 'src/app/Modules/calender/calender.service';
import { BaseComponent, isSet } from 'src/app/core/base/base.component';
import { PermissionService } from 'src/app/core/permission.service';
import { Filter } from 'src/app/modals/filter';
import { Products } from 'src/app/modals/products';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})
export class ProductsComponent extends BaseComponent implements OnInit {

  selectedProduct: Products
  rowNum: any = 10
  id: any
  currentPage: any = 1
  showProductSidebar: boolean = false
  detailMode: boolean = false
  total
  products: any = []
  fillterFildes = {
    name: new Filter(),
    stocks: new Filter(),
    price: new Filter(),
  }
  queryTypes = [

    {
      type: 'Not Equal',
      value: '$ne'
    },
    {
      type: 'Equal',
      value: '$eq'
    },
    {
      type: 'Less than',
      value: '$lt'
    },
    {
      type: 'Greater Than',
      value: '$gt'
    },

  ]
  keys = [
    { header: this.lang == 'en' ? 'Product' : 'اسم المنتج', key: 'name' },
    { header: this.lang == 'en' ? 'Price' : 'سعر', key: 'price' },
    { header: this.lang == 'en' ? 'Sell Price' : 'سعر شراء', key: 'sellPrice' },
    { header: this.lang == 'en' ? 'Stocks' : 'المخزون', key: 'stocks' },
    { header: this.lang == 'en' ? 'Barcode' : 'الباركود', key: 'barcode' },
    { header: this.lang == 'en' ? 'Brand' : 'العلامة التجارية', key: 'brand.name' },

  ]
  @ViewChild('kt') table: Table;

  constructor(public translates: TranslateService, public messageService: MessageService, public permissionService: PermissionService,
    private calenderService: CalenderService,) { super(messageService, translates) }

  ngOnInit(): void {
    this.clearAllFillter()
  }

  getProducts(pageNum?: number, query?: any) {
    this.loading = true
    const subscription = this.calenderService.getlist('products', pageNum, 10, query).subscribe((results: any) => {
      this.loading = false
      if (!isSet(results)) {
        return
      }
      this.products = []
      const clone = results.data
      this.total = results.meta.pagination.total
      if (!isSet(this.products)) {
        this.products = Array(this.total).fill(0)
      }
      if (clone.length < this.rowNum) {
        for (let index = clone.length; index < this.rowNum; index++) {
          clone[index] = null
        }
      }
      //
      if (!isSet(pageNum)) {
        clone.map((item, index) => {
          this.products[index] = item
        })

      } else {
        const currentPage = pageNum * this.rowNum
        let cloneObjIndex = 0
        for (let index = currentPage - this.rowNum; index < currentPage; index++) {
          this.products[index] = clone[cloneObjIndex++]
        }
      }
      //
      if (!isSet(this.products?.next)) {
        this.products = this.products.filter(item => {
          return isSet(item)
        })
      }
      setTimeout(() => {
        this.table.first = pageNum > 1 ? (pageNum - 1) * this.rowNum : 0
      });
      subscription.unsubscribe()
    }, error => {
      this.loading = false
      subscription.unsubscribe()
    })
  }

  showProdSide() {
    this.selectedProduct = new Products
    this.showProductSidebar = true
    this.detailMode = false
  }
  selectProd(prod: Products) {
    this.id = prod.id
    this.selectedProduct = prod.attributes
    this.showProductSidebar = true
    this.detailMode = true

  }
  clearAllFillter() {
    this.fillterFildes = {
      name: new Filter(),
      stocks: new Filter(),
      price: new Filter()
    }
    this.calenderService.queryFilters = []
    this.getProducts(1, null)
  }
}
