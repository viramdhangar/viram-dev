import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PostService {

  API = environment.host;

  constructor(
    private http: HttpClient
  ) { }

  post(formdata: any, userId: any){
    return new Promise((resolve, reject) => {
      this.http.post(this.API + '/post/'+userId, formdata)
        .subscribe(data => {
          resolve(data);
        }, err => {
          reject(err);
        });
    });
  }

  getPosts(offset: any, limit: any){
    return new Promise((resolve, reject) => {
      this.http.get(this.API + '/post/'+offset+"/"+limit)
        .subscribe(data => {
          resolve(data);
        }, err => {
          reject(err);
        });
    });
  }

  like(formdata: any){
    return new Promise((resolve, reject) => {
      this.http.post(this.API + '/like', formdata)
        .subscribe(data => {
          resolve(data);
        }, err => {
          reject(err);
        });
    });
  }

  comment(formdata: any){
    return new Promise((resolve, reject) => {
      this.http.post(this.API + '/comment', formdata)
        .subscribe(data => {
          resolve(data);
        }, err => {
          reject(err);
        });
    });
  }

  birthdayWish(formdata: any){
    return new Promise((resolve, reject) => {
      this.http.post(this.API + '/birthdayWish', formdata)
        .subscribe(data => {
          resolve(data);
        }, err => {
          reject(err);
        });
    });
  }

  
  likeCount(postId: any){
    return new Promise((resolve, reject) => {
      this.http.get(this.API + '/like/'+postId)
        .subscribe(data => {
          resolve(data);
        }, err => {
          reject(err);
        });
    });
  }

  getComment(postId: any){
    return new Promise((resolve, reject) => {
      this.http.get(this.API + '/comment/'+postId)
        .subscribe(data => {
          resolve(data);
        }, err => {
          reject(err);
        });
    });
  }

  getBirthdayWishes(birthId: any){
    return new Promise((resolve, reject) => {
      this.http.get(this.API + '/birthdayWishes/'+birthId)
        .subscribe(data => {
          resolve(data);
        }, err => {
          reject(err);
        });
    });
  }

  deleteLike(likeId: any){
    return new Promise((resolve, reject) => {
      this.http.delete(this.API + '/delete/like/'+likeId)
        .subscribe(data => {
          resolve(data);
        }, err => {
          reject(err);
        });
    });
  }

  deletePost(postId: any, profileId: any){
    return new Promise((resolve, reject) => {
      this.http.delete(this.API + '/deletePost/'+postId+'/'+profileId)
        .subscribe(data => {
          resolve(data);
        }, err => {
          reject(err);
        });
    });
  }

  deleteLComment(commentId: any){
    return new Promise((resolve, reject) => {
      this.http.delete(this.API + '/delete/comment/'+commentId)
        .subscribe(data => {
          resolve(data);
        }, err => {
          reject(err);
        });
    });
  }

  deleteBirthdayWish(commentId: any){
    return new Promise((resolve, reject) => {
      this.http.delete(this.API + '/delete/birthdayWish/'+commentId)
        .subscribe(data => {
          resolve(data);
        }, err => {
          reject(err);
        });
    });
  }
}
