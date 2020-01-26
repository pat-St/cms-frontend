import { BackendRequestService } from '../../service/backend-request/backend-request.service';
import { Image } from 'src/app/model/image';
import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { NewEntryObject } from 'src/app/model/infoText';

export interface ListModify {
    header: string;
    listOfEntrys: Map<string, Array<ModalTableEntry>>;
}

export interface ModalTableEntry {
  name: string;
  status: string;
}


@Component({
  selector: 'app-refresh-modal',
  template: `
  <h1 mat-dialog-title>{{header}}</h1>
  <div mat-dialog-content>
    <ng-template ngFor let-content [ngForOf]="listOfEntrys | keyvalue" matExpansionPanelContent>
      <mat-accordion multi="false">
        <mat-expansion-panel>
          <mat-expansion-panel-header>
            <mat-panel-title>{{content.key}}</mat-panel-title>
            <mat-panel-description>
              Es wurden {{content.value.length}} Änderungen erkannt
            </mat-panel-description>
          </mat-expansion-panel-header>
          <table mat-table [dataSource]="content.value" class="class.mat-elevation-z4" *ngIf="content.value && content.value.length > 0">
            <ng-container matColumnDef="name">
              <th mat-header-cell *matHeaderCellDef> Name </th>
              <td mat-cell *matCellDef="let element"> {{element.name}} </td>
            </ng-container>
            <ng-container matColumnDef="status">
              <th mat-header-cell *matHeaderCellDef> Zustand </th>
              <td mat-cell *matCellDef="let element"> {{element.status}} </td>
            </ng-container>
            <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
            <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
          </table>
        </mat-expansion-panel>
      </mat-accordion>
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
        max-height: 100%;
        padding: 0;
        overflow: auto;
    }`,
    `mat-form-field {
        margin-right: 12px;
    }`,
    `table {
      min-width: 40vw;
      width: 100%;
    }`,
    `.mat-expansion-panel-body {
      padding: 0;
    }`,
  ]
})
export class ModifyModalComponent {
    displayedColumns: string[] = ['name', 'status'];
    listOfEntrys: Map<string, Array<ModalTableEntry>>;
    header: string;

  constructor(
    public dialogRef: MatDialogRef<ModifyModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ListModify) {
        this.header = data.header;
        this.listOfEntrys = data.listOfEntrys;
    }
}

