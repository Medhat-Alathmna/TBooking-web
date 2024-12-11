import { Component, OnInit } from '@angular/core';
import { BaseComponent } from 'src/app/core/base/base.component';

@Component({
  selector: 'app-logs',
  templateUrl: './logs.component.html',
  styleUrls: ['./logs.component.scss']
})
export class LogsComponent extends BaseComponent implements OnInit {
logs =[]
  constructor() {super() }

  ngOnInit(): void {
  }

}
