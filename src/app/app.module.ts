import { APP_INITIALIZER, NgModule  } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CommonModule, DatePipe, HashLocationStrategy, LocationStrategy, PathLocationStrategy } from '@angular/common';
import { AppRoutingModule } from './app-routing.module';




import { AppFooterComponent } from './Layout/Footer/app.footer.component';
import { AppMenuComponent } from './Layout/Menu/app.menu.component';
import { AppTopBarComponent } from './Layout/TopBar/app.topbar.component';
import { AppRightpanelComponent } from './Layout/RightPanel/app.rightpanel.component';
import { AppMainComponent } from './Layout/Main/app.main.component';
import { MenuService } from './Layout/Menu/app.menu.service';
import { AppConfigComponent } from './Layout/ThemeConfig/app.config.component';
import { ConfirmationService, MessageService } from 'primeng/api';
import { PrimengComponentsModule } from './primeng-components.module';

// import ngx-translate and the http loader
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { HttpClient } from '@angular/common/http';
import { ConfigService } from './Layout/ThemeConfig/service/app.config.service';
import { AppMenuitemComponent } from './Layout/Menu/app.menuitem.component';
import { HttpsInterceptor } from './core/https/HttpsInterceptor';
import { ConfigEnvironmentService } from './core/config.service';
import { AppComponent } from './app.component';
import { NgxQRCodeModule } from '@techiediaries/ngx-qrcode';




@NgModule({
    imports: [
        BrowserModule,
        FormsModule,
        CommonModule,
        BrowserAnimationsModule,
        AppRoutingModule,
        HttpClientModule,
        PrimengComponentsModule,
        NgxQRCodeModule,
        HttpClientModule,
        TranslateModule.forRoot({
            loader: {
                provide: TranslateLoader,
                useFactory: HttpLoaderFactory,
                deps: [HttpClient]
            }
        }),
    ],
    declarations: [
        AppComponent,
        AppMainComponent,
        AppRightpanelComponent,
        AppMenuComponent,
        AppMenuitemComponent,
        AppConfigComponent,
        AppTopBarComponent,
        AppFooterComponent,
    ],
    providers: [
       
        { provide: LocationStrategy, useClass: PathLocationStrategy }
        , MenuService, ConfigService, DatePipe, MessageService, ConfirmationService,
        ConfigEnvironmentService,
    ],
    bootstrap: [AppComponent]
})
export class AppModule {
}
export function HttpLoaderFactory(http: HttpClient): TranslateHttpLoader {
    return new TranslateHttpLoader(http);
}
// BreadcrumbService