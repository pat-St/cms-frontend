import { ImageContentService } from './../../../../service/update-content/image-content.service';
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
  selector: 'app-image-edit-ap',
  templateUrl: './image-edit.component.html',
  styleUrls: ['./image-edit.component.styl']
})
export class ImageEditComponentApartment implements OnInit, AfterViewInit {

  imageExpansionList: Array<Image>;

  @ViewChild('autosize', {static: false}) autosize: CdkTextareaAutosize;
  @Input() apartmentID: number = null;
  @Input() panelTitle = "Ferienwohnung Biler";

  constructor(
    private updateImage: ImageContentService,
    private _ngZone: NgZone, public dialog: MatDialog
    ) { }

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
    this.imageExpansionList = this.updateImage.newImage;
  }

  ngAfterViewInit(): void {
  }

  addNewEntry() {
    this.updateImage.getNextNewImage(null,this.apartmentID,null)
  } 

  removeEntry(entryObject: Image) {
    this.updateImage.deleteNewImage(entryObject)
  }

}