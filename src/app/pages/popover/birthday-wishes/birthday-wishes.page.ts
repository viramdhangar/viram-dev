import { CommonModule } from '@angular/common';
import { Component, Input, NO_ERRORS_SCHEMA, OnInit, ViewChild } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonContent, IonicModule, LoadingController, ModalController, PopoverController, ToastController } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { LoginService } from 'src/app/services/login.service';
import { PostService } from 'src/app/services/post.service';
import { get } from 'src/app/services/storage.service';
import { toastMessage } from 'src/app/services/util/util.service';

@Component({
  selector: 'app-birthday-wishes',
  templateUrl: './birthday-wishes.page.html',
  styleUrls: ['./birthday-wishes.page.scss'],
  schemas: [NO_ERRORS_SCHEMA],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, TranslateModule, ReactiveFormsModule]
})
export class BirthdayWishesPage implements OnInit {

  @ViewChild(IonContent) content: IonContent;
  @Input() profile: any;
  @Input() birth: any;
  userPost: any = {};
  myComment: any = '';
  selectedLan: any;
  disableButton: any = false;

  constructor(
    private postService: PostService,
    private toastController: ToastController,
    private modalController: ModalController,
    private popOverController: PopoverController,
    private loadingController: LoadingController,
    private loginService: LoginService
  ) { 
    this.myComment = '';
    this.loginService.authenticationState.subscribe(state => {
      if (state) {
        get('profile').then((value) => {
          this.profile = value;
        });
      }
    })
  }
  ngOnInit() {
    get('selectedLan').then((value) => {
      this.selectedLan = value;
    });
    //this.getBirthdayWishes(this.birth.id);
  }

  async birthdayWish(){
    this.disableButton = true;
    this.userPost = {};
    this.userPost.birthId = this.birth.id;
    this.userPost.userId = this.profile.id;
    if(this.myComment == ''){
      if(this.selectedLan == 'hi'){
        toastMessage("कृपया कमेंट लिखें।", this.toastController);
      } else {
        toastMessage("Please write comment.", this.toastController);
      }
      return;
    }
    this.userPost.comment = this.myComment;
    const loading = await this.loadingController.create({
    });
    await loading.present();
    try{
      this.postService.birthdayWish(this.userPost).then(response=>{
        loading.dismiss();
        this.birth.comment +=1;
        this.birth.isComment='Y';
        this.userPost.id = response;
        this.userPost.created = new Date();
        this.userPost.birth = this.birth;
        this.userPost.user = this.profile;
        this.birth.comments.unshift(this.userPost);
        this.birth.comments.forEach((element: any) => {
          this.getDateFormatted(element);
        });
        this.myComment = '';
        this.disableButton = false;
        setTimeout(()=>{
          this.content.scrollToTop(200);
        });
      })
    } catch (err) {
      loading.dismiss();
      toastMessage(JSON.stringify(err), this.toastController);
    }
  }

  deleteBirthdayWish(comment: any){
    this.postService.deleteBirthdayWish(comment.id).then(response=>{
      this.birth.comment -=1;
      this.birth.isComment='N';
      const index: number = this.birth.comments.indexOf(comment);
      if (index !== -1) {
        this.birth.comments.splice(index, 1);
      }
    })
  }

  validateComment() {
    var errMsg: string = '';
    if (this.myComment === '') {
      errMsg = errMsg.concat('<ul>');
      errMsg = errMsg.concat('<li>Please write some comment</li>');
    }
    if (errMsg !== '') {
      errMsg = errMsg.concat('</ul>');
      toastMessage(errMsg, this.toastController);
      return true;
    }
    return false;
  }

  getDateFormatted(element: any){
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
    if(today.getHours() > 12){
      element.showDate = mmm + ' ' + dd +', '+ yyyy + ' ' + today.getHours() % 12 + ':' + today.getMinutes() +' PM';//mm + '/' + dd + '/' + yyyy;
    }else{
      element.showDate = mmm + ' ' + dd +', '+ yyyy + ' ' + today.getHours() % 12 + ':' + today.getMinutes() +' AM';//mm + '/' + dd + '/' + yyyy;
    }
  }

  closeModal(){
    this.modalController.dismiss();
  }

  doRefresh(event: any) {
    this.getBirthdayWishes(this.birth.id);
    event.target.complete();
  }

  getBirthdayWishes(birthId: any){
    this.postService.getBirthdayWishes(birthId).then(res => {
      this.birth.comments = res;
      this.birth.comment = this.birth.comments.length;

      this.birth.comments.forEach((element: any) => {
        this.getDateFormatted(element);
        if (element.user.id == this.profile.id) {
          this.birth.isComment = 'Y';
        }
      });
    })
  }
}
