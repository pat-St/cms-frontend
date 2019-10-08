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

  apartmentExpansionList: Array<ApartmentContent> = new Array();
  apartmentDescList: Array<ApartmentDescription> = new Array();
  apartmentDetailsList: Array<ApartmentDetails> = new Array();
  apartmentPriceList: Array<ApartmentPrice> = new Array();

  showDescStack: Set<number> = new Set();
  showDetailsStack: Set<number> = new Set();

  apartmentID: number = null;

  @ViewChild('autosize', {static: false}) autosize: CdkTextareaAutosize;

  @Input() tileID: number;

  constructor(private content: LoadContentService, private _ngZone: NgZone, private cdRef : ChangeDetectorRef) { }

  triggerResize() {
    // Wait for changes to be applied, then trigger textarea resize.
    this._ngZone.onStable.pipe(take(1))
        .subscribe(() => this.autosize.resizeToFitContent(true));
  }

  ngOnInit() {
    if (!this.content.getInfoText()) {
      this.content.loadInfoText();
    }
    if (!this.content.getInfoTextToTile()) {
      this.content.loadTextToTile();
    }
  }
  ngAfterViewInit(): void {
    if (this.tileID) {
      this.loadContent();
    }
  }
  async loadContent(count= 5) {
    if (count < 0) {
      console.warn("could not load content from backend");
      return;
    }
    const responseContent = this.content.getApartmentContent().filter(element => element.fk_tile === this.tileID );
    const apartmentDescription = this.content.getApartmentDescription();
    const apartmentDetails = this.content.getApartmentDetails();
    const detailsToApartment = this.content.getDetailsToApartment();
    const apartmentPrice = this.content.getApartmentPrice();
    if (responseContent && apartmentDescription && apartmentDetails && detailsToApartment && apartmentPrice) {
      this.apartmentID = responseContent[0].ID;
      
      this.addApartmentContentForTileID(responseContent, apartmentDescription, apartmentDetails, detailsToApartment, apartmentPrice);
    } else {
      console.log("await for apartment content");
      setTimeout( () => this.loadContent(count - 1), 1000 );
    }
  }

  ngAfterViewChecked(): void {
    if (this.apartmentID) {
      this.cdRef.detectChanges();
    }
  }

  addNewEntry() {
    const newEntry: ApartmentContent = new ApartmentContent();
    if (!this.apartmentExpansionList.some((element: ApartmentContent) => element.ID === newEntry.ID)) {
      this.apartmentExpansionList.push(newEntry);
    }
  }

  removeDescEntry(entryObject: ApartmentContent) {
    if (this.apartmentExpansionList.includes(entryObject)) {
      const indexOf = this.apartmentExpansionList.indexOf(entryObject);
      this.apartmentExpansionList.splice(indexOf, 1);
    }
  }

  addNewDetailsEntry() {
    const newEntry: ApartmentDetails = new ApartmentDetails();
    if (!this.apartmentDetailsList.some((element: ApartmentDetails) => element.ID === newEntry.ID)) {
      this.apartmentDetailsList.push(newEntry);
    }
  }

  removeDetailsEntry(entryObject: ApartmentDetails) {
    if (this.apartmentDetailsList.includes(entryObject)) {
      const indexOf = this.apartmentDetailsList.indexOf(entryObject);
      this.apartmentDetailsList.splice(indexOf, 1);
    }
  }

  addApartmentContentForTileID(
    entryObject: ApartmentContent[],
    apartmentDesc: ApartmentDescription[],
    apartmentDetails: ApartmentDetails[],
    detailsToApartment: DetailsToApartment[],
    apartmentPrice: ApartmentPrice[]
  ) {
    entryObject
      .filter(element => element.fk_tile === this.tileID )
      .forEach((element: ApartmentContent) => {
        const indexElement = this.apartmentExpansionList.findIndex((compE: ApartmentContent) => compE.ID === element.ID);
        this.addApartmentDescForApartment(apartmentDesc, element.ID);
        this.addApartDetailsForApartID(apartmentDetails, detailsToApartment, element.ID);
        this.addApartmentPriceForApartment(apartmentPrice, element.ID);
        if (indexElement >= 0) {
          this.apartmentExpansionList.splice(indexElement, 1);
        }
        this.apartmentExpansionList.push(element);
    });
  }

  private addApartmentDescForApartment(apartmentDesc: ApartmentDescription[], apartmentID: number) {
    apartmentDesc
      .filter(element => element.fk_apartment === apartmentID )
      .forEach((element: ApartmentDescription) => {
        const indexElement = this.apartmentDescList.findIndex((compE: ApartmentDescription) => compE.ID === element.ID);
        if (indexElement >= 0) {
          this.apartmentDescList.splice(indexElement, 1);
        }
        this.apartmentDescList.push(element);
    });
  }

  private addApartDetailsForApartID(apartDetailsList: ApartmentDetails[], detailsRelation: DetailsToApartment[], apartmentID: number) {
    detailsRelation
      .filter(element => element.fk_apartment === apartmentID)
      .forEach((element: DetailsToApartment) => {
        apartDetailsList.filter(detailsObj => detailsObj.ID === element.fk_details).forEach((detailsObj: ApartmentDetails) => {
          const indexElement = this.apartmentDetailsList.findIndex((compE: ApartmentDetails) => compE.ID === detailsObj.ID);
          if (indexElement >= 0) {
            this.apartmentDetailsList.splice(indexElement, 1);
          }
          this.apartmentDetailsList.push(detailsObj);
        });
      });
  }

  private addApartmentPriceForApartment(apartmentDesc: ApartmentPrice[], apartmentID: number) {
    apartmentDesc
      .filter(element => element.fk_apartment === apartmentID )
      .forEach((element: ApartmentPrice) => {
        const indexElement = this.apartmentPriceList.findIndex((compE: ApartmentPrice) => compE.ID === element.ID);
        if (indexElement >= 0) {
          this.apartmentPriceList.splice(indexElement, 1);
        }
        this.apartmentPriceList.push(element);
    });
  }

  trigger_refresh() {
    this.content.loadAll();
    this.loadContent();
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

