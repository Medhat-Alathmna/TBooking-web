import { Component, Inject, OnInit } from '@angular/core';
import { PrimeNGConfig } from 'primeng/api';
import { TranslateService } from "@ngx-translate/core";
import { DOCUMENT } from '@angular/common';
import { ActivatedRoute, NavigationStart, Router } from '@angular/router';
import { CalenderService } from './Modules/calender/calender.service';
import { OrdersService } from './Modules/orders/orders.service';
import { SettingsService } from './Modules/settings/settings.service';
import { isSet } from './core/base/base.component';
import { PermissionService } from './core/permission.service';



@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
})
export class AppComponent implements OnInit {
  menuMode = 'sidebar';

  darkMode = 'light';

  topbarTheme = 'light';

  menuTheme = 'light';

  inputStyle = 'outlined';

  ripple: boolean;
  prev:any=localStorage.getItem('prev')
  
  constructor(private primengConfig: PrimeNGConfig, private PermissionService:PermissionService,
    private translate: TranslateService, private router: Router,private settingsServices:SettingsService,
     private calenderService: CalenderService,private orderService:OrdersService,
    @Inject(DOCUMENT) private document: Document) { 
    }

  async ngOnInit() {
    this.primengConfig.ripple = false;
    this.getLang()
    this.getGeneralSettings()
    this.getCurrencies()
  

  } 
  

  getLang() {
    if (!localStorage.getItem('currentLang')) {
      localStorage.setItem('currentLang', 'en')
    }
    const lang = localStorage.getItem('currentLang')
    this.translate.setDefaultLang(lang);
    this.translate.use(lang);
    const htmlTag = this.document.getElementsByTagName("html")[0] as HTMLHtmlElement;
    htmlTag.dir = lang !== "en" ? "rtl" : "ltr";
  }
  getColors() {
    const genralSettings = JSON.parse(localStorage.getItem('systemColor'))
    document.documentElement.style.setProperty('--primary-color', genralSettings.primaryColor)
    document.documentElement.style.setProperty('--text-color', genralSettings.textColor)
    document.documentElement.style.setProperty('--surface-500', genralSettings.secondaryColor)


  }
 


  getGeneralSettings() {
    const subscription = this.settingsServices.getGeneralSettings().subscribe((results: any) => {
      if (!isSet(localStorage.getItem('systemColor'))) {
        localStorage.setItem('systemColor',JSON.stringify(results.data.attributes))
      }
      this.getColors()
        subscription.unsubscribe()
    }, error => {
        subscription.unsubscribe()
    })
}
getCurrencies() {
  const subscription = this.settingsServices.getCurrencies().subscribe((results: any) => {
    localStorage.setItem('currency',JSON.stringify(results.data.attributes))

      subscription.unsubscribe()
  }, error => {
      subscription.unsubscribe()
  })
}

}
