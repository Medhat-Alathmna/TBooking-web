import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, Router } from '@angular/router';
import { PermissionService } from 'src/app/core/permission.service';

@Injectable({
  providedIn: 'root',
})
export class PermissionGuard implements CanActivate {
  constructor(private permissionService: PermissionService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot): boolean {
    const requiredResource = route.data.resource;
    const requiredAction = route.data.action;

    if (!this.permissionService.hasPermission(requiredResource, requiredAction)) {
      this.router.navigate(['/notfound']); // Redirect if permission is missing
      return false;
    }

    return true;
  }
}