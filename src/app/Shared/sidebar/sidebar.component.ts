import { CommonModule, DOCUMENT } from '@angular/common';
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

  constructor(@Inject(DOCUMENT) private document: Document) { }
  @Input() display = false
  @Output() displayChange: EventEmitter<boolean> = new EventEmitter();
  @Input() size='xl-sidbar'

  ngOnInit(): void {
    
  }
  onHide() {
    this.overflow('auto')
    this.displayChange.emit(false);
  }
  onShow(){
    this.overflow('hidden')
  }
  overflow(value) {
    const htmlTag = this.document.getElementsByTagName("html")[0] as HTMLHtmlElement
    htmlTag.style.overflow = value
  }
}
