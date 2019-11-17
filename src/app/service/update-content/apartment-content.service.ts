import { ApartmentContent, ApartmentDescription, ApartmentPrice, DetailsToApartment, ApartmentDetails } from './../../model/apartment';
import { NewApartmentObject } from 'src/app/model/apartment';
import { InfoTextToTile, InfoText, NewInfoTextToTile } from 'src/app/model/infoText';
import { LoadContentService } from './../load-content/load-content.service';
import { BackendRequestService } from './../backend-request/backend-request.service';
import { Injectable, Optional } from '@angular/core';
import { element } from 'protractor';
import { Tile } from 'src/app/model/tile';
import { Image } from 'src/app/model/image';
import { filter } from 'minimatch';

@Injectable({
  providedIn: 'root'
})
export class ApartmentContentService {
  newApartment: Array<NewApartmentObject> = new Array();

  constructor(private backend: BackendRequestService, private loadContent: LoadContentService) { }

  public nextIdOf(itemColl: Array<number>): number { return itemColl.reduce((currN, nextN) => currN > nextN ? currN : nextN) + 1; }

  async loadNewContent(count= 5) {
    if (count < 0) {
      console.warn("could not load content from backend");
      return;
    }
    if (this.loadContent.isApartmentFinished()) {
      const apartmentContent = this.loadContent.getApartmentContent();
      const apartmentDescription = this.loadContent.getApartmentDescription();
      const detailsToApartment = this.loadContent.getDetailsToApartment();
      const apartmentPrice = this.loadContent.getApartmentPrice();

      this.addApartmentEntry(apartmentContent, apartmentDescription, apartmentPrice, detailsToApartment);
    } else {
      console.log("await for apartment");
      setTimeout( () => this.loadNewContent(count - 1), count * 1000 );
    }
  }
  reset() {
    this.newApartment = new Array();
  }

  private addApartmentEntry(
    entryObject: ApartmentContent[],
    desc: ApartmentDescription[],
    price: ApartmentPrice[],
    details: DetailsToApartment[]
  ) {
    entryObject.forEach((element: ApartmentContent) => {
      const indexElement = this.newApartment.findIndex((compE) => compE.content.ID === element.ID)
      if (indexElement >= 0) {
        this.newApartment.splice(indexElement, 1);
      }
      const apartmentEntity = new NewApartmentObject(
        element,
        desc.filter(el => el.fk_apartment === element.ID),
        price.filter(el => el.fk_apartment === element.ID),
        details.filter(el => el.fk_apartment === element.ID)
      );
      this.newApartment.push(apartmentEntity);
    });
  }
  
  public getNextApartmentTile(tileId: number): boolean {
    if (this.loadContent.isFinished()) {
      const nextApartmentID = this.nextIdOf(this.loadContent.apartmentContent.map(el => el.ID));
      const apartment = new ApartmentContent(nextApartmentID, tileId);
      const nextDesc = this.nextIdOf(this.getAllApartmentDescriptionID());
      const desc = new Array(new ApartmentDescription(nextDesc, "", "", nextApartmentID));
      const nextPrice = this.nextIdOf(this.getAllPriceID());
      const price = new Array(new ApartmentPrice(nextPrice,"","","",nextApartmentID));
      this.newApartment.push(new NewApartmentObject(apartment,desc,price, new Array()));
      return true;
    } else {
      return false;
    }
  }

  public deleteNextApartment(obj: NewApartmentObject): boolean {
    const index = this.newApartment.findIndex(el => el.content.ID === obj.content.ID)
    if (index >= 0) {
      obj.description.forEach(element => element.deleteEntry = true);
      obj.price.forEach(element => element.deleteEntry = true);
      obj.detailsToApartment.forEach(element => element.deleteEntry = true);
      this.newApartment[index] = obj.setDelete();
      return true;
    } else {
      return false;
    }
  }
  public updateNextApartment(obj: NewApartmentObject): boolean {
    const index = this.newApartment.findIndex(el => el.content.ID === obj.content.ID)
    if (index >= 0) {
      this.newApartment[index] = obj.setChanged();
      return true;
    } else {
      return false;
    }
  }
  private sendDelete() {
    const deleteDescEntities: ApartmentDescription[] = this.newApartment
      .map(el => el.description.filter(i => i.deleteEntry))
      .reduce((prevColl, currColl) => currColl.concat(prevColl));
    const deletePriceEntities: ApartmentPrice[] = this.newApartment
      .map(el => el.price.filter(i => i.deleteEntry))
      .reduce((prevColl, currColl) => currColl.concat(prevColl));
    const deleteDetailsRelation: DetailsToApartment[] = this.newApartment
      .map(el => el.detailsToApartment.filter(i => i.deleteEntry))
      .reduce((prevColl, currColl) => currColl.concat(prevColl));
    const deleteApartmentEntitites: ApartmentContent[] = this.newApartment
      .filter(i => i.deleteEntry)
      .map(i => i.content);

    deleteDescEntities.forEach( el => {
      this.backend.deleteToBackend("apartment_desc", el.ID).subscribe((response: boolean) => {});
    });
    deletePriceEntities.forEach( el => {
      this.backend.deleteToBackend("apartment_price", el.ID).subscribe((response: boolean) => {});
    });
    deleteDetailsRelation.forEach( el => {
      this.backend.deleteToBackend("details_to_apartment", el.ID).subscribe((response: boolean) => {});
    });
    deleteApartmentEntitites.forEach( el => {
      this.backend.deleteToBackend("apartment", el.ID).subscribe((response: boolean) => {});
    });

  }

  private sendUpdate() {
    const updateDescEntities: ApartmentDescription[] = this.newApartment
    .map(el => el.description.filter(i => this.loadContent.getApartmentDescription().findIndex(n => n.ID === i.ID) > -1))
    .reduce((prevColl, currColl) => currColl.concat(prevColl));
    const updatePriceEntities: ApartmentPrice[] = this.newApartment
      .map(el => el.price.filter(i => this.loadContent.getApartmentPrice().findIndex(n => n.ID === i.ID) > -1))
      .reduce((prevColl, currColl) => currColl.concat(prevColl));
    const updateDetailsRelation: DetailsToApartment[] = this.newApartment
      .map(el => el.detailsToApartment.filter(i => this.loadContent.getDetailsToApartment().findIndex(n => n.ID === i.ID) > -1))
      .reduce((prevColl, currColl) => currColl.concat(prevColl));
    const updateApartmentEntitites: ApartmentContent[] = this.newApartment
      .filter(i => this.loadContent.getApartmentContent().findIndex(n => n.ID === i.content.ID) > -1)
      .map(i => i.content);

    this.backend.updateToBackend("apartment_desc", updateDescEntities).subscribe((response: boolean) => {});
    this.backend.updateToBackend("apartment_price", updatePriceEntities).subscribe((response: boolean) => {});
    this.backend.updateToBackend("details_to_apartment", updateDetailsRelation).subscribe((response: boolean) => {});
    this.backend.updateToBackend("apartment", updateApartmentEntitites).subscribe((response: boolean) => {});
  }

  private sendNew() {
    const newDescEntities: ApartmentDescription[] = this.newApartment
    .map(el => el.description.filter(i => this.loadContent.getApartmentDescription().findIndex(n => n.ID === i.ID) < 0))
    .reduce((prevColl, currColl) => currColl.concat(prevColl));
    const newPriceEntities: ApartmentPrice[] = this.newApartment
      .map(el => el.price.filter(i => this.loadContent.getApartmentPrice().findIndex(n => n.ID === i.ID) < 0))
      .reduce((prevColl, currColl) => currColl.concat(prevColl));
    const newDetailsRelation: DetailsToApartment[] = this.newApartment
      .map(el => el.detailsToApartment.filter(i => this.loadContent.getDetailsToApartment().findIndex(n => n.ID === i.ID) < 0))
      .reduce((prevColl, currColl) => currColl.concat(prevColl));
    const newApartmentEntitites: ApartmentContent[] = this.newApartment
      .filter(i => this.loadContent.getApartmentContent().findIndex(n => n.ID === i.content.ID) < 0)
      .map(i => i.content);

    this.backend.createToBackend("apartment", newApartmentEntitites).subscribe((response: boolean) => {});
    this.backend.createToBackend("apartment_desc", newDescEntities).subscribe((response: boolean) => {});
    this.backend.createToBackend("details_to_apartment", newDetailsRelation).subscribe((response: boolean) => {});
    this.backend.createToBackend("apartment_price", newPriceEntities).subscribe((response: boolean) => {});
  }

  public sendChangesToBackend() {
    // send delete
    this.sendDelete();
    // send update
    this.sendUpdate();
    // send new
    this.sendNew();
  }

  public sendSpecificChangesToBackend(objs: NewApartmentObject) {
    // send delete
    const deleteDescEntities: ApartmentDescription[] = objs.description.filter(i => i.deleteEntry);
    const deletePriceEntities: ApartmentPrice[] = objs.price.filter(i => i.deleteEntry);
    const deleteDetailsRelation: DetailsToApartment[] = objs.detailsToApartment.filter(i => i.deleteEntry);
    const deleteApartmentEntitites: ApartmentContent = objs.description ? objs.content : null;

    deleteDescEntities.forEach( el => {
    this.backend.deleteToBackend("apartment_desc", el.ID).subscribe((response: boolean) => {});
    });
    deletePriceEntities.forEach( el => {
    this.backend.deleteToBackend("apartment_price", el.ID).subscribe((response: boolean) => {});
    });
    deleteDetailsRelation.forEach( el => {
    this.backend.deleteToBackend("details_to_apartment", el.ID).subscribe((response: boolean) => {});
    });
    if (deleteApartmentEntitites) {
      this.backend.deleteToBackend("apartment", deleteApartmentEntitites.ID).subscribe((response: boolean) => {});
    }

    // send update
    const updateDescEntities: ApartmentDescription[] = objs.description
      .filter(i => this.loadContent.getApartmentDescription().findIndex(el => el.ID === i.ID) > -1);
    const updatePriceEntities: ApartmentPrice[] = objs.price
      .filter(i => this.loadContent.getApartmentPrice().findIndex(el => el.ID === i.ID) > -1);
    const updateDetailsRelation: DetailsToApartment[] = objs.detailsToApartment
      .filter(i => this.loadContent.getDetailsToApartment().findIndex(el => el.ID === i.ID) > -1);
    const updateApartmentEntitites: ApartmentContent = (this.loadContent
      .getApartmentContent()
      .findIndex(el => el.ID === objs.content.ID) > -1) ? objs.content : null;

    this.backend.updateToBackend("apartment_desc", updateDescEntities).subscribe((response: boolean) => {});
    this.backend.updateToBackend("apartment_price", updatePriceEntities).subscribe((response: boolean) => {});
    this.backend.updateToBackend("details_to_apartment", updateDetailsRelation).subscribe((response: boolean) => {});
    this.backend.updateToBackend("apartment", new Array(updateApartmentEntitites)).subscribe((response: boolean) => {});

    // send new
    const newDescEntities: ApartmentDescription[] = objs.description
    .filter(i => this.loadContent.getApartmentDescription().findIndex(el => el.ID === i.ID) < 0);
    const newPriceEntities: ApartmentPrice[] = objs.price
    .filter(i => this.loadContent.getApartmentPrice().findIndex(el => el.ID === i.ID) < 0);
    const newDetailsRelation: DetailsToApartment[] = objs.detailsToApartment
    .filter(i => this.loadContent.getDetailsToApartment().findIndex(el => el.ID === i.ID) < 0);
    const newApartmentEntitites: ApartmentContent = (this.loadContent
      .getApartmentContent()
      .findIndex(el => el.ID === objs.content.ID) < 0) ? objs.content : null;

    this.backend.createToBackend("apartment", new Array(newApartmentEntitites)).subscribe((response: boolean) => {});
    this.backend.createToBackend("apartment_desc", newDescEntities).subscribe((response: boolean) => {});
    this.backend.createToBackend("apartment_price", newPriceEntities).subscribe((response: boolean) => {});
    this.backend.createToBackend("details_to_apartment", newDetailsRelation).subscribe((response: boolean) => {});
  }

  public getAllApartmentDescriptionID(): number[] {
    const newOrModIDs = this.newApartment.map(el => el.getAllDescID()).reduce((prevEl, curEl) => curEl.concat(prevEl))
    return this.loadContent.getApartmentDescription().map(el => el.ID).concat(newOrModIDs);
  }
  public getAllPriceID(): number[] {
    const newOrModIDs = this.newApartment.map(el => el.getAllPriceID()).reduce((prevEl, curEl) => curEl.concat(prevEl))
    return this.loadContent.getApartmentPrice().map(el => el.ID).concat(newOrModIDs);
  }
  public getAllDetailsRelationID(): number[] {
    const newOrModIDs = this.newApartment.map(el => el.getAllDetailsRelationID()).reduce((prevEl, curEl) => curEl.concat(prevEl))
    return this.loadContent.getDetailsToApartment().map(el => el.ID).concat(newOrModIDs);
  }
}
