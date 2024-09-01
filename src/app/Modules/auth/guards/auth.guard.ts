import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router, ActivatedRoute } from '@angular/router';
import * as moment from 'moment';
import { BehaviorSubject, Observable } from 'rxjs';
import { AuthService } from '../auth.service';


@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {



  constructor(private route: ActivatedRoute, private router: Router, private authService: AuthService) {

  }
  authData = JSON.parse(localStorage.getItem('userAuth'))
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): boolean {

    if (this.authData) {
      return true;
    } else {
      console.log(this.authData);
      
      this.router.navigate(['/login'], {});
      return false;
    }

  }
}
