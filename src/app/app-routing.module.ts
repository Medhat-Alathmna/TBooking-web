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






@NgModule({
    imports: [
        RouterModule.forRoot([
            {
                path: '', component: AppMainComponent,
                // canActivate: [AuthGuard],
                children: [
                    { path: '', loadChildren: () => HomeModule },
                    { path: 'mobile', loadChildren: () => MobileModule },
                    { path: 'calender', loadChildren: () => CalenderModule },


                        
                ]
            },
            { path: 'notfound', component: AppNotfoundComponent },
            {
                path: 'login', loadChildren: () => AuthModule,
            },
            { path: '**', redirectTo: '/notfound' },
            { path: '**', redirectTo: '' },
        ], { scrollPositionRestoration: 'enabled', anchorScrolling: 'enabled' })
    ],
    exports: [RouterModule]
})
export class AppRoutingModule {
}
