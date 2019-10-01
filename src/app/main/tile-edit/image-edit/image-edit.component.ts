import { BackendRequestService } from './../../../service/backend-request/backend-request.service';
import { Image } from './../../../model/image';
import { LoadContentService } from './../../../service/load-content/load-content.service';
import { Component, OnInit, ViewChild, Input, NgZone, AfterViewInit, Inject } from '@angular/core';
import { CdkTextareaAutosize } from '@angular/cdk/text-field';
import {take} from 'rxjs/operators';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';


export interface PreviewImage {
  image: Image;
}

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

  constructor(private content: LoadContentService, private _ngZone: NgZone, public dialog: MatDialog) { }

  openDialog(imageObj: Image): void {
    const dialogRef = this.dialog.open(ImagePreviewModal, {
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
    if (!this.content.getImages()) {
      this.content.loadImage();
    }
  }
  ngAfterViewInit(): void {
    if (this.tileID || this.infoID || this.apartmentID) {
      this.loadContent();
    }
  }
  async loadContent(count= 5) {
    if (count < 0) {
      console.warn("could not load content from backend");
      return;
    }
    const responseContent = this.content.getImageByFkId(this.apartmentID, this.infoID, this.tileID);
    if (responseContent ) {
      responseContent.forEach( element => {
        this.imageExpansionList.push(element);
      });
    } else {
      console.log("await for image");
      setTimeout( () => this.loadContent(count - 1), 1000 );
    }
  }

  addNewEntry() {
    const newEntry: Image = new Image(null, null, null, this.apartmentID, this.infoID, this.tileID);
    if (!this.imageExpansionList.some((element: Image) => element.ID === newEntry.ID)) {
      this.imageExpansionList.push(newEntry);
    }
  }

  removeEntry(entryObject: Image) {
    if (this.imageExpansionList.includes(entryObject)) {
      const indexOf = this.imageExpansionList.indexOf(entryObject);
      this.imageExpansionList.splice(indexOf, 1);
    }
  }

}

@Component({
  selector: 'image-preview-modal',
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
export class ImagePreviewModal {

  constructor(
    private backend: BackendRequestService,
    public dialogRef: MatDialogRef<ImagePreviewModal>,
    @Inject(MAT_DIALOG_DATA) public data: PreviewImage) {}

  onNoClick(): void {
    this.dialogRef.close();
  }
  getImage() {
    return this.backend.showImage(this.data.image.ID);
  }

}