import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { MenuItem } from 'primeng/api';
import { AppMainComponent } from '../Main/app.main.component';
import { TranslateService } from '@ngx-translate/core';
import { DOCUMENT } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { BaseComponent, isSet } from 'src/app/core/base/base.component';
import { DomSanitizer } from '@angular/platform-browser';
import { AppComponent } from 'src/app/app.component';
import { environment, getLocalConfig,clientName } from 'src/environments/environment';

@Component({
    selector: 'app-topbar',
    templateUrl: './app.topbar.component.html',
})
export class AppTopBarComponent extends BaseComponent implements OnDestroy, OnInit {

    subscription: Subscription;
    items: MenuItem[];
    user = {displayName:this.userAuth.username,photo:null}
    currentLogo: any
    showPriv:boolean=false
    resources = [
        { name: 'Appointments', actions: ['create', 'view', 'update', 'delete'] },
        { name: 'Orders', actions: ['create', 'view', 'update', 'cancel'] },
        { name: 'Users', actions: ['create', 'view', 'update', 'delete','Roles','suspend'] },
        { name: 'Roles', actions: ['create','update', 'delete'] },
        { name: 'Dashboard', actions: ['view',] },
        { name: 'Products', actions: ['create', 'view', 'update', 'delete','Services'] },
        { name: 'Services', actions: ['create','update', 'delete'] },
        { name: 'Gallary', actions: ['create', 'view', 'update', 'delete'] },
        // { name: 'MobileApp', actions: ['create', 'view', 'update', 'delete'] },
        { name: 'SiteSittengs', actions: [ 'view', 'update','Notifications','ForbbidenNumber','AppointmentsSettings'] },
        { name: 'Notifications', actions: ['create',  'update', 'delete'] },
        { name: 'ForbbidenNumber', actions: ['create','update', 'delete'] },
      ];
    
      pages = {
        Appointments: { create: false, view: true, update: false, delete: false },
        Orders: { create: false, view: false, update: false, cancel: false },
        Users: { create: false, view: false, update: false, delete: false ,suspend:false,Roles:false},
        Roles: { create: false, update: false, delete: false },
        Dashboard: { view: false},
        Products: { create: false, view: false, update: false, delete: false,Services:false },
        Services: { create: false, update: false, delete: false },
        Gallary: { create: false, view: false, update: false, delete: false },
        // MobileApp: { create: false, view: false, update: false, delete: false },
        SiteSittengs: {  view: false, update: false,Notifications:false,ForbbidenNumber:false,AppointmentsSettings:false},
        Notifications: { create: false, update: false, delete: false },
        ForbbidenNumber: { create: false, update: false, delete: false },
  
      };
    constructor(public app: AppComponent, public appMain: AppMainComponent, public translate: TranslateService,
        private sanitizer: DomSanitizer,
        private route: ActivatedRoute, private router: Router,) {
        super(null, translate)
    }
    ngOnInit(): void {        
    }
    ngOnDestroy() {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
    }
    changeLang(lang) {
        localStorage.setItem('currentLang', lang)
        location.reload()
    }
    logOut() {
        localStorage.removeItem('userAuth')
        localStorage.removeItem('role')
        sessionStorage.clear()
location.reload()
    }
  


    sanitize(file: any) {
        return this.sanitizer.bypassSecurityTrustUrl(file.objectURL.changingThisBreaksApplicationSecurity);
    }

  
}
