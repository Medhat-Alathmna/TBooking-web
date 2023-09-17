import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AppComponent } from 'src/app/app.component';
import { AppMainComponent } from 'src/app/Layout/Main/app.main.component';
import { ConfigService } from 'src/app/Layout/ThemeConfig/service/app.config.service';
import { AppConfig } from 'src/app/modals/appconfig';

@Component({
  selector: 'app-site-settings',
  templateUrl: './site-settings.component.html',
  styleUrls: ['./site-settings.component.scss']
})
export class SiteSettingsComponent implements OnInit {

  themes: any[];

  theme = 'purple';

  config: AppConfig;

  subscription: Subscription;

  constructor(public app: AppComponent, public appMain: AppMainComponent, public configService: ConfigService) { }
  ngOnInit() {
    this.config = this.configService.config;
    this.subscription = this.configService.configUpdate$.subscribe(config => {
        this.config = config;
    });

    this.themes = [
        {name: 'blue', color: '#2c84d8'},
        {name: 'green', color: '#34B56F'},
        {name: 'orange', color: '#FF810E'},
        {name: 'turquoise', color: '#58AED3'},
        {name: 'avocado', color: '#AEC523'},
        {name: 'purple', color: '#464DF2'},
        {name: 'red', color: '#FF9B7B'},
        {name: 'yellow', color: '#FFB340'},
    ];
}

onChangeTopbar(event, mode) {
    this.app.menuTheme = mode;
}

changeColorScheme(scheme) {
    this.changeStyleSheetsColor('layout-css', 'layout-' + scheme + '.css', 1);
    this.changeStyleSheetsColor('theme-css', 'theme-' + scheme + '.css', 1);

    this.app.darkMode = scheme;
    this.app.topbarTheme = scheme;
    this.app.menuTheme = scheme;

    this.configService.updateConfig({...this.config, ...{dark: scheme === 'dark'}});
}

changeTheme(theme) {
    this.theme = theme;
    this.changeStyleSheetsColor('theme-css', theme, 2);
}

changeStyleSheetsColor(id, value, from) {
    const element = document.getElementById(id);
    const urlTokens = element.getAttribute('href').split('/');

    if (from === 1) {           // which function invoked this function - change scheme
        urlTokens[urlTokens.length - 1] = value;
    } else if (from === 2) {       // which function invoked this function - change color
        urlTokens[urlTokens.length - 2] = value;
    }

    const newURL = urlTokens.join('/');

    this.replaceLink(element, newURL);
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

onConfigButtonClick(event) {
    this.appMain.configActive = !this.appMain.configActive;
    this.appMain.configClick = true;
    event.preventDefault();
}

}
