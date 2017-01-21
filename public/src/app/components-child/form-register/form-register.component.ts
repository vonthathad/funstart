import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { User } from '../../classes/user';
import { Error } from '../../classes/error';

@Component({
  selector: 'app-form-register',
  templateUrl: './form-register.component.html',
  styleUrls: ['./form-register.component.scss']
})
export class FormRegisterComponent implements OnInit {
  private user: User;
  private error: Error;

  constructor(private service: UserService) {
    this.user = new User();
    this.error = new Error();
  }

  ngOnInit() {
  }
  register() {
    this.user.email = "sirdat1993@gmail.com";
    this.user.username = "thanhdatvo";
    this.user.password = "123456";
    console.log(JSON.stringify(this.user));
    this.service
      .register(this.user)
      .subscribe(data => this.succeed(data["user"]), error => this.fail(error), () => console.log("Complete"));
  }
  succeed(user: User) {
    alert("Add user successful");
    // update user
    this.service.loggedUserSource.next(user);
  }
  fail(e) {
    this.error.email = (JSON.parse(e._body)).message;
    console.error("Error " + e);
  }
}
