import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';

import { AppMainComponent } from './Layout/Main/app.main.component';
import { AppNotfoundComponent } from './Layout/NotFound/app.notfound.component';
import { AuthModule } from './Modules/auth/auth.module';
import { AuthGuard } from './Modules/auth/guards/auth.guard';
import { GuestGuard } from './Modules/auth/guards/guest.guard';






@NgModule({
    imports: [
        RouterModule.forRoot([
            {
                path: '', component: AppMainComponent,
                canActivate: [AuthGuard],
                children: [
                    // { path: '', loadChildren: () => HomeModule },


                        
                ]
            },
            { path: 'notfound', component: AppNotfoundComponent },
            {
                path: 'login', loadChildren: () => AuthModule, canActivate: [GuestGuard],
            },
            { path: '**', redirectTo: '/notfound' },
            { path: '**', redirectTo: '' },
        ], { scrollPositionRestoration: 'enabled', anchorScrolling: 'enabled' })
    ],
    exports: [RouterModule]
})
export class AppRoutingModule {
}
