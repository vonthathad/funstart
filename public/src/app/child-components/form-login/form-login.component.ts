import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-form-login',
  templateUrl: './form-login.component.html',
  styleUrls: ['./form-login.component.scss']
})
export class FormLoginComponent implements OnInit {
  private location: string;
  constructor() { }

  ngOnInit() {
    this.location = window.location.href;
    console.log("Location: " + this.location);
  }
  loginFacebook() {
    window.location.href = `http://localhost:8235/oauth/facebook?redirect=${this.location}`;
  }
  loginTwitter() {
    window.location.href = `http://localhost:8235/oauth/twitter?redirect=${this.location}`;
  }
}
