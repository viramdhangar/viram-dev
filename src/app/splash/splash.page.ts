import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IonicModule, ToastController } from '@ionic/angular';
import { LoginService } from '../services/login.service';
import { get, remove } from '../services/storage.service';
import { toastMessage } from '../services/util/util.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-splash',
  templateUrl: './splash.page.html',
  styleUrls: ['./splash.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class SplashPage implements OnInit {

  showWelcome: boolean = false;
  profile : any = {};

  constructor(
    private router: Router,
    private loginService: LoginService,
    private toastController: ToastController
  ) {

  }

  ngOnInit() {

    // this.loginService.authenticationState.subscribe(state => {
    //   if (state) {
    //     get('profile').then((value) => {
    //       this.profile = value;
    //       try {
    //         this.loginService.user(this.profile.email).then(result => {
    //           if (result) {
    //             this.router.navigate(['/tabs/tab1']);
    //           } else {
    //             this.logout();
    //             this.router.navigate(['/splash']);
    //           }
    //         })
    //       } catch (error) {
    //         toastMessage('Please check your internet connection or update application from play store <a href="https://play.google.com/store/apps/details?id=com.viram.dev">Click here</a>.', this.toastController);
    //         this.logout();
    //         this.router.navigate(['/login']);
    //       }
    //     });
    //   } else {
    //     this.router.navigate(['/splash']);
    //   }
    // })

    this.loginService.authenticationState.subscribe(state => {
      if (state) {
        get('profile').then((value) => {
          this.profile = value;
          try {
            this.loginService.user(this.profile.email).then(result => {
              if (result) {
                setTimeout(() => {
                  this.showWelcome = true;
                  this.callToDashboard();
                }, 3000);
              } else {
                this.logout();
                this.router.navigate(['/login']);
              }
            })
          } catch (error) {
            toastMessage('Please check your internet connection or update application from play store <a href="https://play.google.com/store/apps/details?id=com.viram.dev">Click here</a>.', this.toastController);
            this.logout();
            this.router.navigate(['/login']);
          }
        });
      } else {
         setTimeout(() => {
          this.showWelcome = true;
          this.callToLogin();
         }, 3000);
      }
    });
  }

  callToLogin(){
    setTimeout(() => {
      this.router.navigateByUrl('/login');
    }, 2000);
  }

  callToDashboard(){
    setTimeout(() => {
      this.router.navigate(['/tabs/tab1']);
    }, 2000);
  }

  async logout() {
    //    await this.fbLogin.logout();
    remove('profile');
    remove('auth-token');
    this.loginService.authenticationState.next(false);
  }
}
