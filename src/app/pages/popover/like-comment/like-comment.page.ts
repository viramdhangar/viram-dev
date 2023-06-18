import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-like-comment',
  templateUrl: './like-comment.page.html',
  styleUrls: ['./like-comment.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class LikeCommentPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
