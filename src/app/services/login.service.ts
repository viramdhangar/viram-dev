import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Platform, ToastController } from '@ionic/angular';
import { get } from './storage.service';
import { toastMessage } from './util/util.service';

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
export class LoginService {

  public API = environment.host;
  authenticationState = new BehaviorSubject(false);

  constructor(
    private http: HttpClient,
    private platform: Platform,
    private toastController: ToastController
  ) { 
    this.platform.ready().then(() => {
      this.checkToken();
    })
  }

  user(username: any) {
    return new Promise((resolve, reject) => {
      this.http.get(this.API+'/userByUsername/'+username)
        .subscribe(data => {
          resolve(data);
        }, err => {
          reject(err);
        });
    });
  }

  searchUser(searchparam: any) {
    return new Promise((resolve, reject) => {
      this.http.get(this.API+'/searchUser/'+searchparam)
        .subscribe(data => {
          resolve(data);
        }, err => {
          reject(err);
        });
    });
  }

  getAppVersion() {
    return new Promise((resolve, reject) => {
      this.http.get(this.API+'/appVersion')
        .subscribe(data => {
          resolve(data);
        }, err => {
          reject(err);
        });
    });
  }

  getBirthdays() {
    return new Promise((resolve, reject) => {
      this.http.get(this.API+'/birthdays')
        .subscribe(data => {
          resolve(data);
        }, err => {
          reject(err);
        });
    });
  }


  appVersion(appVersion: any) {
    return new Promise((resolve, reject) => {
      this.http.post(this.API+'/appVersion', appVersion)
        .subscribe(data => {
          resolve(data);
        }, err => {
          reject(err);
        });
    });
  }

  saveRoles(roles: any) {
    return new Promise((resolve, reject) => {
      this.http.post(this.API+'/addRemoveRole', roles)
        .subscribe(data => {
          resolve(data);
        }, err => {
          reject(err);
        });
    });
  }

  authenticate(formdata: any, loading: any) {
    return new Promise((resolve, reject) => {
      this.http.post(this.API+'/authenticate', formdata)
        .subscribe(data => {
          resolve(data);
        }, err => {
          if(err.status == '401'){
            loading.dismiss();
            toastMessage('Login details are not correct.', this.toastController);
          }
          reject(err);
        });
    });
  }

    // register user
    register(formdata: any) {
      return new Promise((resolve, reject) => {
        this.http.post(this.API+'/user', formdata)
          .subscribe(data => {
            resolve(data);
          }, err => {
            reject(err);
          });
      });
    }
  
    saveAddress(userId: any, formdata: any) {
      return new Promise((resolve, reject) => {
        this.http.post(this.API+'/address/'+userId, formdata)
          .subscribe(data => {
            resolve(data);
          }, err => {
            reject(err);
          });
      });
    }

    sendOTP(formdata: any) {
      return new Promise((resolve, reject) => {
        this.http.post(this.API+'/sendEmailOTP/'+formdata.email, httpOptions)
          .subscribe(data => {
            resolve(data);
          }, err => {
            reject(err);
          });
      });
    }

    verifyOTP(formdata: any) {
      return new Promise((resolve, reject) => {
        this.http.post(this.API+'/verifyEmailOTP/'+formdata.email+'/'+formdata.otp, httpOptions)
          .subscribe(data => {
            resolve(data);
          }, err => {
            reject(err);
          });
      });
    }

    resetPassword(formdata: any) {
      return new Promise((resolve, reject) => {
        this.http.post(this.API+'/resetPassword', formdata)
          .subscribe(data => {
            resolve(data);
          }, err => {
            reject(err);
          });
      });
    }

    changePassword(formdata: any) {
      return new Promise((resolve, reject) => {
        this.http.post(this.API+'/changePassword', formdata)
          .subscribe(data => {
            resolve(data);
          }, err => {
            reject(err);
          });
      });
    }
  

  isAuthenticated(){
    return this.authenticationState.value;
  }
  authToken: any;
  async checkToken(){
    this.authToken = await get('auth-token');
    if(this.authToken){
      this.authenticationState.next(true);
    }
  }
}
