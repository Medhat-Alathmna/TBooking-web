import { Component, Inject, NgZone, OnInit } from '@angular/core';
import { PrimeNGConfig } from 'primeng/api';
import { TranslateService } from "@ngx-translate/core";
import { DOCUMENT } from '@angular/common';
import { ActivatedRoute, NavigationStart, Router } from '@angular/router';
import { CalenderService } from './Modules/calender/calender.service';
import { OrdersService } from './Modules/orders/orders.service';
import { SettingsService } from './Modules/settings/settings.service';
import { isSet } from './core/base/base.component';
import { PermissionService } from './core/permission.service';
import { SocketService } from './Shared/socket.service';




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
  prev: any = localStorage.getItem('prev')

  isTabActive = true;
blinkInterval

  constructor(private primengConfig: PrimeNGConfig, private PermissionService: PermissionService,
    private socketService: SocketService, private zone: NgZone
    ,
    private translate: TranslateService, private router: Router, private settingsServices: SettingsService,
    private calenderService: CalenderService, private orderService: OrdersService,
    @Inject(DOCUMENT) private document: Document) {
  }
originalTitle = this.document.title;
  async ngOnInit() {
    if ('Notification' in window && Notification.permission !== 'granted') {
      Notification.requestPermission().then((permission) => {
        console.log('Notification permission:', permission);
      });
    }
this.originalTitle = document.title;

  document.addEventListener('visibilitychange', () => {
    this.isTabActive = !document.hidden;

    if (this.isTabActive) {
      this.stopTitleBlink();
    }
  });

  this.socketService.listen('new-appointment').subscribe((appointment) => {
    this.showBrowserNotification(appointment);
    
    if (!this.isTabActive) {
      this.startTitleBlink();
    }
  });
    this.socketService.listen('new-appointment').subscribe((appointment) => {
      this.showBrowserNotification(appointment);
    });
    this.primengConfig.ripple = false;
    this.getLang()
    this.getGeneralSettings()
    this.getCurrencies()
    this.socketIO()

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
        localStorage.setItem('systemColor', JSON.stringify(results.data.attributes))
      }
      this.getColors()
      subscription.unsubscribe()
    }, error => {
      subscription.unsubscribe()
    })
  }
  getCurrencies() {
    const subscription = this.settingsServices.getCurrencies().subscribe((results: any) => {
      localStorage.setItem('currency', JSON.stringify(results.data.attributes))

      subscription.unsubscribe()
    }, error => {
      subscription.unsubscribe()
    })
  }

  socketIO() {

    this.socketService.listen('new-appointment').subscribe((appointment) => {
      console.log('New appointment received:', appointment);

    })
  }
  showBrowserNotification(appointment: any): void {
    if (Notification.permission === 'granted') {
      const notification = new Notification('📅 New Appointment', {
        body: `From Mobile User`,
        icon: 'assets/icons/appointment.png', // optional icon
        tag: 'new-appointment'
      });

      notification.onclick = () => {
        window.focus();
        notification.close();
        this.zone.run(() => {
          this.router.navigate(['/appointments', appointment.id]); 
        });
      };
    }
  }
  playSound(): void {
    const audio = new Audio('assets/sounds/notfi.wav');
    audio.play().catch(err => {
      console.error('Notification sound failed:', err);
    });
  }

  startTitleBlink() {
  let toggle = false;

  if (this.blinkInterval) return; // Don't start multiple intervals

  this.blinkInterval = setInterval(() => {
    document.title = toggle ? '📅 New Appointment!' : this.originalTitle;
    toggle = !toggle;
  }, 1000);
}

stopTitleBlink() {
  if (this.blinkInterval) {
    clearInterval(this.blinkInterval);
    this.blinkInterval = null;
    document.title = this.originalTitle;
  }
}
}
