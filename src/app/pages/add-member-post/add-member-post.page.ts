import { Component, NO_ERRORS_SCHEMA, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { IonicModule, ToastController } from '@ionic/angular';
import { LoginService } from 'src/app/services/login.service';
import { MembershipService } from 'src/app/services/membership.service';
import { get } from 'src/app/services/storage.service';
import { toastMessage } from 'src/app/services/util/util.service';
import { format, isThisMonth, parseISO } from 'date-fns';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-add-member-post',
  templateUrl: './add-member-post.page.html',
  styleUrls: ['./add-member-post.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, TranslateModule, ReactiveFormsModule],
  schemas: [NO_ERRORS_SCHEMA]
})
export class AddMemberPostPage implements OnInit {

  candidatePosts: any = [];
  allSearchedUser: any = [];

  dateValue = '';
  dateValue2 = '';

  public changeForm: FormGroup;
  selectedLan: any;
  profile: any = {};
  selectedUser: any ;
  selectedUserShow: any ;
  searchUsereQuery: any = [];
  searchStateItems: any;
  members: any = [];
  sortOrder: number = 0;
  allParams: any;

  constructor(
    private formBuilder: FormBuilder,
    private memberService: MembershipService,
    private loginService: LoginService,
    private router: Router,
    private route: ActivatedRoute,
    private toastController: ToastController
  ) {
   
   }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      if (this.router.getCurrentNavigation()?.extras.state) {
        this.allParams = this.router.getCurrentNavigation()?.extras.state;
        this.sortOrder = this.allParams.memberOnPost.sortOrder;
        this.changeForm = this.formBuilder.group({
          sortOrder: new FormControl(this.sortOrder),
          appointId: new FormControl(''),
          postDate: new FormControl(''),
          selectedUserId: new FormControl('')
        });
      }
    })
    get('profile').then((value) => {
      this.profile = value;
    });
    get('selectedLan').then((value) => {
      this.selectedLan = value;
    });
    this.getAllCandidatePost();
  }

  getAllCandidatePost(){
    this.memberService.getCandidatePosts().then(result=> {
      this.candidatePosts = result;
    });
  }

  searchUser(searchParam: any){
    if(searchParam.length >= 3){
      this.loginService.searchUser(searchParam).then(result=> {
        this.allSearchedUser = result;
      });
    }
  }

  saveMemberPost(){
    this.changeForm.value.createdBy = this.profile.id;
    if(this.validateMemberOnPost()){return;}
    this.changeForm.value.selectedUserId = this.otherUser;
    this.changeForm.value.postDate = new Date(this.changeForm.value.postDate);
    this.memberService.saveCandidatePost(this.changeForm.value).then(result=>{
      if(result){
        toastMessage('Candidate saved with post', this.toastController);
        let navigationExtra: NavigationExtras = { state: { memberOnPost: { member: result } } }
        this.router.navigateByUrl('/selected-members', navigationExtra);
      }
    });
  }

  validateMemberOnPost(){
    var errMsg : String = '';
    if(this.changeForm.value.appointId == ''){
      errMsg = errMsg.concat('<ul>');
      if(this.selectedLan == 'hi'){
        errMsg = errMsg.concat('<li>कृपया नियुक्त दर्ज करें</li>');
      } else {
        errMsg = errMsg.concat('<li>Please enter appointed role</li>');
      }
    } 
    if(this.otherUser == 0){
      if(this.selectedLan == 'hi'){
        errMsg = errMsg.concat('<li>कृपया सदस्य चुनें</li>');
      } else {
        errMsg = errMsg.concat('<li>Please select member</li>');
      }
    } 
    if(this.changeForm.value.postDate  == '' || this.changeForm.value.postDate  == null){
      if(this.selectedLan == 'hi'){
        errMsg = errMsg.concat('<li>कृपया नियुक्त तिथि का चयन करें</li>');
      } else {
        errMsg = errMsg.concat('<li>Please select appointed date</li>');
      }
    } 
    if (this.changeForm.value.sortOrder == ''){
      if(this.selectedLan == 'hi'){
        errMsg = errMsg.concat('<li>कृपया क्रमबद्ध क्रम दर्ज करें</li>');
      } else {
        errMsg = errMsg.concat('<li>Please enter sort order</li>');
      }
    }
    if(errMsg !== ''){
      errMsg = errMsg.concat('</ul>');
      this.errorMsg(errMsg);
      return true;
    }
    return false;
  }

  filterStateItems(ev: any) {
    // Reset items back to all of the items
    //this.initializeItems();
    // set val to the value of the searchbar
    let val = ev.target.value;
    // if the value is an empty string don't filter the items
    if(val.length == 0){
      this.allSearchedUser = [];
    }
    if (val && val.trim() != '') {
      this.searchUser(val);
      this.searchUsereQuery = [];
      this.allSearchedUser = this.allSearchedUser.filter((events: any) => {
        this.searchUsereQuery.push(events);
      })
    } else {
      this.searchUsereQuery = [];
    }
  }

  otherUser: any = 0;
  selectUser(user: any){
    this.otherUser = user.id;
    this.selectedUser = user.firstName+' '+user.lastName;
    this.allSearchedUser = [];
  }

  formatDate(value: string) {
    return format(parseISO(value), 'MMM dd yyyy');
  }

  async errorMsg(errorMessage: any) {
    const toast = await this.toastController.create({
      message: errorMessage,
      position: 'middle',
      duration: 2000
    });
    return await toast.present();
  }

}
