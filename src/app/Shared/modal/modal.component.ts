import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {DialogModule} from 'primeng/dialog';

@Component({
  selector: 'app-modal',
  standalone:true,
  imports:[DialogModule,CommonModule],
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss']
})
export class ModalComponent implements OnInit {
  @Input() display:boolean=false
  @Output() displayChange: EventEmitter<boolean> = new EventEmitter();
  @Input() class:string
  @Input() title:string
  @Input() footer:boolean=true

  constructor() { }

  ngOnInit(): void {
  }
  onHide(){
    this.displayChange.emit(false)
  }
}
