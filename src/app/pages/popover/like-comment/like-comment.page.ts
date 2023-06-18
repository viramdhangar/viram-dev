import { Component, Input, NO_ERRORS_SCHEMA, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { IonContent, IonicModule, LoadingController, ModalController, PopoverController, ToastController } from '@ionic/angular';
import { LoginService } from 'src/app/services/login.service';
import { PostService } from 'src/app/services/post.service';
import { get } from 'src/app/services/storage.service';
import { toastMessage } from 'src/app/services/util/util.service';
import { LikeListPage } from '../like-list/like-list.page';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-like-comment',
  templateUrl: './like-comment.page.html',
  styleUrls: ['./like-comment.page.scss'],
  schemas: [NO_ERRORS_SCHEMA],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, ReactiveFormsModule, TranslateModule]
})
export class LikeCommentPage implements OnInit {

  @ViewChild(IonContent) content: IonContent;
  @Input() profile: any;
  @Input() post: any;
  userPost: any = {};
  myComment: any = '';
  selectedLan: any;

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
  }

  disableButton: any = false;
  async like(){
    this.userPost = {};
    this.disableButton = true;
    this.userPost.postId = this.post.id;
    this.userPost.userId = this.profile.id;
    try{
      this.post.like +=1;
      this.post.isLike='Y';
      this.postService.like(this.userPost).then(response=>{
        this.userPost.id = response;
        this.userPost.created = new Date();
        this.userPost.post = this.post;
        this.userPost.user = this.profile;
        this.post.likes.push(this.userPost);
        this.disableButton = false;
      })
    } catch (err) {
      toastMessage(JSON.stringify(err), this.toastController);
    }
  }

  likes(){
    this.likesPopover(this.post.likes);
  }

  async likesPopover(likes: any) {
    const popover = await this.popOverController.create({
      component: LikeListPage,
      cssClass: 'my-custom-class',
      //event: ev,
      // translucent: true,
      componentProps: { likes: likes }
    });
    await popover.present();

    const { role } = await popover.onDidDismiss();
    console.log('onDidDismiss resolved with role', role);
  }

  deleteLike(){
    this.post.likes.forEach((element: any) => {
      if(element.user.id == this.profile.id){
        this.post.like -=1;
          this.post.isLike='N';
          const index: number = this.post.likes.indexOf(element);
          if (index !== -1) {
            this.post.likes.splice(index, 1);
          }
        this.postService.deleteLike(element.id).then(response=>{
          
        })
      }
    });
  }

  async comment(){
    this.disableButton = true;
    this.userPost = {};
    this.userPost.postId = this.post.id;
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
      this.postService.comment(this.userPost).then(response=>{
        loading.dismiss();
        this.post.comment +=1;
        this.post.isComment='Y';
        this.userPost.id = response;
        this.userPost.created = new Date();
        this.userPost.post = this.post;
        this.userPost.user = this.profile;
        this.post.comments.unshift(this.userPost);
        this.post.comments.forEach((element: any) => {
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

  deleteComment(comment: any){
    this.postService.deleteLComment(comment.id).then(response=>{
      this.post.comment -=1;
      this.post.isComment='N';
      const index: number = this.post.comments.indexOf(comment);
      if (index !== -1) {
        this.post.comments.splice(index, 1);
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
    this.allComments(this.post.id);
    this.allLikes(this.post.id);
    event.target.complete();
  }

  allComments(postId: any){
    this.postService.getComment(postId).then(res => {
      this.post.comments = res;
      this.post.comment = this.post.comments.length;

      this.post.comments.forEach((element: any) => {
        this.getDateFormatted(element);
        if (element.user.id == this.profile.id) {
          this.post.isComment = 'Y';
        }
      });
    })
  }

  allLikes(postId: any){
      this.postService.likeCount(postId).then(res => {
        this.post.likes = res;
      });
  }

}
