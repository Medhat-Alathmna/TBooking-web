import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { AuthService } from '../auth.service';

@Injectable({
  providedIn: 'root'
})
export class GuestGuard implements CanActivate {

  constructor(private router: Router,private authService: AuthService) {
  }
authData=this.authService.getAuthData()
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): boolean {

    if (this.authData?.user && this.authData?.token_data) {
      this.router.navigate(['/login']);
      return false;
    }

    return true;
  }
}
