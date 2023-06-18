import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-birthday-wishes',
  templateUrl: './birthday-wishes.page.html',
  styleUrls: ['./birthday-wishes.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class BirthdayWishesPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
