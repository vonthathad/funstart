import { Component, OnInit } from '@angular/core';
import { User } from '../../classes/user';
import { Error } from '../../classes/error';
@Component({
  selector: 'app-form-password-reset',
  templateUrl: './form-password-reset.component.html',
  styleUrls: ['./form-password-reset.component.scss']
})
export class FormPasswordResetComponent implements OnInit {
   private user: User;
  private error: Error;
  constructor() {
     this.user = new User();
    this.error = new Error();
  }

  ngOnInit() {

  }

}
