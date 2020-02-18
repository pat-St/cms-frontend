import { BackendRequestService } from '../../service/backend-request/backend-request.service';
import { Image } from 'src/app/model/image';
import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NewEntryObject } from 'src/app/model/infoText';

export interface NewEntryModal {
    metaInfo: string;
    listOfEntrys: Array<NewEntryObject>;
}

@Component({
  selector: 'app-image-preview-modal',
  template: `
  <h1 mat-dialog-title>Auswahl des referenzierten Objekts</h1>
  <div mat-dialog-content>
    <mat-form-field>
    <mat-label>{{data.metaInfo}}</mat-label>
    <mat-select [disabled]="isDisabled" [(value)]="choosenEntry">
        <mat-option *ngFor="let kachelType of data.listOfEntrys" [value]="kachelType.id">
        {{kachelType.desc}}
        </mat-option>
    </mat-select>
    </mat-form-field>
  </div>
  <div mat-dialog-actions>
    <button mat-flat-button (click)="onNoClick()" color="warn" cdkFocusInitial>Abbrechen</button>
    <button mat-stroked-button [disabled]="isDisabled" [mat-dialog-close]="choosenEntry" color="primary" cdkFocusInitial>OK</button>
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
export class NewEntryModalComponent {

choosenEntry: number = null;
isDisabled = false

  constructor(
    public dialogRef: MatDialogRef<NewEntryModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: NewEntryModal) {
      if (data.listOfEntrys.length < 1) {
        this.isDisabled = true
      } else {
        this.choosenEntry = data.listOfEntrys[0].id;
        this.isDisabled = false
      }
    }

    onNoClick(): void {
        this.dialogRef.close(null);
    }

}

