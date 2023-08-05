import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';

import { AppMainComponent } from './Layout/Main/app.main.component';
import { AppNotfoundComponent } from './Layout/NotFound/app.notfound.component';
import { AuthModule } from './Modules/auth/auth.module';
import { AuthGuard } from './Modules/auth/guards/auth.guard';
import { HomeModule } from './Modules/home/home.module';
import { MobileModule } from './Modules/mobile/mobile.module';
import { CalenderModule } from './Modules/calender/calender.module';
import { GuestGuard } from './Modules/auth/guards/guest.guard';
import { UsersModule } from './Modules/users/users.module';
import { OrdersModule } from './Modules/orders/orders.module';
import { SettingsModule } from './Modules/settings/settings.module';






@NgModule({
    imports: [
        RouterModule.forRoot([
            {
                path: '', component: AppMainComponent,
                canActivate: [AuthGuard],
                children: [
                    { path: '', loadChildren: () => HomeModule },
                    { path: 'mobile', loadChildren: () => MobileModule },
                    { path: 'calender', loadChildren: () => CalenderModule },
                    { path: 'users', loadChildren: () => UsersModule },
                    { path: 'orders', loadChildren: () => OrdersModule },
                    { path: 'settings', loadChildren: () => SettingsModule },


                        
                ]
            },
            { path: 'notfound', component: AppNotfoundComponent },
            {
                path: 'login', loadChildren: () => AuthModule,
                canActivate: [GuestGuard]
            },
            { path: '**', redirectTo: 'calender' },
        ], { scrollPositionRestoration: 'enabled', anchorScrolling: 'enabled' })
    ],
    exports: [RouterModule]
})
export class AppRoutingModule {
}
