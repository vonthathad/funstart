import { Injectable } from '@angular/core';
import {Http, Headers} from '@angular/http';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';


import 'rxjs/Rx';
import 'rxjs/add/operator/map';
// Decorator to tell Angular that this class can be injected as a service to another class
@Injectable()
export class AuthService {
  accessToken: string;
  user: Observable<any>;
  userChange: Subject<any>;
  constructor(private http: Http) {
    this.user = new Subject<any>();
    var date = new Date(localStorage.getItem("expires"));
    if(date.getMilliseconds() < Date.now()){
      this.accessToken = localStorage.getItem("access_token");
      if(this.accessToken){
        this.user = this.get('http://localhost:18179/api/Account/UserInfo')
        .map(response => response.json());
        this.user.subscribe(user =>{
          console.log(user);
        });
      };
    };
   }
  
  createAuthorizationHeader(headers: Headers) {
    if(this.accessToken){
      headers.append('Authorization', 'Bearer ' + this.accessToken);
      };
    };
  get(url) {
    let headers = new Headers();
    this.createAuthorizationHeader(headers);
    return this.http.get(url, {
      headers: headers
    });
  }
  signOut(){
    localStorage.removeItem('expires');
    localStorage.removeItem('access_token');
    this.post('http://localhost:18179/api/Account/Logout',null);
    location.href = '/';
  }
  post(url, data) {
    let headers = new Headers();
    headers.append('Content-Type','application/json');
    this.createAuthorizationHeader(headers);
    return this.http.post(url, data, {
      headers: headers
    });
  }

}
