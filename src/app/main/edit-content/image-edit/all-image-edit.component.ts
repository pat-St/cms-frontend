import { ImagePreviewModalComponent } from '../../image-preview-modal/image-preview-modal.component';
import { LoadContentService } from '../../../service/load-content/load-content.service';
import { Image } from '../../../model/image';
import { Component, OnInit, ViewChild, NgZone, AfterViewInit } from '@angular/core';
import { CdkTextareaAutosize } from '@angular/cdk/text-field';
import {take} from 'rxjs/operators';
import { MatDialog } from '@angular/material';
import { element } from 'protractor';

@Component({
  selector: 'app-all-image-edit',
  templateUrl: './all-image-edit.component.html',
  styleUrls: ['./all-image-edit.component.styl']
})
export class AllImageEditComponent implements OnInit, AfterViewInit {

  imageExpansionList: Array<Image> = new Array();

  @ViewChild('autosize', {static: false}) autosize: CdkTextareaAutosize;

  constructor(private content: LoadContentService, private _ngZone: NgZone, public dialog: MatDialog) { }

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

  ngOnInit() { }

  ngAfterViewInit(): void {
    this.loadContent();
  }
  async loadContent(count= 5) {
    if (count < 0) {
      console.warn("could not load content from backend");
      return;
    }
    if (this.content.isFinished()) {
      const responseContent = this.content.getImages();
      console.log("found images " +  responseContent.map(element => element.description));
      this.addListInTile(responseContent);
    } else {
      console.log("await for image");
      setTimeout( () => this.loadContent(count - 1), count*500 );
    }
  }

  addListInTile(entryObject: Image[]) {
    entryObject.forEach((element: Image) => {
      const indexElement = this.imageExpansionList.findIndex((compE: Image) => compE.ID === element.ID)
      if (indexElement >= 0) {
        this.imageExpansionList.splice(indexElement, 1);
      }
      this.imageExpansionList.push(element);
    });
  }

  addNewEntry() {
    const newEntry: Image = new Image();
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

