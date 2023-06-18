import { AfterContentChecked, Component, ElementRef, NO_ERRORS_SCHEMA, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { SocialSharing } from '@awesome-cordova-plugins/social-sharing/ngx';
import { ActionSheetController, AlertController, IonRouterOutlet, IonicModule, LoadingController, ModalController, Platform, PopoverController, ToastController } from '@ionic/angular';
import { Share } from '@capacitor/share';
//import { GoogleAuth } from '@codetrix-studio/capacitor-google-auth';
import { isPlatform } from '@ionic/angular';
import { Camera, CameraResultType, CameraSource, Photo } from '@capacitor/camera';
import { Filesystem, Directory } from '@capacitor/filesystem';
//import { SwiperComponent } from 'swiper/angular';
//import { SwiperOptions } from 'swiper';
//import SwiperCore, { Navigation, Pagination, Scrollbar, A11y, EffectCoverflow } from 'swiper';
import { LoginService } from '../services/login.service';
import { PostService } from '../services/post.service';
import { get, set } from '../services/storage.service';
import { LikeCommentPage } from '../pages/popover/like-comment/like-comment.page';
import { ActivatedRoute, Router } from '@angular/router';
import { toastMessage } from '../services/util/util.service';

import { Post } from '../model/post';
// import { CapacitorGoogleMaps } from '@capacitor-community/capacitor-googlemaps-native';
//import { Geolocation } from '@capacitor/geolocation';
import { BirthdayWishesPage } from '../pages/popover/birthday-wishes/birthday-wishes.page';
import { CommonModule, Location } from '@angular/common';
import { App } from '@capacitor/app';
import { ExploreContainerComponent } from '../explore-container/explore-container.component';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

// install Swiper modules
//SwiperCore.use([EffectCoverflow]);

const IMAGE_DIR = 'stored-images';

interface LocalFile {
  name: string;
  path: string;
  data: string;
}

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, TranslateModule, ExploreContainerComponent],
  providers: [SocialSharing],
  schemas: [NO_ERRORS_SCHEMA],
  encapsulation: ViewEncapsulation.None
})
export class Tab1Page implements OnInit, AfterContentChecked {
  //@ViewChild('swiper') swiper: SwiperComponent;
  @ViewChild('map') mapView: ElementRef;

  /* config: SwiperOptions = {
     effect: 'coverflow',
     coverflowEffect: {
       rotate: 50,
       stretch: 0,
       depth: 100,
       modifier: 1,
       slideShadows: true
     },
     cardsEffect: {
       slideShadows: true
     },
     centeredSlides: true,
     grabCursor: true,
     slidesPerView: 1.4,
     autoplay: true,
     pagination: true,
     navigation: false
   }*/

  selectedLan: any;
  profile: any = {};
  userPost: any = {};
  user = null;
  loginState: boolean;
  likeCount: any = [];
  birthdays: any = [];
  commentCount: any;

  images: LocalFile[] = [];
  allParams: any;
  myPost: Post;

  page_number = 1;
  page_limit = 10;
  offset = 0;
  loaderDistroyer: any = false;
  role: any = 'ROLE_USER';
  header: any = 'Album'

  constructor(
    private socialSharing: SocialSharing,
    private translate: TranslateService,
    private actionSheetController: ActionSheetController,
    private toastController: ToastController,
    private platform: Platform,
    private router: Router,
    private loadingCtl: LoadingController,
    private loginService: LoginService,
    private postService: PostService,
    public popoverController: PopoverController,
    private modelController: ModalController,
    private route: ActivatedRoute,
    private alertController: AlertController,
    private _location: Location
  ) {
    this.platform.backButton.subscribeWithPriority(10, (processNextHandler) => {
      console.log('Back press handler!');
      if (this._location.isCurrentPathEqualTo('/tabs/tab1')) {

        // Show Exit Alert!
        console.log('Show Exit Alert!');
        App.exitApp();
        // processNextHandler();
      } else {

        // Navigate to back page
        console.log('Navigate to back page');
        this._location.back();

      }

    });
    this.loginService.authenticationState.subscribe(state => {
      if (state) {
        get('profile').then((value) => {
          this.profile = value;
          this.loginState = state;
          if (this.profile?.authorities) {
            this.profile.authorities.forEach((element: any) => {
              if (element.authority === 'ROLE_SUPER' || element.authority === 'ROLE_ADMIN') {
                this.role = element.authority;
                this.header = 'createdBy'
                alert(this.role);
              }
            });
          }
        });
      }
    })
    /**if (!isPlatform('capacitor')) {
      GoogleAuth.initialize();
    }*/

    get('selectedLan').then((value) => {
      this.selectedLan = value;
      if (this.selectedLan == null || this.selectedLan == 'undefined' || this.selectedLan == 'hi') {
        this.selectedLan = "hi";
        this.setInitialAppLanguage('hi');
      } else if (this.selectedLan == 'en') {
        this.setInitialAppLanguage('en');
      }
      this.updateProfile();
    });
  }

  // ionViewDidEnter() {
  //   this.createMap();
  // }

  // createMap() {
  //   const boundingRect = this.mapView.nativeElement.getBoundingClientRect() as DOMRect;

  //   CapacitorGoogleMaps.create({
  //     width: Math.round(boundingRect.width),
  //     height: Math.round(boundingRect.height),
  //     x: Math.round(boundingRect.x),
  //     y: Math.round(boundingRect.y),
  //     zoom: 5
  //   });

  //   CapacitorGoogleMaps.addListener('onMapReady', async () => {
  //     CapacitorGoogleMaps.setMapType({
  //       type: "normal" // hybrid, satellite, terrain
  //     });

  //     this.showCurrentPosition();
  //   });
  // }

  // async showCurrentPosition() {
  //   Geolocation.requestPermissions().then(async premission => {
  //     const coordinates = await Geolocation.getCurrentPosition();

  //     // Create our current location marker
  //     CapacitorGoogleMaps.addMarker({
  //       latitude: coordinates.coords.latitude,
  //       longitude: coordinates.coords.longitude,
  //       title: 'My castle of loneliness',
  //       snippet: 'Come and find me!'
  //     });

  //     // Focus the camera
  //     CapacitorGoogleMaps.setCamera({
  //       latitude: coordinates.coords.latitude,
  //       longitude: coordinates.coords.longitude,
  //       zoom: 12,
  //       bearing: 0
  //     });
  //   });
  // }

  // ionViewDidLeave() {
  //   CapacitorGoogleMaps.close();
  // }

  ngAfterContentChecked() {
    /*if (this.swiper) {
      this.swiper.updateSwiper({});
    }*/
  }

  ionViewDidEnter() {
    this.getPosts(false, "");
  }

  ngOnInit() {
    this.getBirthdays();
    //this.loadFiles();
    this.route.queryParams.subscribe(params => {
      if (this.router.getCurrentNavigation()?.extras.state) {
        this.allParams = this.router.getCurrentNavigation()?.extras.state;
        this.myPost = this.allParams.myPost.post;
        if (this.myPost.postDescription.length > 500) {
          this.myPost.lessContent = this.myPost.postDescription.substring(0, 500);
          this.myPost.less = 1;
        } else {
          this.myPost.more = 1
        }
        this.likeCounter(this.myPost.id, this.myPost);
        this.commentCounter(this.myPost.id, this.myPost);
        this.getDateFormatted(this.myPost);
        this.allPost.unshift(this.myPost);
      }
    })
  }

  getBirthdays() {
    this.loginService.getBirthdays().then(result => {
      if (result) {
        this.birthdays = result;
        this.birthdays.forEach((element: any) => {
          this.getBirthdayWishes(element, element.id);
        });
      }
    })
  }

  getBirthdayWishes(birth: any, birthId: any) {
    this.postService.getBirthdayWishes(birthId).then(res => {
      birth.comments = res;
      birth.comment = birth.comments.length;

      birth.comments.forEach((element: any) => {
        this.getDateFormatted(element);
        if (element.user.id == this.profile.id) {
          birth.isComment = 'Y';
        }
      });
    })
  }

  updateProfile() {
    if (this.loginState == true) {
      if (this.profile.phone == null || this.profile.phone == '') {
        if (this.selectedLan == 'hi') {
          this.alertUpdateProfile('कृपया अपना मोबाइल नंबर जोड़ें।');
        } else {
          this.alertUpdateProfile('Please add your mobile number.');
        }
      }
    }
  }

  async loadFiles() {
    this.images = [];
    const loading = await this.loadingCtl.create({
      message: 'Loading data...',
    });
    await loading.present();

    Filesystem.readdir({
      directory: Directory.Data,
      path: IMAGE_DIR
    }).then(result => {
      console.log("HERE: ", result);
      //this.loadFileData(result.files);
    }, async err => {
      console.log('err: ', err);
      await Filesystem.mkdir({
        directory: Directory.Data,
        path: IMAGE_DIR
      });
    }).then(_ => {
      loading.dismiss();
    })
  }

  /**async signIn() {
    this.user = await GoogleAuth.signIn();
    console.log('user: ', this.user);
    alert(JSON.stringify(this.user));
    // can do initialize
  }

  async refresh() {
    const authCode = await GoogleAuth.refresh();
    console.log('refresh: ', authCode);
  }

  async signOut() {
    await GoogleAuth.signOut();
    this.user = null;
  }*/


  async refer() {
    alert("hello");
    const actionSheet = await this.actionSheetController.create({
      header: 'Share with',
      buttons: [{
        text: 'Share',
        icon: 'share',
        handler: () => {
          console.log('Share clicked');
          this.socialSharing.share("Play with Crickey11, signup using my referral code  to get Rs. 50 bonus to play. Download App from this link", "", "", "http://www.crickey11.com");
        }
      }]
    })
  }

  async share() {
    await Share.share({
      title: 'Download Gayrai app',
      text: 'Its really owesome app',
      //url: 'http://ionicframework.com/',
      dialogTitle: 'Share with buddies',
    });
  }

  async loadFileData(fileNames: string[]) {
    for (let f of fileNames) {
      const filePath = `${IMAGE_DIR}/${f}`;
      const readFile = await Filesystem.readFile({
        directory: Directory.Data,
        path: filePath
      });
      this.images.push({
        name: f,
        path: filePath,
        data: `data:image/jpeg;base64,${readFile.data}`
      });
      console.log('READ: ', readFile);
    }
  }

  async selectImage() {
    const image = await Camera.getPhoto({
      quality: 90,
      allowEditing: false,
      resultType: CameraResultType.Uri,
      source: CameraSource.Photos
      //source: CameraSource.Camera // for device
    });
    console.log(image);
    if (image) {
      this.saveImage(image);
    }
  }

  async saveImage(photo: Photo) {

    const base64Data = await this.readAsBase64(photo);
    console.log("dsadsa " + base64Data);

    const fileName = new Date().getTime() + '.jpeg';

    const fileData = await Filesystem.writeFile({
      directory: Directory.Data,
      path: `${IMAGE_DIR}/${fileName}`,
      data: base64Data
    });
    console.log('savedfile:', fileData);
    this.loadFiles();

  }

  async readAsBase64(photo: Photo) {
    if (this.platform.is('hybrid')) {
      const file = await Filesystem.readFile({
        path: photo.path!,
      });
      return file.data;
    } else {
      const response = await fetch(photo.webPath!);
      const blob = await response.blob();
      return await this.convertBlobToBase64(blob) as string;
    }
  }

  convertBlobToBase64 = (blob: Blob) => new Promise((resolve, reject) => {
    const reader = new FileReader;
    reader.onerror = reject;
    reader.onload = () => {
      resolve(reader.result);
    }
    reader.readAsDataURL(blob);
  })

  async startUpload(file: LocalFile) {
    const response = await fetch(file.data);
    const blob = await response.blob();
    const formData = new FormData();
    formData.append('file', blob, file.name);
    this.uploadData(formData);
  }
  async uploadData(formData: FormData) {
    const loading = await this.loadingCtl.create({
      message: 'Loading image...',
    });
    await loading.present();
    // our own api to save
  }

  async deleteImage(file: LocalFile) {
    await Filesystem.deleteFile({
      directory: Directory.Data,
      path: file.path
    });
    this.loadFiles();
  }

  allPost: any = [];
  getPosts(isFirstLoad: any, event: any) {
    this.postService.getPosts(this.offset, this.page_limit).then((result: any) => {
      this.loaderDistroyer = true;
      if (result.length > 0) {
        for (let i = 0; i < result.length; i++) {
          this.allPost.push(result[i]);
        }
        this.allPost.forEach((element: any) => {
          if (element.postDescription.length > 200) {
            element.lessContent = element.postDescription.substring(0, 200);
            element.less = 1;
          } else {
            element.more = 1
          }
          this.likeCounter(element.id, element);
          this.commentCounter(element.id, element);
          this.getDateFormatted(element);
        });
        if (isFirstLoad) {
          event.target.complete();
        }

        this.offset = this.page_limit * this.page_number
        this.page_number++;
      } else {
        event.target.complete();
      }
    })
  }

  doInfinite(event: any) {
    this.getPosts(true, event);
  }

  readMore(element: any) {
    element.less = 0;
    element.more = 1;
  }

  readLess(element: any) {
    element.less = 1;
    element.more = 0;
  }

  createPost() {
    if (this.loginState == true) {
      this.router.navigateByUrl('/post');
    } else {
      toastMessage('Please login to create your Post !', this.toastController);
      return;
    }
  }
  disableButton: any = false;
  async like(post: any) {
    this.userPost = {};
    this.disableButton = true;
    if (this.loginState == true) {
      this.userPost.postId = post.id;
      this.userPost.userId = this.profile.id;
      try {
        this.allPost.forEach((element: Post) => {
          if (element.id == post.id) {
            element.like += 1;
            element.isLike = 'Y';
          }
        });
        this.postService.like(this.userPost).then(response => {
          this.allPost.forEach((element: Post) => {
            if (element.id == post.id) {
              this.userPost.id = response;
              this.userPost.created = new Date();
              this.userPost.post = post;
              this.userPost.user = this.profile;
              element.likes.push(this.userPost);
              this.disableButton = false;
            }
          });
        })
      } catch (err) {
        toastMessage('Please try after some time', this.toastController);
      }
    } else {
      toastMessage('Please login to like the Post !', this.toastController);
      return;
    }
  }

  deleteLike(post: any) {
    post.likes.forEach((element: any) => {
      if (element.user.id == this.profile.id) {
        post.like -= 1;
        post.isLike = 'N';
        const index: number = post.likes.indexOf(element);
        if (index !== -1) {
          post.likes.splice(index, 1);
        }
        this.postService.deleteLike(element.id).then(response => {

        })
      }
    });
  }

  likeCounter(postId: any, elements: any) {
    this.postService.likeCount(postId).then(res => {
      this.likeCount = res;
      this.likeCount.forEach((element: any) => {
        if (element.user.id == this.profile.id) {
          elements.isLike = 'Y';
        }
      });
      elements.like = this.likeCount.length;
      elements.likes = this.likeCount;
    })
  }

  commentCounter(postId: any, elements: any) {
    this.postService.getComment(postId).then(res => {
      this.commentCount = res;
      elements.comment = this.commentCount.length;
      elements.comments = this.commentCount;

      this.commentCount.forEach((element: any) => {
        this.getDateFormatted(element);
        if (element.user.id == this.profile.id) {
          elements.isComment = 'Y';
        }
      });
    })
  }

  comment(post: any) {
    if (this.loginState == true) {
      this.presentPopover(post);
    } else {
      toastMessage('Please login to see the comments !', this.toastController);
      return;
    }
  }

  async birthdayWish(birth: any) {
    const popover = await this.modelController.create({
      component: BirthdayWishesPage,
      cssClass: 'my-custom-class',
      //event: ev,
      // translucent: true,
      componentProps: { birth: birth, profile: this.profile }
    });
    await popover.present();

    const { role } = await popover.onDidDismiss();
    console.log('onDidDismiss resolved with role', role);
  }

  async presentPopover(post: any) {
    const popover = await this.modelController.create({
      component: LikeCommentPage,
      cssClass: 'my-custom-class',
      //event: ev,
      // translucent: true,
      componentProps: { post: post, profile: this.profile }
    });
    await popover.present();

    const { role } = await popover.onDidDismiss();
    console.log('onDidDismiss resolved with role', role);
  }

  getDateFormatted(element: any) {
    const monthNames = ["Jan", "Feb", "Mar", "April", "May", "June",
      "July", "Aug", "Sep", "Oct", "Nov", "Dec"
    ];
    var days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    var today = new Date(element.created);
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    var mmm = String(monthNames[today.getMonth()]);
    var ddd = String(days[today.getDay()]);
    var yyyy = today.getFullYear();
    if (today.getHours() > 12) {
      element.showDate = mmm + ' ' + dd + ', ' + yyyy + ' ' + today.getHours() % 12 + ':' + today.getMinutes() + ' PM';//mm + '/' + dd + '/' + yyyy;
    } else {
      element.showDate = mmm + ' ' + dd + ', ' + yyyy + ' ' + today.getHours() % 12 + ':' + today.getMinutes() + ' AM';//mm + '/' + dd + '/' + yyyy;
    }
  }

  getYear(date: any) {
    var today = new Date(date);
    return today.getFullYear();
  }

  getCurrentYear() {
    var today = new Date();
    return today.getFullYear();
  }

  setInitialAppLanguage(lan: any) {
    let language = this.translate.getBrowserLang();
    // this.translate.setDefaultLang(language);
    this.translate.use(lan);
  }

  changeLanguadge(lan: any) {
    this.setInitialAppLanguage(lan);
    this.selectedLan = lan;
    set('selectedLan', this.selectedLan);
  }

  async alertUpdateProfile(msg: any) {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      //header: 'Alert',
      message: msg,
      buttons: [
        {
          text: 'OK',
          handler: () => {
            this.router.navigate(['/register'], { replaceUrl: true });
          }
        }
      ]
    });
    await alert.present();
  }

  deletePost(postId: any, profileId: any) {
    this.postService.deletePost(postId, profileId).then(result => {
      if (result) {
        toastMessage('Post deleted successfully', this.toastController);
      }
    })
  }

  async presentActionSheet(post: any, pos: any, header: any) {
    if (header === 'createdBy') {
      header = 'Created By: ' + post.user.firstName + ' ' + post.user.lastName;
    }
    const actionSheet = await this.actionSheetController.create({
      header: header,
      cssClass: 'action-class',
      buttons: [{
        text: 'Delete',
        role: 'destructive',
        icon: 'trash',
        id: 'delete-button',
        data: {
          type: 'delete'
        },
        handler: () => {
          this.inactivatePost(post, pos);
        }
      }, {
        text: 'Cancel',
        icon: 'close',
        role: 'cancel',
        handler: () => {
          console.log('Cancel clicked');
        }
      }]
    });
    await actionSheet.present();

    const { role, data } = await actionSheet.onDidDismiss();
    console.log('onDidDismiss resolved with role and data', role, data);
  }
  inactivatePost(post: any, pos: any) {
    this.allPost.splice(pos, 1);
    this.deletePost(post.id, this.profile.id);
  }

  wish() {
    alert('Happy birthday');
  }

  showExitConfirm() {
    this.alertController.create({
      header: 'App termination',
      message: 'Do you want to close the app?',
      backdropDismiss: false,
      buttons: [{
        text: 'Stay',
        role: 'cancel',
        handler: () => {
          console.log('Application exit prevented!');
        }
      }, {
        text: 'Exit',
        handler: () => {
          // navigator['app'].exitApp();
        }
      }]
    })
      .then(alert => {
        alert.present();
      });
  }
}
