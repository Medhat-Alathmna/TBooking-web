import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { AvatarModule } from 'primeng/avatar';
import { AvatarGroupModule } from 'primeng/avatargroup';
import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';

@Component({
  selector: 'entity-viewer',
  templateUrl: './entity-viewer.component.html',
  styleUrls: ['./entity-viewer.component.scss'],
  imports: [CommonModule, AvatarModule, AvatarGroupModule, TranslateModule, ButtonModule, TooltipModule],
  standalone: true,
})
export class EntityViewerComponent implements OnInit {

  constructor(private router: Router) { }
  @Input() entity: any
  @Input() darkMode: any
  @Input() avatarSize: any
  @Input() avatar: any
  @Input() showAll = false
  show = 5


  ngOnInit(): void {
    if (this.showAll==true) {
      this.show = this.entity?.value?.length
    }
  }
}