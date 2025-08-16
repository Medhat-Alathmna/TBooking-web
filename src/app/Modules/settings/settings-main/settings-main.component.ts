import { AfterViewInit, Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { MessageService } from 'primeng/api';
import { BaseComponent } from 'src/app/core/base/base.component';
import { PermissionService } from 'src/app/core/permission.service';

@Component({
  selector: 'app-settings-main',
  templateUrl: './settings-main.component.html',
  styleUrls: ['./settings-main.component.scss']
})
export class SettingsMainComponent extends BaseComponent implements AfterViewInit {
  items: any[] = []
  selectedView = 'Site Settings'
  currentIndex = 0
  currentIndexModule = 0
 

  constructor(public translates: TranslateService, public permissionService:PermissionService,
    public messageService: MessageService,) { super(messageService, translates) }
  ngAfterViewInit(){
    setTimeout(() => {
      this.getMenu()

    }, );
  }
  getMenu() {
    this.items = [
      {
        id: 0, label: 'General Settings', styleClass: 'active', icon: this.angleIcon() + ' px-2',
        command: (event) => {
          this.selectedView = 'Site Settings';
          this.selectActiveMenu(event?.item?.id)

        }
      },
      {
        id: 1, label: 'Notifications',  icon: this.angleIcon() + ' px-2',
        disabled:!this.permissionService.hasPermission('SiteSittengs','Notifications'),
        command: (event) => {
          this.selectedView = 'Notifications'
          this.selectActiveMenu(event?.item?.id)

        }
      }
      ,
      {
        id: 2, label: 'Forbidden Numbers',  icon: this.angleIcon() + ' px-2',
        disabled:!this.permissionService.hasPermission('SiteSittengs','ForbbidenNumber'),
        command: (event) => {
          this.selectedView = 'Forbidden Numbers'
          this.selectActiveMenu(event?.item?.id)

        }
      },
      {
        id: 3, label: 'Appointments Settings',  icon: this.angleIcon() + ' px-2',
        disabled:!this.permissionService.hasPermission('SiteSittengs','AppointmentsSettings'),

        command: (event) => {
          this.selectedView = 'Appointments Settings'
          this.selectActiveMenu(event?.item?.id)
        }
      },
      {
        id: 4, label: 'Orders Settings',  icon: this.angleIcon() + ' px-2',
        disabled:!this.permissionService.hasPermission('SiteSittengs','AppointmentsSettings'),

        command: (event) => {
          this.selectedView = 'Orders Settings'
          this.selectActiveMenu(event?.item?.id)
        }
      },
      {
        id: 5, label: 'Mobile Notifications',  icon: this.angleIcon() + ' px-2',
        disabled:!this.permissionService.hasPermission('SiteSittengs','MobilePushNotifications'),
        command: (event) => {
          this.selectedView = 'Mobile Notifications'
          this.selectActiveMenu(event?.item?.id)
        }
      }
    ]
    this.selectActiveMenu(0)
    this.items.map(item => {
      item.label = this.trans(item.label)
    })
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
