import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Inject, Input, OnInit, Output } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { SidebarModule } from 'primeng/sidebar';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule,SidebarModule, TranslateModule],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {

  constructor() { }
  @Input() display = false
  @Output() displayChange: EventEmitter<boolean> = new EventEmitter();
  @Input() size='xl-sidbar'

  ngOnInit(): void {
    
  }
  onHide() {
    this.displayChange.emit(false);
  }


}
