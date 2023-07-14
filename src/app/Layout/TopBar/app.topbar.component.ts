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
    templateUrl: './app.topbar.component.html'
})
export class AppTopBarComponent extends BaseComponent implements OnDestroy, OnInit {

    subscription: Subscription;
    items: MenuItem[];
    user = {displayName:'Medhat',photo:null}
    currentLogo: any
    constructor(public app: AppComponent, public appMain: AppMainComponent,
        private sanitizer: DomSanitizer,
        private translate: TranslateService, private route: ActivatedRoute, private router: Router,
        @Inject(DOCUMENT) private document: Document) {
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
        localStorage.removeItem('genralSettings')
        localStorage.setItem('currentLang', lang)
        localStorage.removeItem('settings')
        location.reload()
    }
    logOut() {
        // this.authService.clearAuthData()
        this.router.navigate(['/login']);

    }
  


    sanitize(file: any) {
        return this.sanitizer.bypassSecurityTrustUrl(file.objectURL.changingThisBreaksApplicationSecurity);
    }

  
}
