import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BaseComponent, isSet } from 'src/app/core/base/base.component';
import { AppMainComponent } from '../Main/app.main.component';
import { MenuService } from './app.menu.service';

@Component({
    selector: 'app-menu',
    templateUrl: './app.menu.component.html',
    styleUrls: ['./app.menu.component.scss']

})
export class AppMenuComponent   implements OnInit {

    model: any[];
    // menu-wrapper
    constructor(public appMain: AppMainComponent, private router: Router,
        private menuService: MenuService,
) { 
        }
    lang = localStorage.getItem('currentLang')
    activeControlPanel = false
    activeTeamPanel = false

    customModulesClick = false
    customModules = []

    ngOnInit() {
        this.initModules()

    }
    initModules() {
        this.model = [
            { label: 'Home',  icon: 'pi pi-home text-color', routerLink: ['/'] },
            // { label: 'Dashboard',  icon: 'icon-statistics text-color', routerLink: ['/dashboard'] },
            { label: 'Appointments', icon: 'pi pi-calendar-plus text-color', routerLink: ['/calender'] },
            { label: 'Orders',  icon: 'pi pi-money-bill text-color', routerLink: ['/orders'] },
            { label: 'Users',  icon: 'pi pi-users text-color', routerLink: ['/users'] },
            { label: 'Services',  icon: 'pi pi-ticket text-color', routerLink: ['/mobile'] },            
        ];
        this.menuService.menuData = this.model

    }
   
    navToContorlPanal() {
        this.router?.navigateByUrl('settings')
    }

    // initCustomModule() {
    //     this.model[this.model.length - 1].items = []
    //     this.customModulesClick == true
    // }

}
