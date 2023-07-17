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
    lang = 'en'
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
            { label: 'Dashboard',  icon: 'icon-statistics text-color', routerLink: ['/dashboard'] },
            { label: 'Tasks', icon: 'icon-tasks text-color', routerLink: ['/calender'] },
            { label: 'Roles',  icon: 'icon-business-meeting text-color', routerLink: ['/meetings'] },
            { label: 'Moblie',  icon: 'pi pi-mobile text-color', routerLink: ['/mobile'] },
            { label: 'News',  icon: 'icon-news text-color', routerLink: ['/news'] },
            { label: 'My Space',  icon: 'pi pi-tags text-color', routerLink: ['/mySpace'] },
            
        ];
        this.menuService.menuData = this.model

    }
   
    navToContorlPanal() {
        this.router?.navigateByUrl('controlPanel/generalsettings/branding')
        this.activeControlPanel = true
        this.activeTeamPanel = false

    }
    navToTeamPanal() {
        this.router?.navigateByUrl('teams')
        this.activeTeamPanel = true
        this.activeControlPanel = false

    }

    // initCustomModule() {
    //     this.model[this.model.length - 1].items = []
    //     this.customModulesClick == true
    // }

}
