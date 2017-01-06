import { NgModule, Component, OnInit } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, FormGroup, FormBuilder } from '@angular/forms';
import { MaterialModule } from '@angular/material';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
export const routes: Routes = [
  // { path: '', component: HomeComponent },
  // { path: 'home', component: HomeComponent }
]


@NgModule({
  declarations: [
    HomeComponent
  ],
  exports: [
    HomeComponent
  ],
  imports: [
    RouterModule,
    CommonModule,
    FormsModule,
    MaterialModule
  ],
  providers: [
  ]
})
export class HomeComponentModule { }