import { BackendRequestService } from './../../service/backend-request/backend-request.service';
import { Image } from 'src/app/model/image';
import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { NewEntryObject } from 'src/app/model/infoText';

export interface ActionContent {
    header: string;
    listOfEntrys: Array<string>;
}

@Component({
  selector: 'app-refresh-modal',
  template: `
  <h1 mat-dialog-title>{{header}}</h1>
  <div mat-dialog-content>
    <ng-template ngFor let-i [ngForOf]="listOfEntrys">
        <p>{{i}}</p>
    </ng-template>
  </div>
  <div mat-dialog-actions>
    <button mat-flat-button [mat-dialog-close]="false" color="warn" cdkFocusInitial>Nein</button>
    <button mat-stroked-button [mat-dialog-close]="true"  color="primary" cdkFocusInitial>Ja</button>
  </div>
  `,
  styles: [
    `img {
        width: 100%;
    }`,
    `.mat-dialog-content {
        max-height: 79vh;
    }`,
    `mat-form-field {
        margin-right: 12px;
    }`
  ]
})
export class RefreshModalComponent {
    listOfEntrys: Array<string>;
    header: string;

  constructor(
    public dialogRef: MatDialogRef<RefreshModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ActionContent) {
        this.header = data.header;
        this.listOfEntrys = data.listOfEntrys;
    }
}

