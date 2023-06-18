import { HttpClient } from '@angular/common/http';
import { Component, NO_ERRORS_SCHEMA, OnInit } from '@angular/core';
//import { FacebookLogin, FacebookLoginPlugin } from '@capacitor-community/facebook-login';
import { IonicModule, isPlatform, LoadingController, ToastController } from '@ionic/angular';
import { LoginService } from '../services/login.service';
import { BehaviorSubject } from 'rxjs';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { get, set } from '../services/storage.service';
import { toastMessage } from '../services/util/util.service';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, ReactiveFormsModule, TranslateModule],
  schemas: [NO_ERRORS_SCHEMA],
})
export class LoginPage implements OnInit {

  authenticationState = new BehaviorSubject(false);
  user: any = {};
  //fbLogin: FacebookLoginPlugin;
  loginForm: FormGroup;
  signupForm: FormGroup;
  token = null;
  loginResponse: any = {};
  selectedLan: any;
  profile: any = {};

  constructor(
    private http: HttpClient,
    private router: Router,
    private translate: TranslateService,
    private loginService: LoginService,
    private formBuilder: FormBuilder,
    private toastController: ToastController,
    private loadingController: LoadingController
  ) {
    this.loginService.authenticationState.subscribe(state => {
      if (state) {
          this.router.navigateByUrl('/tabs/tab1');
      }
    })
    //this.setupFbLogin();
    this.loginForm = this.formBuilder.group({
      username: new FormControl(''),
      password: new FormControl(''),
      loginMethod: new FormControl('')
    })
    get('selectedLan').then((value) => {
      this.selectedLan = value;
      if (this.selectedLan == null || this.selectedLan == 'undefined' || this.selectedLan == 'hi') {
        this.selectedLan = "hi";
        this.setInitialAppLanguage('hi');
      } else if (this.selectedLan == 'en') {
        this.setInitialAppLanguage('en');
      }
    });
  }

  ngOnInit() {
    
  }

  async login() {
    if (this.validateLoginForm()) { return; }
    this.loginForm.value.loginMethod = 'normal';
    const loading = await this.loadingController.create({
      spinner: null,
      message: '<ion-img src="../assets/loader/spinner.gif"></ion-img>',
      cssClass: 'custom-loading'
    });
    await loading.present();
    this.loginService.user(this.loginForm.value.username).then(result => {
      if (result) {
        this.loginService.authenticate(this.loginForm.value, loading).then(response => {
          alert("logged in: "+response);
          this.loginResponse = response;
          if (this.loginResponse) {
            set('profile', result);
            set('auth-token', 'Bearer ' + this.loginResponse.token);
            this.router.navigateByUrl('/login');
            this.loginService.authenticationState.next(true);
            loading.dismiss();
          } else {
            toastMessage('Login details are not correct.', this.toastController);
            loading.dismiss();
          }
        })
      } else {
        loading.dismiss();
        toastMessage('User is not registered!\n please register', this.toastController);
      }
    })
  }

  validateLoginForm() {
    var errMsg: String = '';
    if (this.loginForm.value.username == '') {
      errMsg = errMsg.concat('<ul>');
      if (this.selectedLan == 'hi') {
        errMsg = errMsg.concat('<li>यूज़र नेम दर्ज करें</li>');
      } else {
        errMsg = errMsg.concat('<li>Please enter Username.</li>');
      }
    }
    if (this.loginForm.value.password == '') {
      if (errMsg !== '') {
        errMsg = errMsg.concat('\n');
      }
      if (this.selectedLan == 'hi') {
        errMsg = errMsg.concat('<li>पासवर्ड दर्ज करें</li>');
      } else {
        errMsg = errMsg.concat('<li>Please enter Password.</li>');
      }
    }
    if (errMsg !== '') {
      errMsg = errMsg.concat('</ul>');
      this.errorMsg(errMsg);
      return true;
    }
    return false;
  }

  async errorMsg(errorMessage: any) {
    const toast = await this.toastController.create({
      message: errorMessage,
      position: 'middle',
      duration: 2000
    });
    return await toast.present();
  }

  /**async setupFbLogin() {
    if (isPlatform('desktop')) {
      this.fbLogin = FacebookLogin;
    } else {
      this.fbLogin = FacebookLogin;
    }
  }

  async getCurrentToken() {
    const result = await this.fbLogin.getCurrentAccessToken();
    if (result.accessToken) {
      this.token = result.accessToken;
      this.loadUserData();
    } else {
      // Not logged in.
    }
  }

  async loadUserData() {
    const url = `https://graph.facebook.com/${this.token.userId}?fields=id,name,picture.width(720),email&access_token=${this.token.token}`;
    this.http.get(url).subscribe(res => {
      this.user = res;
    });
  }

  async logout() {
    await this.fbLogin.logout();
    this.user = null;
    this.token = null;
  }

  async fbLogins() {
    const loading = await this.loadingController.create({
      message: "Logging .. "
    });
    await loading.present();
    const FACEBOOK_PERMISSIONS = ['email', 'public_profile'];
    try{
      const result = await this.fbLogin.login({ permissions: FACEBOOK_PERMISSIONS });
      //this.fbLogin.getProfile
      if (result.accessToken && result.accessToken.userId) {
        // Login successful.
        this.token = result.accessToken;
        const url = `https://graph.facebook.com/${this.token.userId}?fields=id,name,picture.width(720),email&access_token=${this.token.token}`;
        this.http.get(url).subscribe((res: any) => {
          this.signupForm = this.formBuilder.group({
            id: new FormControl(null),
            decodedBase64: new FormControl(null),
            firstName: new FormControl(res.name),
            username: new FormControl(res.email),
            lastName: new FormControl(''),
            phone: new FormControl(''),
            email: new FormControl(res.email),
            password: new FormControl(''),
            confirmPassword: new FormControl(''),
            loginMethod: new FormControl('facebook')
          })
          if (this.signupForm.value.email) {
            // call backend
            this.loginService.user(this.signupForm.value.email).then(result => {
              if (result) {
                // login
                this.loginService.authenticate(this.signupForm.value, loading).then(response => {
                  loading.dismiss();
                  this.loginResponse = response;
                  if (this.loginResponse) {
                    this.loginService.user(this.signupForm.value.username).then(result => {
                      set('profile', result);
                      set('auth-token', 'Bearer ' + this.loginResponse.token);
                      this.loginService.authenticationState.next(true);
                      this.router.navigateByUrl('/login');
                    });
                  }
                })
              } else {
                // register
                this.loginService.register(this.signupForm.value).then(response => {
                  this.loginService.authenticate(this.signupForm.value, loading).then(response => {
                    loading.dismiss();
                    this.loginResponse = response;
                    if (this.loginResponse) {
                      this.loginService.user(this.signupForm.value.username).then(result => {
                        set('profile', result);
                        set('auth-token', 'Bearer ' + this.loginResponse.token);
                        this.loginService.authenticationState.next(true);
                        this.router.navigateByUrl('/login');
                      })
                    }
                  })
                })
              }
            })
          }
        });
      } else if (result.accessToken && !result.accessToken.userId) {
        loading.dismiss();
      }
    } catch(err){
      loading.dismiss();
      toastMessage('Some issue with facebook login.', this.toastController);
    }
  }*/

  passwordType: string = 'password';
  passwordIcon: string = 'eye-off';

  hideShowPassword() {
    this.passwordType = this.passwordType === 'text' ? 'password' : 'text';
    this.passwordIcon = this.passwordIcon === 'eye-off' ? 'eye' : 'eye-off';
  }

  setInitialAppLanguage(lan: any) {
    let language = this.translate.getBrowserLang();
    this.translate.setDefaultLang(language+'');
    this.translate.use(lan);
  }

  changeLanguadge(lan: any) {
    this.setInitialAppLanguage(lan);
    this.selectedLan = lan;
    set('selectedLan', this.selectedLan);
  }

}
