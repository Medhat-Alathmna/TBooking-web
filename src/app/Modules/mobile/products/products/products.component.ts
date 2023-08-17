import { Component, OnInit, ViewChild } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { MessageService } from 'primeng/api';
import { CalenderService } from 'src/app/Modules/calender/calender.service';
import { BaseComponent, isSet } from 'src/app/core/base/base.component';
import { Products } from 'src/app/modals/products';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})
export class ProductsComponent extends BaseComponent implements OnInit {

  selectedProduct: Products
  rowNum: any = 10
  currentPage: any = 1
  showProductSidebar: boolean = false
  detailMode: boolean = false
  total
  products: any = []

  @ViewChild('kt') table: any;

  constructor(public translates: TranslateService, public messageService: MessageService, private calenderService: CalenderService,) { super(messageService, translates) }

  ngOnInit(): void {
    this.getProducts()
  }

  getProducts(pageNum?: number, query?: any) {
    this.loading = true
    const subscription = this.calenderService.getlist('products', pageNum, 10, query).subscribe((results: any) => {
      this.loading = false
      if (!isSet(results)) {
        return
      }
      console.log(results);

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
      console.log(error);
      subscription.unsubscribe()
    })
  }

  showProdSide(){
    this.selectedProduct=new Products
    this.showProductSidebar=true
  }
}
