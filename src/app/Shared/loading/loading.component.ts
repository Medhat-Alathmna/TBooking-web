import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import {ProgressSpinnerModule} from 'primeng/progressspinner';

@Component({
  selector: 'app-loading',
  templateUrl: './loading.component.html',
  standalone:true,
  imports:[ProgressSpinnerModule,CommonModule],
  styleUrls: ['./loading.component.scss']
})
export class LoadingComponent implements OnInit {

  constructor() { }
@Input() display='part'
  ngOnInit(): void {
  }

}
