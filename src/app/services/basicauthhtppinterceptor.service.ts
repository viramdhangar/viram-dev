import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpHeaders } from '@angular/common/http';
import { Preferences } from '@capacitor/preferences';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
    'Access-Control-Allow-Methods': 'GET, PUT, POST',
    'Access-Control-Allow-Origin': '*'
  }
  )
};

@Injectable({
  providedIn: 'root'
})
export class BasicauthhtppinterceptorService implements HttpInterceptor{

  tokenValue: any;

  constructor() {}

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    /*if(this.getItem('auth-token')){
      this.tokenValue = this.getItem('auth-token');
    }*/
    this.tokenValue = this.getItem('auth-token');
    if (this.tokenValue) {
      req = req.clone({
        setHeaders: {
          Authorization: this.tokenValue
         //Authorization: sessionStorage.getItem('auth-token')
        }
      })
    }
    return next.handle(req);
  }

  async setItem(key: any, value: any) {
    await Preferences.set({
      key: key,
      value: JSON.stringify(value),
    });
  }

  async getItem(key: any){
    await Preferences.get({ key: key });
  }

  async removeItem(key: any){
    await Preferences.remove({ key: key });
  }
}
