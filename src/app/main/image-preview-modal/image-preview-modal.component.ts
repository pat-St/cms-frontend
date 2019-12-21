import { LoadContentService } from './../../service/load-content/load-content.service';
import { Image } from 'src/app/model/image';
import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

export interface PreviewImage {
  image: Image;
}

@Component({
  selector: 'app-image-preview-modal',
  template: `
  <h1 mat-dialog-title>Picture Preview</h1>
  <div mat-dialog-content>
    <img [src]="getImage()">
  </div>
  <div mat-dialog-actions>
    <button mat-button (click)="onNoClick()" cdkFocusInitial>Close</button>
  </div>
  `,
  styles: [
    `img {
      width: 100%;
    }`,
    `.mat-dialog-content {
      max-height: 79vh;
    }`
  ]
})
export class ImagePreviewModalComponent {

  constructor(
    public dialogRef: MatDialogRef<ImagePreviewModalComponent>,
    private loadBackend: LoadContentService,
    @Inject(MAT_DIALOG_DATA) public data: PreviewImage) {}

  onNoClick(): void {
    this.dialogRef.close();
  }
  getImage() {
    return this.loadBackend.showImage(this.data.image.ID);
  }

}

