import { ModalTableEntry, ListModify, ModifyModalComponent } from './../custom-info-modal/modify-list-for-save.component';
import { LoginServiceService } from './../../service/login-service/login-service.service';
import { RefreshModalComponent } from '../custom-info-modal/refresh-information-modal.component';
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
import { Router } from '@angular/router';
@Component({
  selector: 'app-edit-content',
  templateUrl: './edit-content.component.html',
  styleUrls: ['./edit-content.component.styl']
})
export class EditContentComponent implements OnInit, AfterViewChecked {

  @ViewChild('autosize', {static: false}) autosize: CdkTextareaAutosize;

  spinnerValue = 0;

  constructor(
    private _ngZone: NgZone,
    private cdRef: ChangeDetectorRef,
    private dialog: MatDialog,
    private content: LoadContentService,
    private updateContent: UpdateContentService,
    private updateInfoText: InfoTextService,
    private updateApartment: ApartmentContentService,
    private updateDetails: ApartmentDetailsContentService,
    private updateImage: ImageContentService,
    private loginService: LoginServiceService,
    private router: Router) { }

  ngOnInit() {
    this.loginService
      .testToken()
      .subscribe(
        () => this.trigger_refresh(),
        (error) => this.router.navigate(['login'])
      );
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

  async trigger_refresh() {
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

  private trigger_save() {
    return this.executeNewInRightOrder()
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

  private executeNewInRightOrder() {
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

  private collectImageModification(): ModalTableEntry[] {
    const deteleColl: ModalTableEntry[] = this.updateImage
      .getDeleteChanges()
      .map((i) => ({name: i.description, status: "löschen"}));
    const updateColl: ModalTableEntry[] = this.updateImage
      .getUpdateChanges()
      .map((i) => ({name: i.description, status: "ändern"}));
    const newColl: ModalTableEntry[] = this.updateImage
      .getNewChanges()
      .map((i) => ({name: i.description, status: "neu"}));
    return deteleColl.concat(updateColl).concat(newColl);
  }

  private collectTileModification(): ModalTableEntry[] {
    const deteleColl: ModalTableEntry[] = this.updateContent
      .getDeleteChanges()
      .map((i) => ({name: i.titleName, status: "löschen"}));
    const updateColl: ModalTableEntry[] = this.updateContent
      .getUpdateChanges()
      .map((i) => ({name: i.titleName, status: "ändern"}));
    const newColl: ModalTableEntry[] = this.updateContent
      .getNewChanges()
      .map((i) => ({name: i.titleName, status: "neu"}));
    return deteleColl.concat(updateColl).concat(newColl);
  }

  private collectTextToTileModification(): ModalTableEntry[] {
    const deteleColl: ModalTableEntry[] = this.updateInfoText
      .getDeleteChanges()
      .map((i) => ({name: i.infoText.headerText, status: "löschen"}));
    const updateColl: ModalTableEntry[] = this.updateInfoText
      .getUpdateChanges()
      .map((i) => ({name: i.infoText.headerText, status: "ändern"}));
    const newColl: ModalTableEntry[] = this.updateInfoText
      .getNewChanges()
      .map((i) => ({name: i.infoText.headerText, status: "neu"}));
    return deteleColl.concat(updateColl).concat(newColl);
  }

  private getItemOfDetails(id: number): string {
    return this.updateDetails.newApartmentDetails[id].identifier;
  }

  private collectApartmentDetailsModification(): ModalTableEntry[] {
    const deteleColl: ModalTableEntry[] = this.updateApartment
      .getDeleteDetailsChanges()
      .map((i) => ({name: this.getItemOfDetails(i.fk_details), status: "löschen"}));
    const updateColl: ModalTableEntry[] = this.updateApartment
      .getUpdateDetailsChanges()
      .map((i) => ({name: this.getItemOfDetails(i.fk_details), status: "ändern"}));
    const newColl: ModalTableEntry[] = this.updateApartment
      .getNewDetailChanges()
      .map((i) => ({name: this.getItemOfDetails(i.fk_details), status: "neu"}));
    return deteleColl.concat(updateColl).concat(newColl);
  }

  private collectApartmentDescModification(): ModalTableEntry[] {
    const deteleColl: ModalTableEntry[] = this.updateApartment
      .getDeleteDescChanges()
      .map((i) => ({name: i.description + " : " + i.info, status: "löschen"}));
    const updateColl: ModalTableEntry[] = this.updateApartment
      .getUpdateDescChanges()
      .map((i) => ({name: i.description + " : " + i.info, status: "ändern"}));
    const newColl: ModalTableEntry[] = this.updateApartment
      .getNewDescChanges()
      .map((i) => ({name: i.description + " : " + i.info, status: "neu"}));
    return deteleColl.concat(updateColl).concat(newColl);
  }

  private collectApartmentPriceModification(): ModalTableEntry[] {
    const deteleColl: ModalTableEntry[] = this.updateApartment
      .getDeletePriceChanges()
      .map((i) => ({ name: i.nights, status: "löschen"}));
    const updateColl: ModalTableEntry[] = this.updateApartment
      .getUpdatePriceChanges()
      .map((i) => ({ name: i.nights, status: "ändern"}));
    const newColl: ModalTableEntry[] = this.updateApartment
      .getNewPriceChanges()
      .map((i) => ({ name: i.nights, status: "neu" }));
    return deteleColl.concat(updateColl).concat(newColl);
  }

  private collectApartmentContentModification(): ModalTableEntry[] {
    const deteleColl: ModalTableEntry[] = this.updateApartment
      .getDeleteApartmentChanges()
      .map((i) => ({name: i.fk_tile.toString(), status: "löschen"}));
    const updateColl: ModalTableEntry[] = this.updateApartment
      .getUpdateApartmentChanges()
      .map((i) => ({name: i.fk_tile.toString(), status: "ändern"}));
    const newColl: ModalTableEntry[] = this.updateApartment
      .getNewApartmentChanges()
      .map((i) => ({name: i.fk_tile.toString(), status: "neu"}));
    return deteleColl.concat(updateColl).concat(newColl);
  }

  private collectModification(): Map<string, ModalTableEntry[]> {
    const mapOfColl: Map<string, ModalTableEntry[]> = new Map();
    mapOfColl.set("Bilder", this.collectImageModification());
    mapOfColl.set("Kacheln", this.collectTileModification());
    mapOfColl.set("Infotext", this.collectTextToTileModification());
    mapOfColl.set("Ferienwohnung", this.collectApartmentContentModification());
    mapOfColl.set("Ferienwohnung Details", this.collectApartmentDetailsModification());
    mapOfColl.set("Ferienwohnung Preise", this.collectApartmentPriceModification());
    mapOfColl.set("Ferienwohnung Beschreibung", this.collectApartmentDescModification());
    return mapOfColl;
  }

  askRefresh(): void {
    const dialogRef = this.dialog.open(ModifyModalComponent, {
      maxWidth: '97vw',
      maxHeight: '97vh',
      data : { header: 'Folgende Änderungen gehen verloren', listOfEntrys: this.collectModification()},
    });

    dialogRef.afterClosed().subscribe((result: boolean) => { 
      if (result) {
        this.trigger_refresh();
      }
     });
  }

  askSave(): void {
    const dialogRef = this.dialog.open(ModifyModalComponent, {
      maxWidth: '97vw',
      maxHeight: '97vh',
      data : {header: 'Folgende Änderung werden gespeichert', listOfEntrys: this.collectModification()},
    });
    dialogRef.afterClosed().subscribe((result: boolean) => {
      if (result) {
        this.trigger_save()
        .finally(() => setTimeout(() => { this.trigger_refresh(); }, 400));
      }
     });
  }

}
