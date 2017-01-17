import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { UserService } from '../../services/user.service'

import { User } from '../../classes/user';
@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit {
  constructor(private route: ActivatedRoute, private userService: UserService) {
     route.params.subscribe(params => {
      let username = params['username'];
      // this.userService.getUser(username).subscribe((res: any) => this.renderUser(res.data))
    });
   }
  renderUser(user: User){
    console.log(user);
  }
  ngOnInit() {
  }

}
