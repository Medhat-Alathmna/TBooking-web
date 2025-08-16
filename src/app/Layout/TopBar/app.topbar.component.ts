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

@Component({
    selector: 'app-topbar',
    styleUrls: ['./app.topbar.component.scss'],
    templateUrl: './app.topbar.component.html',
})
export class AppTopBarComponent extends BaseComponent implements OnDestroy, OnInit {
newAppointmentsCount: number = 1;
    subscription: Subscription;
    items: MenuItem[];
notifications = [
  {
    sender: 'Orabi Mansour',
    avatar: 'https://example.com/avatar1.jpg',
    message: 'listed in <strong>Gaza Hardware</strong>: "تشكيلة مميزة من طقم ..."',
    time: '1d',
    unread: false
  },
  {
    sender: 'Mohamed Bekhit',
    avatar: 'https://example.com/avatar2.jpg',
    message: 'mentioned you in a comment.',
    time: '1w',
    unread: true
  }
];    user = {displayName:this.userAuth.username,gender:this.userAuth.gender}
    currentLogo: any
    showPriv:boolean=false
   
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
        window.location.href = window.location.pathname;
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
moveToAppointment(){

}
  
}
