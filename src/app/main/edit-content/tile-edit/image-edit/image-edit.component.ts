import { UpdateContentService } from 'src/app/service/update-content/update-content.service';
import { ImagePreviewModalComponent } from '../../../image-preview-modal/image-preview-modal.component';
import { BackendRequestService } from '../../../../service/backend-request/backend-request.service';
import { Image } from '../../../../model/image';
import { LoadContentService } from '../../../../service/load-content/load-content.service';
import { Component, OnInit, ViewChild, Input, NgZone, AfterViewInit, Inject } from '@angular/core';
import { CdkTextareaAutosize } from '@angular/cdk/text-field';
import {take} from 'rxjs/operators';
import { MatDialog } from '@angular/material';




@Component({
  selector: 'app-image-edit',
  templateUrl: './image-edit.component.html',
  styleUrls: ['./image-edit.component.styl']
})
export class ImageEditComponent implements OnInit, AfterViewInit {

  imageExpansionList: Array<Image> = new Array();

  @ViewChild('autosize', {static: false}) autosize: CdkTextareaAutosize;

  @Input() tileID: number = null;
  @Input() apartmentID: number = null;
  @Input() infoID: number = null;
  @Input() panelTitle: string = "Bild";

  constructor(private updateContent: UpdateContentService, private _ngZone: NgZone, public dialog: MatDialog) { }

  openDialog(imageObj: Image): void {
    const dialogRef = this.dialog.open(ImagePreviewModalComponent, {
      maxWidth: '97vw',
      maxHeight: '97vh',
      data: {image: imageObj}
    });

    dialogRef.afterClosed().subscribe(result => { console.log("Modal closed"); });
  }

  triggerResize() {
    // Wait for changes to be applied, then trigger textarea resize.
    this._ngZone.onStable.pipe(take(1))
        .subscribe(() => this.autosize.resizeToFitContent(true));
  }

  ngOnInit() {
    this.imageExpansionList = this.updateContent.newImage;
  }
  ngAfterViewInit(): void {
  }

  addNewEntry() {
    this.updateContent.getNextNewImage(this.tileID,this.apartmentID,this.infoID)
  }

  

  removeEntry(entryObject: Image) {
    this.updateContent.deleteNewImage(entryObject)
  }

}

// @Component({
//   selector: 'image-preview-modal',
//   template: `
//   <h1 mat-dialog-title>Picture Preview</h1>
//   <div mat-dialog-content>
//     <img [src]="getImage()">
//   </div>
//   <div mat-dialog-actions>
//     <button mat-button (click)="onNoClick()" cdkFocusInitial>Close</button>
//   </div>
//   `,
//   styles: [
//     `img {
//       width: 100%;
//     }`,
//     `.mat-dialog-content {
//       max-height: 79vh;
//     }`
//   ]
// })
// export class ImagePreviewModal {

//   constructor(
//     private backend: BackendRequestService,
//     public dialogRef: MatDialogRef<ImagePreviewModal>,
//     @Inject(MAT_DIALOG_DATA) public data: PreviewImage) {}

//   onNoClick(): void {
//     this.dialogRef.close();
//   }
//   getImage() {
//     return this.backend.showImage(this.data.image.ID);
//   }

// }