import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router, ActivatedRoute } from '@angular/router';
import * as moment from 'moment';
import { BehaviorSubject, Observable } from 'rxjs';
import { AuthService } from '../auth.service';


@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  private activatedRoute: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(null);
  public activatedRouteEmitter: Observable<boolean> = this.activatedRoute.asObservable();

  constructor(private route: ActivatedRoute, private router: Router, private authService: AuthService) {

  }
  authData = this.authService.getAuthData()
  token_expires = new Date(this.authData?.token_expires)
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): boolean {
      console.log(this.authData);
      
    if (this.authData?.user && this.authData?.token_data) {
      let currentDate = new Date()

      if (Date.parse(currentDate.toString()) < Date.parse(this.token_expires.toString())) {
        let expires = moment(currentDate).add(120, 'minutes').toString()
        this.authData.token_expires = expires
        localStorage.setItem('authData', JSON.stringify(this.authData))
        this.activatedRoute.next(true)
        return true;
      } else {
        this.authService.clearAuthData()
      }
    }
    this.router.navigate(['/login'], {});
    return false;
  }
}
