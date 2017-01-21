import { Component, OnInit } from '@angular/core';
import {MdDialogRef} from'@angular/material';

@Component({
  selector: 'app-account-dialog',
  templateUrl: './account-dialog.component.html',
  styleUrls: ['./account-dialog.component.scss']
})
export class AccountDialogComponent implements OnInit {

  constructor(public dialogRef: MdDialogRef<AccountDialogComponent>) { }

  ngOnInit() {
  }

}
