import { NewApartmentObject } from './../../../../model/apartment';
import { ApartmentDetailsContentService } from './../../../../service/update-content/apartment-details-content.service';
import { ApartmentContent, ApartmentDescription, ApartmentDetails, ApartmentPrice, DetailsToApartment } from '../../../../model/apartment';
import { LoadContentService } from '../../../../service/load-content/load-content.service';
import { Component, OnInit, AfterViewInit, NgZone, ViewChild, Input, ChangeDetectorRef, AfterViewChecked } from '@angular/core';
import {CdkTextareaAutosize} from '@angular/cdk/text-field';
import {take} from 'rxjs/operators';
import { ApartmentContentService } from 'src/app/service/update-content/apartment-content.service';

//TODO: Change to update-Content service
@Component({
  selector: 'app-apartment-edit',
  templateUrl: './apartment-edit.component.html',
  styleUrls: ['./apartment-edit.component.styl']
})
export class ApartmentEditComponent implements OnInit, AfterViewInit, AfterViewChecked {

  apartmentDetailsList: Array<ApartmentDetails>;
  apartment: Array<NewApartmentObject>;


  showDescStack: Set<number> = new Set();
  showDetailsStack: Set<number> = new Set();

  apartmentID: number = null;

  @ViewChild('autosize', {static: false}) autosize: CdkTextareaAutosize;

  @Input() tileID: number;

  constructor(
    private updateApartment: ApartmentContentService,
    private updateDetails: ApartmentDetailsContentService,
    private _ngZone: NgZone,
    private cdRef : ChangeDetectorRef) { }

  triggerResize() {
    // Wait for changes to be applied, then trigger textarea resize.
    this._ngZone.onStable.pipe(take(1))
        .subscribe(() => this.autosize.resizeToFitContent(true));
  }

  ngOnInit() {
  }
  ngAfterViewInit(): void {
    if (this.tileID) {
      this.apartment = this.updateApartment.newApartment;
      this.apartmentDetailsList = this.updateDetails.newApartmentDetails;
    }
  }

  ngAfterViewChecked(): void {
    if (this.apartmentID) {
      this.cdRef.detectChanges();
    }
  }

  addNewDescEntry() {
    const newID = this.updateApartment.nextIdOf(this.updateApartment.getAllApartmentDescriptionID());
    const newEntry: ApartmentDescription = new ApartmentDescription(newID, null, null, this.apartmentID);
    const index = this.apartment.findIndex(el => el.content.fk_tile === this.tileID);
    this.apartment[index].description.push(newEntry)
  }

  removeDescEntry(entryObject: ApartmentDescription) {
    const index = this.apartment.findIndex(el => el.content.fk_tile === this.tileID);
    const indexOf = this.apartment
      .filter(el => el.content.fk_tile === this.tileID)[0]
      .description
      .findIndex(el => el.ID === entryObject.ID);
    if (indexOf >= 0) {
      this.apartment[index].description[indexOf] = this.apartment[index].description[indexOf].setDelete();
    }
  }

  addNewPriceEntry() {
    const index = this.apartment.findIndex(el => el.content.fk_tile === this.tileID);
    const newID = this.updateApartment.nextIdOf(this.updateApartment.getAllPriceID());
    const newEntry: ApartmentPrice = new ApartmentPrice(newID, "", "", "", this.apartmentID);
    this.apartment[index].price.push(newEntry);
  }

  removePriceEntry(entryObject: ApartmentPrice) {
    const index = this.apartment.findIndex(el => el.content.fk_tile === this.tileID);
    const indexOf = this.apartment.filter(el => el.content.fk_tile === this.tileID)[0].price.findIndex(el => el.ID === entryObject.ID);
    if (indexOf >= 0) {
      this.apartment[index].price[indexOf] = this.apartment[index].price[indexOf].setDelete();
    }
  }

  addNewDetailsRelationEntry() {
    const index = this.apartment.findIndex(el => el.content.fk_tile === this.tileID);
    const newID = this.updateApartment.nextIdOf(this.updateApartment.getAllDetailsRelationID());
    const newEntry: DetailsToApartment = new DetailsToApartment(newID, null, this.apartmentID, null);
    this.apartment[index].detailsToApartment.push(newEntry);
  }

  removeDetailsRelationEntry(entryObject: DetailsToApartment) {
    const index = this.apartment.findIndex(el => el.content.fk_tile === this.tileID);
    const indexOf = this.apartment
      .filter(el => el.content.fk_tile === this.tileID)[0]
      .detailsToApartment
      .findIndex(el => el.ID === entryObject.ID);
    if (indexOf >= 0) {
      this.apartment[index].detailsToApartment[indexOf] = this.apartment[index].detailsToApartment[indexOf].setDelete();
    }
  }

  showDescDetails(id: number) {
    if (this.showDescStack.has(id)) {
      this.showDescStack.delete(id);
    } else {
      this.showDescStack.add(id);
    }
  }

  isApartDetailsActive(id: number) {
    return this.showDetailsStack.has(id);
  }

  isInputSet(input: number): boolean {
    if (input) {
      return true;
    } else {
      return false;
    }
  }
}
