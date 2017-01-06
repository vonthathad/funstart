import { NgModule, Component, OnInit } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, FormGroup, FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}

export const routes: Routes = [
  // { path: '', component: UserComponent },
  // { path: 'home', component: UserComponent }
]


@NgModule({
  declarations: [
    UserComponent,
  ],
  exports: [
    UserComponent,
  ],
  imports: [
    RouterModule,
    CommonModule,
    FormsModule,
  ],
  providers: [
  ]
})
export class UserComponentModule { }