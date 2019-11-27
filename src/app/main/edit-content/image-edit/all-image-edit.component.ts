import { BackendRequestService } from './../../../service/backend-request/backend-request.service';
import { ImageContentService } from './../../../service/update-content/image-content.service';
import { ImagePreviewModalComponent } from '../../image-preview-modal/image-preview-modal.component';
import { LoadContentService } from '../../../service/load-content/load-content.service';
import { Image } from '../../../model/image';
import { Component, OnInit, ViewChild, NgZone, AfterViewInit, Input } from '@angular/core';
import { CdkTextareaAutosize } from '@angular/cdk/text-field';
import {take} from 'rxjs/operators';
import { MatDialog } from '@angular/material';
import { element } from 'protractor';
import { UpdateContentService } from 'src/app/service/update-content/update-content.service';
import { TouchSequence } from 'selenium-webdriver';

@Component({
  selector: 'app-all-image-edit',
  templateUrl: './all-image-edit.component.html',
  styleUrls: ['./all-image-edit.component.styl']
})
export class AllImageEditComponent implements OnInit, AfterViewInit {

  imageExpansionList: Array<Image> = new Array();

  @ViewChild('autosize', {static: false}) autosize: CdkTextareaAutosize;
  @Input() apartmentID: number = null;
  @Input() tileID: number = null;
  @Input() infoTextID: number = null;
  @Input() panelTitle = "Bilder";

  constructor(
    private updateImage: ImageContentService,
    private backend: BackendRequestService,
    private _ngZone: NgZone, public dialog: MatDialog) { }

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

  onFileChanged(id: number,event) {
    this.backend.uploadImageFromUser(id,event.target.files[0]);
    const changedObj = this.imageExpansionList.find(el => el.ID === id)
    if (changedObj) {
      this.updateImage.updateNewImage(changedObj)
    }
  }

  addNewEntry() {
    const newEntry: Image = new Image();
    this.updateImage.updateNewImage(newEntry)
  }

  removeEntry(entryObject: Image) {
    this.updateImage.deleteNewImage(entryObject);
  }

  isChildComponent() {
    return this.apartmentID || this.infoTextID || this.tileID;
  }

  /**
   * If none parent id is set, every Image will shown
   * Otherwise, shows only Images with parent references
   * @param imComp The current Image wich will be shown 
   */
  filterView(imComp: Image) {
    if (this.apartmentID) {
      return imComp.fk_apartment === this.apartmentID
    }
    if (this.infoTextID) {
      return imComp.fk_info === this.infoTextID
    }
    if (this.tileID) {
      return imComp.fk_tile === this.tileID
    }
    return !imComp.deleteEntry;
  }

}

