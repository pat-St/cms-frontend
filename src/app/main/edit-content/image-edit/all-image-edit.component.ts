import { ImagePreviewModalComponent } from '../../image-preview-modal/image-preview-modal.component';
import { LoadContentService } from '../../../service/load-content/load-content.service';
import { Image } from '../../../model/image';
import { Component, OnInit, ViewChild, NgZone, AfterViewInit } from '@angular/core';
import { CdkTextareaAutosize } from '@angular/cdk/text-field';
import {take} from 'rxjs/operators';
import { MatDialog } from '@angular/material';
import { element } from 'protractor';
import { UpdateContentService } from 'src/app/service/update-content/update-content.service';

@Component({
  selector: 'app-all-image-edit',
  templateUrl: './all-image-edit.component.html',
  styleUrls: ['./all-image-edit.component.styl']
})
export class AllImageEditComponent implements OnInit, AfterViewInit {

  imageExpansionList: Array<Image> = new Array();

  @ViewChild('autosize', {static: false}) autosize: CdkTextareaAutosize;

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
  }

  removeEntry(entryObject: Image) {
  }

}

