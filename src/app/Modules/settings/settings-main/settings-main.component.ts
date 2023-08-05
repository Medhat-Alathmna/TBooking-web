import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { MessageService } from 'primeng/api';
import { BaseComponent } from 'src/app/core/base/base.component';

@Component({
  selector: 'app-settings-main',
  templateUrl: './settings-main.component.html',
  styleUrls: ['./settings-main.component.scss']
})
export class SettingsMainComponent extends BaseComponent implements OnInit {
  items:any[]=[
    {
      id: '0', label:'Site Settings' , styleClass: 'active', icon: this.angleIcon() + ' px-2',
       command: (event) => {
        this.selectedView= 'Site Settings';
        this.selectActiveMenu(event?.item?.id)

      }
    },
    {
      id: '1',  label:'Notifications',styleClass: 'active', icon: this.angleIcon() + ' px-2',
      command: (event) => {
        this.selectedView= 'Notifications'
        this.selectActiveMenu(event?.item?.id)

      }
    }
  ]
  selectedView= 'Notifications'
  currentIndex = 0
  currentIndexModule = 0

  constructor(public translates: TranslateService, public messageService: MessageService,) { super(messageService, translates) }

  ngOnInit(): void {
    this.selectActiveMenu(1)
  }

  angleIcon() {
    if (this.lang == 'ar') {
      return 'pi pi-angle-left'
    } else return 'pi pi-angle-right'

  }
  selectActiveMenu(index) {
    this.items[Number(this.currentIndex)].styleClass = ''
    this.items[Number(index)].styleClass = 'active'
    this.currentIndex = index
    if (index != 1) {
      this.items[1].expanded = false
      if (this.items[1]?.items?.length) {
        this.items[1].items[this.currentIndexModule].styleClass = ''

      }
    }
  }

  activeMenu(event) {
    let node;
    if (event?.target?.tagName === "A") {
      node = event?.target;
    } else {
      node = event?.target?.parentNode;
    }
    let menuitem = document.getElementsByClassName("ui-menuitem-link");
    for (let i = 0; i < menuitem.length; i++) {
      menuitem[i].classList.remove("active");
    }
    node?.classList?.add("active")
  }

}
