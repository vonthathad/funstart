import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { User } from '../../classes/user';
import { Error } from '../../classes/error';

import { FormGroup, Validators, FormControl } from '@angular/forms';

@Component({
  selector: 'app-form-login',
  templateUrl: './form-login.component.html',
  styleUrls: ['./form-login.component.scss']
})
export class FormLoginComponent implements OnInit {
  private error: Error;
  private location: string;
  private loginForm: FormGroup;
  constructor(private userService: UserService) {

  }

  ngOnInit() {
    this.location = window.location.href;
    console.log("Location: " + this.location);
    this.error = new Error();

    this.loginForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$')]),
      password: new FormControl('', [Validators.required, Validators.minLength(5)])
    });
  }
  loginFacebook() {
    // window.location.href = `/oauth/facebook?redirect=${this.location}`;
    window.location.href = `http://localhost:8235/oauth/facebook?redirect=${this.location}`;
  }
  loginTwitter() {
    window.location.href = `/oauth/twitter?redirect=${this.location}`;
  }
  loginLocal({ value, valid }: { value: User, valid: boolean }) {
    console.log("VELI " + JSON.stringify(value) + valid);
    if (valid) {
      let user: any = new Object();
      user.username = value.email;
      user.password = value.password;
      this.userService
        .login(user)
        .subscribe(data => this.succeed(data["user"]), error => this.fail(error), () => console.log("Complete"));
    }
  }
  succeed(user: User) {
    alert("Login successful");
    localStorage.setItem("token", user.token);
    this.userService.loggedUserSource.next(user);
    this.userService.closeUserDialog();
    // location.reload();
  }
  fail(e) {
    // this.error.email = (JSON.parse(e._body)).message;
    console.error("Error " + e);
  }
}
