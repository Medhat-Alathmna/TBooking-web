import { Component, Inject, OnInit } from '@angular/core';
import { PrimeNGConfig } from 'primeng/api';
import { TranslateService } from "@ngx-translate/core";
import { DOCUMENT } from '@angular/common';
import { ActivatedRoute, NavigationStart, Router } from '@angular/router';
import { CalenderService } from './Modules/calender/calender.service';

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

  constructor(private primengConfig: PrimeNGConfig, private translate: TranslateService, private router: Router, private calenderService: CalenderService,
    @Inject(DOCUMENT) private document: Document) { }

  ngOnInit() {
    if (!JSON.parse(localStorage.getItem('role'))) {
      this.getMe()
    }
    this.primengConfig.ripple = false;
    this.getLang()
    // this.getColors()

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
    const SystemColors={
      primaryColor: getComputedStyle(document.documentElement).getPropertyValue('--primary-color'),
      textColor:getComputedStyle(document.documentElement).getPropertyValue('--text-color'),
      textSecondaryColor:getComputedStyle(document.documentElement).getPropertyValue('--surface-500'),

    } 
    localStorage.setItem('SystemColors', JSON.stringify(SystemColors))


  }
  getMe() {
    const subscription = this.calenderService.getMe().subscribe((user: any) => {
      console.log(user);
      localStorage.setItem('role', JSON.stringify(user.role))

      subscription.unsubscribe()
    }, error => {
      console.log(error);
      subscription.unsubscribe()
    })
  }

}
