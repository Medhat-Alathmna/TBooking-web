import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AppComponent } from 'src/app/app.component';
import { AppMainComponent } from 'src/app/Layout/Main/app.main.component';
import { ConfigService } from 'src/app/Layout/ThemeConfig/service/app.config.service';
import { AppConfig } from 'src/app/modals/appconfig';
import { SettingsService } from '../settings.service';
import { BaseComponent } from 'src/app/core/base/base.component';
import { TranslateService } from '@ngx-translate/core';
import { MessageService } from 'primeng/api';
import { PermissionService } from 'src/app/core/permission.service';

@Component({
    selector: 'app-site-settings',
    templateUrl: './site-settings.component.html',
    styleUrls: ['./site-settings.component.scss']
})
export class SiteSettingsComponent extends BaseComponent implements OnInit {


    theme = 'purple';

    config: AppConfig;
    currencies = []
    subscription: Subscription;
    selected: any
    systemColors: any
    currency = { name: 'Egyptian pound', value: 'EGP' }

    constructor(public app: AppComponent, public appMain: AppMainComponent,public permissionService:PermissionService, public translates: TranslateService,
        public messageService: MessageService, public configService: ConfigService, private settingsServices: SettingsService) { super(messageService, translates) }
    ngOnInit() {
        this.config = this.configService.config;
        this.subscription = this.configService.configUpdate$.subscribe(config => {
            this.config = config;
        });
        this.getGeneralSettings()
        this.getCurrencies()
        this.currencies = [
            { name: 'Dollar', code: 'USD' },
            { name: 'Euro', code: 'EUR' },
            { name: 'Shekel', code: 'ILS' },
            { name: 'Jordanian dinar', code: 'JOD' },
            { name: 'Egyptian pound', code: 'EGP' },

        ]
        setTimeout(() => {
            this.currencies.map(cur => cur.name = this.trans(cur.name))
        });

        // this.backToDefultColors()
    }




    selectCurrency(currency) {                
        this.updateCurrency(currency)
    }

    replaceLink(linkElement, href) {
        if (this.isIE()) {
            linkElement.setAttribute('href', href);
        } else {
            const id = linkElement.getAttribute('id');
            const cloneLinkElement = linkElement.cloneNode(true);

            cloneLinkElement.setAttribute('href', href);
            cloneLinkElement.setAttribute('id', id + '-clone');

            linkElement.parentNode.insertBefore(cloneLinkElement, linkElement.nextSibling);

            cloneLinkElement.addEventListener('load', () => {
                linkElement.remove();
                cloneLinkElement.setAttribute('id', id);
            });
        }
    }

    isIE() {
        return /(MSIE|Trident\/|Edge\/)/i.test(window.navigator.userAgent);
    }

    onPrimayColorChange() {

        document.documentElement.style.setProperty('--primary-color', this.systemColors?.primaryColor)
      
      
        this.selected = {
            key: 'PrimaryColor',
            value: this.systemColors?.primaryColor
        }


    }
    onTextColorChange() {
        document.documentElement.style.setProperty('--text-color', this.systemColors?.textColor)
        this.selected = {
            key: 'TextColor',
            value: this.systemColors?.textColor
        }
        console.log(this.selected);

    }
    onTextSecondaryColorChange() {
        document.documentElement.style.setProperty('--surface-500', this.systemColors?.secondaryColor)
        this.selected = {
            key: 'SecondaryColor',
            value: this.systemColors?.secondaryColor
        }

    }
    backToDefultColors() {
        document.documentElement.style.setProperty('--primary-color', '#4F7EEA')
        document.documentElement.style.setProperty('--text-color', '#4e535a')
        document.documentElement.style.setProperty('--surface-500', '#797a7b')
        this.systemColors = {
            primaryColor: '#4F7EEA',
            textColor: '#4e535a',
            secondaryColor: '#797a7b',

        }
        this.updateGeneralSettings()

    }

    getGeneralSettings() {
        const subscription = this.settingsServices.getGeneralSettings().subscribe((results: any) => {
            this.systemColors = results.data.attributes
            subscription.unsubscribe()
        }, error => {
            subscription.unsubscribe()
        })
    }
    getCurrencies() {
        const subscription = this.settingsServices.getCurrencies().subscribe((results: any) => {
            this.currency = this.currencies.find(x => x.code == results.data.attributes.code)
            subscription.unsubscribe()
        }, error => {
            subscription.unsubscribe()
        })
    }
    updateGeneralSettings() {
       
        const subscription = this.settingsServices.updateGeneralSettings(this.systemColors).subscribe((results: any) => {
            localStorage.setItem('systemColor', JSON.stringify(results.data.attributes))
            subscription.unsubscribe()
        }, error => {
            subscription.unsubscribe()
        })
    }
    updateCurrency(currency) {
        const subscription = this.settingsServices.updateCurrency(currency).subscribe((results: any) => {
            localStorage.setItem('currency',JSON.stringify(results.data.attributes) )
            this.successMessage(null,this.trans(`The Main currency has been Changed to`) +` ${this.trans(currency.name)}`)
            subscription.unsubscribe()
        }, error => {
            subscription.unsubscribe()
        })
    }

}
