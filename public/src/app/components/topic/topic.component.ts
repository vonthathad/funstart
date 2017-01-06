import { NgModule, Component, OnInit } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, FormGroup, FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-topic',
  templateUrl: './topic.component.html',
  styleUrls: ['./topic.component.scss']
})
export class TopicComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}


export const routes: Routes = [
  // { path: '', component: TopicComponent },
  // { path: 'home', component: TopicComponent }
]


@NgModule({
  declarations: [
    TopicComponent,
  ],
  exports: [
    TopicComponent,
  ],
  imports: [
    RouterModule,
    CommonModule,
    FormsModule,
  ],
  providers: [
  ]
})
export class TopicComponentModule { }