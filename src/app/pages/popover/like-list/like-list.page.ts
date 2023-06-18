import { CommonModule } from '@angular/common';
import { Component, Input, NO_ERRORS_SCHEMA, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-like-list',
  templateUrl: './like-list.page.html',
  styleUrls: ['./like-list.page.scss'],
  schemas: [NO_ERRORS_SCHEMA],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, TranslateModule, ReactiveFormsModule]
})
export class LikeListPage implements OnInit {

  @Input() likes: any;

  constructor() { }

  ngOnInit() {  
    this.likes.forEach((element: any) => {
      this.getDateFormatted(element);
    });
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
}
