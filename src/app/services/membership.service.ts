import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component, Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MembershipService {

  API = environment.host;

  constructor(
    private http: HttpClient
  ) { }

  getToken(initiatePayment: any) {
    return new Promise((resolve, reject) => {
      this.http.post(this.API+'/initiate-payment',initiatePayment)
      .subscribe(data => {
        resolve(data);
      }, err => {
        reject(err);
      });
    })
  }

  saveResponse(userId: any, response: any) {
    return new Promise((resolve, reject) => {
      this.http.post(this.API+'/payment-response/'+userId, response)
      .subscribe(data => {
        resolve(data);
      }, err => {
        reject(err);
      });
    })
  }
  
  saveCandidatePost(formData: any){
    return new Promise((resolve, reject) => {
      this.http.post(this.API+'/membership/memberOnPost', formData)
      .subscribe(data => {
        resolve(data);
      }, err => {
        reject(err);
      });
    })
  }

  deleteMemberOnPost(appointedId: any){
    return new Promise((resolve, reject) => {
      this.http.delete(this.API+'/membership/memberOnPost/'+appointedId)
      .subscribe(data => {
        resolve(data);
      }, err => {
        reject(err);
      });
    })
  }

  saveMembership(userId: any, formdata: any) {
    return new Promise((resolve, reject) => {
      this.http.post(this.API+'/membership/'+userId, formdata)
        .subscribe(data => {
          resolve(data);
        }, err => {
          reject(err);
        });
    });
  }

  getPremiumMembers(offset: any, limit: any){
    return new Promise((resolve, reject) => {
      this.http.get(this.API+'/membership/'+offset+'/'+limit)
        .subscribe(data => {
          resolve(data);
        }, err => {
          reject(err);
        });
    });
  }

  getAllMembersOnPost(offset: any, limit: any){
    return new Promise((resolve, reject) => {
      this.http.get(this.API+'/membership/memberOnPost/'+offset+'/'+limit)
        .subscribe(data => {
          resolve(data);
        }, err => {
          reject(err);
        });
    });
  }

  getCandidatePosts(){
    return new Promise((resolve, reject) => {
      this.http.get(this.API+'/membership/candidatePost')
        .subscribe(data => {
          resolve(data);
        }, err => {
          reject(err);
        });
    });
  }
}
