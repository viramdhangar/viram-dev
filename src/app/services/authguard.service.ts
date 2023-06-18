import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { LoginService } from './login.service';

@Injectable({
  providedIn: 'root'
})
export class AuthguardService implements CanActivate{

  constructor(private authService: LoginService) { }

  canActivate() : boolean{
    return this.authService.isAuthenticated();
  }
}
