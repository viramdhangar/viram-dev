import { CommonModule } from '@angular/common';
import { Component, NO_ERRORS_SCHEMA, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NavigationExtras, Router } from '@angular/router';
import { Camera, CameraResultType, CameraSource, Photo } from '@capacitor/camera';
import { Filesystem } from '@capacitor/filesystem';
import { IonicModule, isPlatform, LoadingController, Platform, ToastController } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { PostService } from 'src/app/services/post.service';
import { get } from 'src/app/services/storage.service';
import { toastMessage } from 'src/app/services/util/util.service';

interface LocalFile {
  name: string;
  path: string;
  data: string;
}

@Component({
  selector: 'app-post',
  templateUrl: './post.page.html',
  styleUrls: ['./post.page.scss'],
  schemas: [NO_ERRORS_SCHEMA],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, TranslateModule, ReactiveFormsModule]
})
export class PostPage implements OnInit {

  image: any;
  allPhotos: any = [];
  myPost: any ={};
  profile: any = {};
  postDescription: any;
  selectedLan : any;

  constructor(
    private platform: Platform,
    private loadingController: LoadingController,
    private toastController: ToastController,
    private postService: PostService,
    private router: Router
  ) { 
    this.postDescription = '';
    get('selectedLan').then((value) => {
      this.selectedLan = value;
    });
  }

  ngOnInit() {
    get('profile').then((value) => {
      this.profile = value;
    });
  }

  disableButton: any = false;
  async post(){
    if (this.validatePost()) { return; }
      this.disableButton = true;
      this.allPhotos = [];
      this.myPost ={};
      this.myPost.postDescription = this.postDescription;
      this.myPost.decodedBase64 = this.image;
     // this.allPhotos.push(this.imageModel);
      const loading = await this.loadingController.create({
        message: 'Creating post .... ',
      });
      await loading.present();
      try{
        //toastMessage("Photo will be saved..parallaly", this.toastController);
      this.postService.post(this.myPost, this.profile.id).then((result)=>{
        loading.dismiss();
        this.disableButton = false;
        if(result){
            toastMessage("Post created successfully", this.toastController);
            let navigationExtra: NavigationExtras = { state: { post: { myPost: result } } }
            this.router.navigateByUrl('/tabs/tab1', navigationExtra);
        }else{
          alert("Some issue with photo upload");
        }
      })
    } catch (error){
      loading.dismiss();
      alert(JSON.stringify(error));
    }  
  }

  validatePost() {
    var errMsg: string = '';
    if (this.postDescription === '') {
      errMsg = errMsg.concat('<ul>');
      if(this.selectedLan == 'hi'){
        errMsg = errMsg.concat('<li>पोस्ट बनाने के लिए कृपया कुछ लिखें</li>');
      } else {
        errMsg = errMsg.concat('<li>Please write somthing to create post</li>');
      }
    }
    if (this.postDescription.length > 1000) {
      errMsg = errMsg.concat('<ul>');
      if(this.selectedLan == 'hi'){
        errMsg = errMsg.concat('<li>केवल 1000 वर्णों की अनुमति है, आप पोस्ट कर रहे हैं '+this.postDescription.length+'</li>');
      } else {
        errMsg = errMsg.concat('<li>Only 1000 characters are allowed, you are posting '+this.postDescription.length+'</li>');
      }
    }
    if (errMsg !== '') {
      errMsg = errMsg.concat('</ul>');
      toastMessage(errMsg, this.toastController);
      return true;
    }
    return false;
  }

  async selectImage() {
    const image = await Camera.getPhoto({
      quality: 90,
      allowEditing: false,
      resultType: CameraResultType.Uri,
      source: CameraSource.Photos
      //source: CameraSource.Camera // for device
    });
    if (image) {
      const base64Data = await this.readAsBase64(image);
      if(base64Data.match('image/png') || base64Data.match('image/jpeg')){
        var  base64str = base64Data.split(',');
         if (this.calculateImageSize(base64str[1]) > 1100) {
          toastMessage('Max size 1 MB is allowed, selected is '+(Math.round((this.kbytes + Number.EPSILON) * 100)/1000) / 100+' MB', this.toastController);
         } else {
          this.image = base64Data;
         }
      } else {
         if (this.calculateImageSize(base64Data) > 1100) {
          toastMessage('Max size 1 MB is allowed, selected is '+(Math.round((this.kbytes + Number.EPSILON) * 100)/1000) / 100+' MB', this.toastController);
         } else {
          this.image = 'data:image/jpeg;base64,'+base64Data;
         }
      }
    }
  }

  kbytes: any;
  calculateImageSize(base64String: any) {
    let padding;
    let inBytes;
    let base64StringLength;
    if (base64String.endsWith('==')) { padding = 2; }
    else if (base64String.endsWith('=')) { padding = 1; }
    else { padding = 0; }
    base64StringLength = base64String.length;
    inBytes = (base64StringLength / 4) * 3 - padding;
    this.kbytes = inBytes / 1024;
    return this.kbytes;
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

  charCount: number = 0;
  countChars(obj: any){
    this.charCount = this.postDescription.length;
}
}
