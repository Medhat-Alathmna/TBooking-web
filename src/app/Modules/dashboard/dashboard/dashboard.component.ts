import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { MessageService } from 'primeng/api';
import { BaseComponent, isSet } from 'src/app/core/base/base.component';
import { DashboardService } from '../dashboard.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent extends BaseComponent implements OnInit {

  constructor(public translates: TranslateService, public messageService: MessageService,private dashboardService:DashboardService) {super(messageService,translates) }

  ngOnInit(): void {
    this.count()
  }
  count() {
    const subscription = this.dashboardService.count().subscribe((data) => {
      if (!isSet(data)) {
        return
      }
 console.log(data);
 
      subscription.unsubscribe()
    }, error => {
      console.log(error);
      
      subscription.unsubscribe()
    })
  }
}
