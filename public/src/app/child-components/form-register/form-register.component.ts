import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
@Component({
  selector: 'app-form-register',
  templateUrl: './form-register.component.html',
  styleUrls: ['./form-register.component.scss']
})
export class FormRegisterComponent implements OnInit {
data: any;
  constructor(private service: UserService) {
     this.data = {};
    this.data.email = "";
    this.data.username = "";
    this.data.password = "";
   }

  ngOnInit() {
  }
   signUp() {
    console.log(JSON.stringify(this.data));
    this.data.email = "sirdat193@gmail.com";
    this.data.username = "dat12345";
    this.data.password = "123456";
    this.service.signUp(this.data);
  }
}
