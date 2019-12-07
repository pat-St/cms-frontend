import { RefreshModalComponent } from './../image-preview-modal/refresh-information-modal.component';
import { ApartmentDetailsContentService } from './../../service/update-content/apartment-details-content.service';
import { ImageContentService } from './../../service/update-content/image-content.service';
import { ApartmentContentService } from './../../service/update-content/apartment-content.service';
import { InfoTextService } from './../../service/update-content/info-text.service';
import { LoadContentService } from './../../service/load-content/load-content.service';
import { Component, OnInit, ViewChild, NgZone, ChangeDetectorRef, AfterViewChecked } from '@angular/core';
import { CdkTextareaAutosize } from '@angular/cdk/text-field';
import {take} from 'rxjs/operators';
import { UpdateContentService } from 'src/app/service/update-content/update-content.service';
import { MatDialog } from '@angular/material';
@Component({
  selector: 'app-edit-content',
  templateUrl: './edit-content.component.html',
  styleUrls: ['./edit-content.component.styl']
})
export class EditContentComponent implements OnInit, AfterViewChecked {

  @ViewChild('autosize', {static: false}) autosize: CdkTextareaAutosize;

  spinnerValue = 0;

  constructor(
    private content: LoadContentService,
    private _ngZone: NgZone,
    private cdRef: ChangeDetectorRef,
    public dialog: MatDialog,
    private updateContent: UpdateContentService,
    private updateInfoText: InfoTextService,
    private updateApartment: ApartmentContentService,
    private updateDetails: ApartmentDetailsContentService,
    private updateImage: ImageContentService) { }

  ngOnInit() {
    if (!this.content.isFinished()) {
      this.content.loadAll();
      this.updateContent.loadNewContent();
      this.updateInfoText.loadNewContent();
      this.updateApartment.loadNewContent();
      this.updateDetails.loadNewContent();
      this.updateImage.loadNewContent();
    }
  }
  triggerResize() {
    // Wait for changes to be applied, then trigger textarea resize.
    this._ngZone.onStable.pipe(take(1))
        .subscribe(() => this.autosize.resizeToFitContent(true));
  }

  isFinished() {
    return this.content.isFinished();
  }
  ngAfterViewChecked(): void {
    if (this.content.isFinished()) {
      this.cdRef.detectChanges();
    }
  }

  trigger_refresh() {
    // reset
    this.updateContent.reset();
    this.updateInfoText.reset();
    this.updateApartment.reset();
    this.updateDetails.reset();
    this.updateImage.reset();
    // load new
    this.content.loadAll();
    this.updateContent.loadNewContent();
    this.updateInfoText.loadNewContent();
    this.updateApartment.loadNewContent();
    this.updateDetails.loadNewContent();
    this.updateImage.loadNewContent();
  }

  trigger_save() {
    Promise.resolve(true)
    .then(() => this.executeNewInRightOrder())
    // update images
    .then(() => this.updateImage.sendChangesToBackend())
    // update info text
    .then(() => this.updateInfoText.sendChangesToBackend())
    // update apartment content
    .then(() => this.updateApartment.sendChangesToBackend())
    // update apartment details
    .then(() => this.updateDetails.sendChangesToBackend())
    // update tiles
    .then(() => this.updateContent.sendUpdateToBackend())
    .catch((err) => {
      console.log("error by trigger objects changes: " + JSON.stringify(err));
    });
  }

  executeNewInRightOrder() {
    return Promise.resolve(true)
    .then(() => this.updateContent.sendNew())
    .then(() => this.updateInfoText.sendNew())
    .then(() => this.updateApartment.sendNew())
    .then(() => this.updateDetails.sendNew())
    .then(() => this.updateImage.sendNew())
    .catch((err) => {
      console.log("error by send new objects: " + JSON.stringify(err));
    });
  }

  getSpinnerValue() {
    return Math.round((this.content.getCounter() / this.content.maxCounter) * 100);
  }

  askRefresh(): void {
    const dialogRef = this.dialog.open(RefreshModalComponent, {
      maxWidth: '97vw',
      maxHeight: '97vh',
      data : { header: 'Inhalt neu laden', listOfEntrys: ['Alle Änderungen gehen verloren.', 'Wirklich neu laden?']}
    });

    dialogRef.afterClosed().subscribe((result:boolean) => { 
      if (result) {
        this.trigger_refresh();
      }
     });
  }
  askSave(): void {
    const dialogRef = this.dialog.open(RefreshModalComponent, {
      maxWidth: '97vw',
      maxHeight: '97vh',
      data : { header: 'Änderungen speichern', listOfEntrys: ['Alle Änderungen werden überschrieben.', 'Wirklich speichern?']}
    });

    dialogRef.afterClosed().subscribe((result:boolean) => { 
      if (result) {
        this.trigger_save();
      }
     });
  }

}
