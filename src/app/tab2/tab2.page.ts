import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { IonicModule, ToastController } from '@ionic/angular';
import { LoginService } from '../services/login.service';
import { MembershipService } from '../services/membership.service';
import { get } from '../services/storage.service';
import { toastMessage } from '../services/util/util.service';
import { CommonModule } from '@angular/common';
import { ExploreContainerComponent } from '../explore-container/explore-container.component';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  standalone: true,
  imports: [IonicModule, CommonModule, TranslateModule, ExploreContainerComponent],
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page implements OnInit {

  members: any = [];
  profile: any = {};
  loginState: boolean = false;
  allParams: any;
  member: any = {};

  page_number = 1;
  page_limit = 10;
  offset = 0;
  loaderDistroyer: boolean = false;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private membershipService: MembershipService,
    private loginService: LoginService,
    private toastController: ToastController
  ) {
    this.loginService.authenticationState.subscribe(state => {
      if (state) {
        this.loginState = state;
        get('profile').then((value) => {
          this.profile = value;
        });
      }
    })
    this.getMembers(false, "");
  }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      if (this.router.getCurrentNavigation()?.extras.state) {
        this.allParams = this.router.getCurrentNavigation()?.extras.state;
        this.member = this.allParams.membership.member;
        this.members.unshift(this.member);
        this.getDateFormatted(this.member);
      }
    })
  }

  membership() {
    if (this.loginState) {
      this.router.navigateByUrl('/membership');
    } else {
      toastMessage('Please login to fill membership form.', this.toastController);
    }
  }

  getMembers(isFirstLoad: any, event: any) {
    this.membershipService.getPremiumMembers(this.offset, this.page_limit).then((result: any) => {
      this.loaderDistroyer = true;
      if (result.length > 0) {
        for (let i = 0; i < result.length; i++) {
          this.members.push(result[i]);
        }
        this.members.forEach((element: any) => {
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
    this.getMembers(true, event);
  }

  memberDetail(member: any) {
    let navigationExtra: NavigationExtras = { state: { membership: { member: member } } }
    this.router.navigateByUrl('member-detail', navigationExtra);
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
}
