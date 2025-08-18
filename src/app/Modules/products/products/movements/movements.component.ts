import { Component, Input, OnInit } from '@angular/core';
import { ProductsService } from '../products.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { PrimengComponentsModule } from 'src/app/primeng-components.module';
import { LoadingComponent } from 'src/app/Shared/loading/loading.component';

@Component({
  selector: 'app-movements',
  templateUrl: './movements.component.html',
  styleUrls: ['./movements.component.scss'],
  standalone: true,
  imports:[
    FormsModule,
        TranslateModule,
        CommonModule,
        PrimengComponentsModule,
  ]
})
export class MovementsComponent implements OnInit {

 movements: any[] = [];
@Input() productId: number;
  constructor(private productService: ProductsService) {}

  ngOnInit(): void {
    this.loadMovements();
  }

  loadMovements() {
    this.productService.productLogs(this.productId).subscribe({
      next: (res: any[]) => {
        this.movements = res;
      },
      error: (err) => console.error(err)
    });
  }

}
