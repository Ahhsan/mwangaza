import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, Router, CanActivate } from '@angular/router';
import { LoginService } from '../services/login/login.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(
    private loginService: LoginService,
    private router: Router,
  ) { }
  canActivate(): boolean {
    if (this.loginService.loggedIn()) {
      return true;
    }
    else
    {
      this.router.navigate(['login']);
      return false;
    }
  }

}
