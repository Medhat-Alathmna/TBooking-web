import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';

import { AppMainComponent } from './Layout/Main/app.main.component';
import { AppNotfoundComponent } from './Layout/NotFound/app.notfound.component';
import { AuthModule } from './Modules/auth/auth.module';
import { AuthGuard } from './Modules/auth/guards/auth.guard';
import { HomeModule } from './Modules/home/home.module';
import { CalenderModule } from './Modules/calender/calender.module';
import { GuestGuard } from './Modules/auth/guards/guest.guard';
import { UsersModule } from './Modules/users/users.module';
import { OrdersModule } from './Modules/orders/orders.module';
import { SettingsModule } from './Modules/settings/settings.module';
import { DashboardModule } from './Modules/dashboard/dashboard.module';
import { ProductsModule } from './Modules/products/services.module';
import { MobileAppModule } from './Modules/mobile-app/mobile-app.module';
import { PermissionGuard } from './Modules/auth/guards/permission.guard';
import { PurchaseOrderModule } from './Modules/purchase-order/purchase-order.module';
import { VendorsModule } from './Modules/vendors/vendors.module';






@NgModule({
    imports: [
        RouterModule.forRoot([
            {
                path: '', component: AppMainComponent,
                canActivate: [AuthGuard],
                children: [
                    {
                        path: '',redirectTo: 'calender',pathMatch:'prefix'
                    },
                    {
                        path: 'products', loadChildren: () => ProductsModule,
                        canActivate: [PermissionGuard],
                        data: { resource: 'Products', action: 'view' }
                    },
                    {
                        path: 'mobile', loadChildren: () => MobileAppModule, canActivate: [PermissionGuard],
                        data: { resource: 'Gallary', action: 'view' }
                    },
                    {
                        path: 'calender', loadChildren: () => CalenderModule,
                    },
                    { path: 'users', loadChildren: () => UsersModule,canActivate: [PermissionGuard],
                        data: { resource: 'Users', action: 'view' } },
                    {
                        path: 'orders', loadChildren: () => OrdersModule, canActivate: [PermissionGuard],
                        data: { resource: 'Orders', action: 'view' }
                    },
                    {
                        path: 'settings', loadChildren: () => SettingsModule, canActivate: [PermissionGuard],
                        data: { resource: 'SiteSittengs', action: 'view' }
                    },
                    {
                        path: 'purchase-order', loadChildren: () => PurchaseOrderModule, canActivate: [PermissionGuard],
                        data: { resource: 'PurchaseOrders', action: 'view' }
                    },
                    {
                        path: 'vendors', loadChildren: () => VendorsModule, canActivate: [PermissionGuard],
                        data: { resource: 'Vendors', action: 'view' }
                    },
                    {
                        path: 'dashboard', loadChildren: () => DashboardModule, canActivate: [PermissionGuard],
                        data: { resource: 'Dashboard', action: 'view' }
                    },



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
