import { ApartmentDetailsContentService } from './../../../../service/update-content/apartment-details-content.service';
import { ApartmentContentService } from './../../../../service/update-content/apartment-content.service';
import { ApartmentContent, ApartmentDescription, ApartmentDetails, ApartmentPrice, DetailsToApartment } from '../../../../model/apartment';
import { LoadContentService } from '../../../../service/load-content/load-content.service';
import { Component, OnInit, AfterViewInit, NgZone, ViewChild, Input, ChangeDetectorRef, AfterViewChecked } from '@angular/core';
import {CdkTextareaAutosize} from '@angular/cdk/text-field';
import {take} from 'rxjs/operators';

@Component({
  selector: 'app-apartment-details-edit',
  templateUrl: './apartment-details-edit.component.html',
  styleUrls: ['./apartment-details-edit.component.styl']
})
export class ApartmentDetailsEditComponent implements OnInit, AfterViewInit, AfterViewChecked {

  @Input() apartmentDescList: Array<ApartmentDescription>;
  @Input() detailsRelation: Array<DetailsToApartment>;
  @Input() apartmentPriceList: Array<ApartmentPrice>;
  @Input() apartmentID: number;

  apartmentDetailsList: Array<ApartmentDetails>;

  showDescStack: Set<number> = new Set();
  showDetailsStack: Set<number> = new Set();

  @ViewChild('autosize', {static: false}) autosize: CdkTextareaAutosize;

  @Input() tileID: number;

  constructor(
    private _ngZone: NgZone,
    private cdRef: ChangeDetectorRef,
    private updateApartment: ApartmentContentService,
    private updateDetails: ApartmentDetailsContentService,
    ) { }

  triggerResize() {
    // Wait for changes to be applied, then trigger textarea resize.
    this._ngZone.onStable.pipe(take(1))
        .subscribe(() => this.autosize.resizeToFitContent(true));
  }

  ngOnInit() {
    this.apartmentDetailsList = this.updateDetails.newApartmentDetails;
  }
  ngAfterViewInit(): void { }

  ngAfterViewChecked(): void {
    if (this.apartmentID) {
      this.cdRef.detectChanges();
    }
  }

  addNewDescEntry() {
    const newID = this.updateApartment.nextIdOf(this.updateApartment.getAllApartmentDescriptionID());
    const newEntry: ApartmentDescription = new ApartmentDescription(newID, "", "", this.apartmentID);
    this.apartmentDescList.push(newEntry);
  }

  removeDescEntry(entryObject: ApartmentDescription) {
    const indexOf = this.apartmentDescList.indexOf(entryObject);
    if (indexOf >= 0) {
      this.apartmentDescList[indexOf].deleteEntry = true;
    }
  }

  addNewPriceEntry() {
    const newID = this.updateApartment.nextIdOf(this.updateApartment.getAllPriceID());
    const newEntry: ApartmentPrice = new ApartmentPrice(newID, "", "", "", this.apartmentID);
    this.apartmentPriceList.push(newEntry);
  }

  removePriceEntry(entryObject: ApartmentPrice) {
    const indexOf = this.apartmentPriceList.indexOf(entryObject);
    if (indexOf >= 0) {
      this.apartmentPriceList[indexOf].deleteEntry = true;
    }
  }

  addNewDetailsRelationEntry() {
    const newID = this.updateApartment.nextIdOf(this.updateApartment.getAllDetailsRelationID());
    const newEntry: DetailsToApartment = new DetailsToApartment(newID, "", this.apartmentID, this.tileID);
    this.detailsRelation.push(newEntry);
  }

  removeDetailsRelationEntry(entryObject: DetailsToApartment) {
    const indexOf = this.detailsRelation.indexOf(entryObject);
    if (indexOf >= 0) {
      this.detailsRelation[indexOf].deleteEntry = true;
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

