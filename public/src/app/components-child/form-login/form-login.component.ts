import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { User } from '../../classes/user';
import { Error } from '../../classes/error';
@Component({
  selector: 'app-form-login',
  templateUrl: './form-login.component.html',
  styleUrls: ['./form-login.component.scss']
})
export class FormLoginComponent implements OnInit {
  private user: User;
  private error: Error;
  private location: string;
  constructor(private service: UserService) {
    
   }

  ngOnInit() {
    this.location = window.location.href;
    console.log("Location: " + this.location);
    this.user = new User();
    this.error = new Error();
  }
  loginFacebook() {
    window.location.href = `http://localhost:8235/oauth/facebook?redirect=${this.location}`;
  }
  loginTwitter() {
    window.location.href = `http://localhost:8235/oauth/twitter?redirect=${this.location}`;
  }
  loginLocal(){
    this.user.username = "sirdat1993@gmail.com";
    this.user.password = "123456";
    this.service
      .login(this.user)
       .subscribe(data => this.succeed(data["user"]), error => this.fail(error), () => console.log("Complete"));
    // this.service.loggedUserSource.next(this.user);
  }
   succeed(user: User) {
    alert("Add user successful");
    // update user
    this.service.loggedUserSource.next(user);
  }
  fail(e) {
    // this.error.email = (JSON.parse(e._body)).message;
    console.error("Error " + e);
  }
}
