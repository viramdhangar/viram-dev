import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, IonicModule, Platform, ToastController } from '@ionic/angular';
import { FcmService } from './services/fcm.service';
import { LoginService } from './services/login.service';
import { StatusBar } from '@awesome-cordova-plugins/status-bar/ngx';
import { SplashScreen } from '@awesome-cordova-plugins/splash-screen/ngx';
import { AppVersion } from '@awesome-cordova-plugins/app-version/ngx';
import { Browser } from '@capacitor/browser';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule],
  providers: [StatusBar, SplashScreen, AppVersion]
})
export class AppComponent {
  profile: any = {};
  appVersions: any = [];
  appVersion: any = {};
  versionNumberApp: any;;

  constructor(
    private platform: Platform,
    private loginService: LoginService,
    private router: Router,
    private fcmService: FcmService,
    private toastController: ToastController,
    private statusBar: StatusBar,
    private splashScreen: SplashScreen,
    private aV : AppVersion,
    private alertController: AlertController
  ) {
    // CapacitorGoogleMaps.initialize({
    //   key: environment.mapsKey
    // });
    this.platform.ready().then(() => {
      // Trigger the push setup 
      this.getAppVersionNumber();
      this.statusBar.styleLightContent();
      this.statusBar.overlaysWebView(false);
      this.statusBar.backgroundColorByHexString('#6161fd'); //347a9c
      this.splashScreen.hide();
      // fix me this.fcmService.initPush();
    })
  }

  getAppVersionNumber(){
    this.aV.getVersionNumber().then((res)=>{
      this.versionNumberApp = res;
      this.getAppVesion(this.versionNumberApp);
    });
  }

  major: boolean = false;
  minor: boolean = false;
  patch: boolean = false;
  getAppVesion(existingVersion: any){
    this.loginService.getAppVersion().then(result=>{
      if(result){
        this.appVersions = result;
        this.appVersions.forEach((element: any) => {
          this.appVersion = element;
          var newVirsions = this.appVersion.version.split('.', 3);
          var existingVirsions = existingVersion.split('.', 3);
          if(newVirsions[0] !== existingVirsions[0]){
            this.major = true;
          }
          if(newVirsions[1] !== existingVirsions[1]){
            this.minor = true;
          }
          if(newVirsions[2] !== existingVirsions[2]){
            this.patch = true;
          }
          if(this.major){
            this.majorUpdateAlert('Very important update, Please update app from play store', existingVersion, this.appVersion.version);
          } else if (this.minor){
            this.minorOrPatchUpdateNewFeatures('New Features have been added, Please update app from play store', existingVersion, this.appVersion.version);
          } else if (this.patch){
            this.minorOrPatchUpdateNewFeatures('New update available, Please update app from play store', existingVersion, this.appVersion.version);
          }
        });
      }
    });
  }

  async majorUpdateAlert(msg: any, existingVersion: any, newVersion: any) {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      //header: 'Alert',
      message: msg+' from '+existingVersion+ ' to ' +newVersion,
      backdropDismiss: false,
      buttons: [
        {
          text: 'Update',
          handler: () => {
            // open google play store
            Browser.open({url:'https://play.google.com/store/apps/details?id=com.viram.dev'});
          }
        }
      ]
    });
    await alert.present();
  }

  async minorOrPatchUpdateNewFeatures(msg: any, existingVersion: any, newVersion: any) {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      message: msg+' from '+existingVersion+ ' to ' +newVersion,
      backdropDismiss: false,
      buttons: [
        {
          text: 'Later',
          handler: () => {
          }
        },
        {
          text: 'Update',
          handler: () => {
            // open google play store
            Browser.open({url:'https://play.google.com/store/apps/details?id=com.viram.dev'});
          }
        }
      ]
    });
    await alert.present();
  }
}
