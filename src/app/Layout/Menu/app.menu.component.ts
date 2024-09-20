import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot, Router } from '@angular/router';
import { BaseComponent, isSet } from 'src/app/core/base/base.component';
import { AppMainComponent } from '../Main/app.main.component';
import { MenuService } from './app.menu.service';
import { OrdersService } from 'src/app/Modules/orders/orders.service';

@Component({
    selector: 'app-menu',
    templateUrl: './app.menu.component.html',
    styleUrls: ['./app.menu.component.scss'],

})
export class AppMenuComponent extends BaseComponent implements OnInit {
    

    model: any[];
    // menu-wrapper
    constructor(public appMain: AppMainComponent, private router: Router,private avtiveRouter:Router ,private orderService:OrdersService,
        private menuService: MenuService,
) { super(null)
        }
    lang = localStorage.getItem('currentLang')
    activeControlPanel = false
    activeTeamPanel = false

    customModulesClick = false
    customModules = []

    ngOnInit() {
        this.initModules()
            console.log(this.checkUrl('/settings'));



    }
    initModules() {
        this.model = [
            // { label: 'Home',  icon: 'pi pi-home text-color', routerLink: ['/'] },
            // { label: 'Dashboard',  icon: 'icon-statistics text-color', routerLink: ['/dashboard'] },
            { label: 'Appointments', icon: 'pi pi-calendar-plus text-color', routerLink: ['/calender'] },
            { label: 'Orders',  icon: 'pi pi-money-bill text-color', routerLink: ['/orders'] },
            { label: 'Users',  icon: 'pi pi-users text-color', routerLink: ['/users'] },
            { label: 'Dashboard',  icon: 'pi pi-chart-pie text-color', routerLink: ['/dashboard'] },            
            { label: 'Products',  icon: 'pi pi-ticket text-color', routerLink: ['/products'] },            
            { label: 'Mobile App',  icon: 'pi pi-ticket text-color', routerLink: ['/mobile'] },            
            { label: 'Settings',  icon: 'pi pi-cog text-color', routerLink: ['/settings'] },            
        ];
        this.menuService.menuData = this.model
       this.checkRole()
    }
   
    navToContorlPanal() {
        this.router?.navigateByUrl('settings')
        console.log(this.checkUrl('/settings'));
        
    }
    checkUrl(url){
        return   this.avtiveRouter
        return   this.avtiveRouter.routerState.snapshot.url === url
        this.router.isActive('/settings',true)
    }

    checkRole(){
    const sub=    this.orderService.checkRoleEmitter.subscribe(result=>{
      const  role =JSON.parse(localStorage.getItem('role'))
        console.log(result);
        
        this.model = [
            // { label: 'Home',  icon: 'pi pi-home text-color', routerLink: ['/'] },
            // { label: 'Dashboard',  icon: 'icon-statistics text-color', routerLink: ['/dashboard'] },
            { label: 'Appointments', icon: 'pi pi-calendar-plus text-color', routerLink: ['/calender'] },
            { label: 'Orders',  icon: 'pi pi-money-bill text-color', routerLink: ['/orders'] },
            { label: 'Users',  icon: 'pi pi-users text-color', routerLink: ['/users'] },
            { label: 'Dashboard',  icon: 'pi pi-chart-pie text-color', routerLink: ['/dashboard'] },            
            { label: 'Products',  icon: 'pi pi-ticket text-color', routerLink: ['/products'] },            
            { label: 'Mobile App',  icon: 'pi pi-mobile text-color', routerLink: ['/mobile'] },     
            { label: 'Settings',  icon: 'pi pi-cog text-color', routerLink: ['/settings'] ,style:'top: 50%;position: fixed'},            
          
        ];
        this.menuService.menuData = this.model
        console.log(role);
        
            if (role?.name != 'Admin') {
                this.model.splice(2,3)
            }
        })
        this.subscriptions.push(sub)
    }

    // initCustomModule() {
    //     this.model[this.model.length - 1].items = []
    //     this.customModulesClick == true
    // }

}
