import { AfterViewInit, Component, OnInit } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot, Router } from '@angular/router';
import { BaseComponent, isSet } from 'src/app/core/base/base.component';
import { AppMainComponent } from '../Main/app.main.component';
import { MenuService } from './app.menu.service';
import { OrdersService } from 'src/app/Modules/orders/orders.service';
import { PermissionService } from 'src/app/core/permission.service';
import { CalenderService } from 'src/app/Modules/calender/calender.service';

@Component({
  selector: 'app-menu',
  templateUrl: './app.menu.component.html',
  styleUrls: ['./app.menu.component.scss'],

})
export class AppMenuComponent extends BaseComponent implements AfterViewInit, OnInit {


  model: any[];
  // menu-wrapper
  constructor(public appMain: AppMainComponent, private permissionService: PermissionService, private calenderService: CalenderService,
    private router: Router, private avtiveRouter: Router, private orderService: OrdersService,
    private menuService: MenuService,
  ) {
    super(null)
    this.getMe()
  }
  lang = localStorage.getItem('currentLang')
  activeControlPanel = false
  activeTeamPanel = false

  customModulesClick = false
  customModules = []
  ngAfterViewInit() {

  }
   ngOnInit() {

  }
  initModules() {
    this.model = [
      { label: 'Appointments', icon: 'pi pi-calendar-plus text-color', routerLink: ['/calender'], resource: 'Appointments' },
      { label: 'Orders', icon: 'pi pi-money-bill text-color', routerLink: ['/orders'], resource: 'Orders' },
      { label: 'Purchase Orders', icon: 'pi pi-ticket text-color', routerLink: ['/purchase-order'], resource: 'PurchaseOrders' },
      { label: 'Vendors', icon: 'pi pi-shopping-cart text-color', routerLink: ['/vendors'], resource: 'Vendors' },
      { label: 'Dashboard', icon: 'pi pi-chart-pie text-color', routerLink: ['/dashboard'], resource: 'Dashboard' },
      { label: 'Products', icon: 'pi pi-box text-color', routerLink: ['/products'], resource: 'Products' },
      { label: 'Mobile App', icon: 'pi pi-mobile text-color', routerLink: ['/mobile'], resource: 'Gallary' },
      { label: 'Users', icon: 'pi pi-users text-color', routerLink: ['/users'], resource: 'Users' },
      { label: 'Settings', icon: 'pi pi-cog text-color', style: 'top: 70%;position: fixed', routerLink: ['/settings'], resource: 'SiteSittengs' },
    ];
    this.model = this.model.filter(item => this.hasPermission(item.resource, 'view'));
    this.menuService.menuData = this.model
  }

  hasPermission(resource: string, action: string): boolean {
    const permissionsForResource = this.permissionService.userPermissions[resource];

    // Check if the permission exists and matches the action
    if (permissionsForResource && permissionsForResource[action] !== undefined) {
      return permissionsForResource[action] === true;
    }

    return false;
  }


  getMe() {
    this.loading=true
    const subscription = this.calenderService.getMe().subscribe(async (user: any) => {
      this.loading=false
      localStorage.setItem('role', JSON.stringify(user.role))
      await  sessionStorage.setItem('prev', JSON.stringify(user.privilege.pages))
      await this.permissionService.setPermissions(user.privilege.pages);
      this.initModules()
      subscription.unsubscribe()
    }, error => {
      this.loading=false
      this.logOut()
      subscription.unsubscribe()
    })
  }
  logOut() {
    localStorage.removeItem('userAuth')
    localStorage.removeItem('role')
    sessionStorage.clear()
  location.reload()
  }


}
