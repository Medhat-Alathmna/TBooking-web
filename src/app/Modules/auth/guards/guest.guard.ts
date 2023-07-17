import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { AuthService } from '../auth.service';

@Injectable({
  providedIn: 'root'
})
export class GuestGuard implements CanActivate {

  constructor(private router: Router,private authService: AuthService) {
  }
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): boolean {
      console.log(localStorage.getItem('userAuth'));

      if (JSON.parse(localStorage.getItem('userAuth')) ) {        
        this.router.navigate(['/login']);
        return false;
      }
  
      return true;
    }
}
