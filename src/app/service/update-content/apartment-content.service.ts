import { resolve } from 'path';
import { ImageContentService } from './image-content.service';
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

  constructor(
    private backend: BackendRequestService, 
    private loadContent: LoadContentService,
    private imageContent: ImageContentService) { }

  public nextIdOf(itemColl: Array<number>): number { 
    if (itemColl.length < 2) { 
      return itemColl.length
    }
    return itemColl.reduce((currN, nextN) => currN > nextN ? currN : nextN) + 1; }

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
      const content = Object.assign({},element)
      const nDesc = desc.filter(el => el.fk_apartment === element.ID).map(i => Object.assign({},i))
      const nPrice = price.filter(el => el.fk_apartment === element.ID).map(i => Object.assign({},i))
      const nDetails = details.filter(el => el.fk_apartment === element.ID).map(i => Object.assign({},i))
      const apartmentEntity = new NewApartmentObject(content, nDesc, nPrice, nDetails);
      this.newApartment.push(apartmentEntity);
    });
  }
  
  public getNextApartmentTile(tileId: number): boolean {
    const nextApartmentID = this.nextIdOf(this.newApartment.map(el => el.content.ID));
    const apartment = new ApartmentContent(nextApartmentID, tileId);
    const nextDesc = this.nextIdOf(this.getAllApartmentDescriptionID());
    const desc = new Array(new ApartmentDescription(nextDesc, "", "", nextApartmentID));
    const nextPrice = this.nextIdOf(this.getAllPriceID());
    const price = new Array(new ApartmentPrice(nextPrice,"", "", "", "", nextApartmentID));
    this.newApartment.push(new NewApartmentObject(apartment, desc, price, new Array()));
    return true;
  }

  public deleteNextApartment(obj: NewApartmentObject): boolean {
    const index = this.newApartment.findIndex(el => el.content.ID === obj.content.ID)
    if (index >= 0) {
      obj.description.forEach(element => element.deleteEntry = true);
      obj.price.forEach(element => element.deleteEntry = true);
      obj.detailsToApartment.forEach(element => element.deleteEntry = true);
      this.imageContent.getImageByFkId(obj.content.ID).forEach(element => this.imageContent.deleteNewImage(element));
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
  private sendDelete(): Promise<any> {
    return Promise.resolve(true)
    // Details to Apartment
    .then(() =>
      this.newApartment
        .map(el => el.detailsToApartment.filter(i => i.deleteEntry))
    )
    .then((el) => {
      if (el.length > 1) {
        return el.reduce((prevColl, currColl) => currColl.concat(prevColl));
      }
      if (el.length > 0) {
        return el.map(i => i[0]);
      }
      return [];
    })
    .then((res) => {
      if (res.length > 0) {
        return Promise.all(res.map( el => 
          this.backend.deleteToBackend("details_to_apartment", el.ID).toPromise()
        ))
      } 
      return [];
    })
    .catch((err) => {
      console.log("error by send apartment details delete: " + JSON.stringify(err));
    })
    // Apartment Description
    .then(() =>
      this.newApartment
        .map(el => el.description.filter(i => i.deleteEntry))
    )
    .then((el) => {
      if (el.length > 1) {
        return el.reduce((prevColl, currColl) => currColl.concat(prevColl));
      }
      if (el.length > 0) {
        return el.map(i => i[0]);
      }
      return [];
    })
    .then((res) =>
      res.length > 0 ? Promise.all(res.map( el => 
          this.backend.deleteToBackend("apartment_desc", el.ID).toPromise()
      )): []
    )
    .catch((err) => {
      console.log("error by send apartment desc delete: " + JSON.stringify(err));
    })
    // Apartment Price
    .then(() =>
      this.newApartment
        .map(el => el.price.filter(i => i.deleteEntry))
    )
    .then((el) => {
      if (el.length > 1) {
        return el.reduce((prevColl, currColl) => currColl.concat(prevColl));
      }
      if (el.length > 0) {
        return el.map(i => i[0]);
      }
      return [];
    })
    .then((res) =>
      res.length > 0 ? Promise.all(res.map( el => 
        this.backend.deleteToBackend("apartment_price", el.ID).toPromise()
      )) : []
    )
    .catch((err) => {
      console.log("error by send apartment price delete: " + JSON.stringify(err));
    })
    // Apartment content
    .then(() =>
      this.newApartment
        .filter(i => i.deleteEntry)
        .map(i => i.content)
    )
    .then((res) =>
    res.length > 0 ? Promise.all(res.map( el => 
        this.backend.deleteToBackend("apartment", el.ID).toPromise()
      )) : []
    )
    .catch((err) => {
      console.log("error by send apartment delete: " + JSON.stringify(err));
    });
  }

  private sendUpdate() {
    return Promise.resolve(true)
    .then((_) =>
      this.newApartment
      .map(el => el.description.filter(i => this.loadContent.getApartmentDescription().findIndex(n => n.ID === i.ID) > -1))
    )
    .then((res) =>
        res.length > 1 ? res.reduce((prevColl, currColl) => currColl.concat(prevColl)) : res.map(el => el[0])
    )
    .then((res) =>
      res.filter(el => JSON.stringify(el) !== JSON.stringify(this.loadContent.getApartmentDescription().find(i => i.ID === el.ID))) 
    )
    .then((res) =>
      res.length > 0 ? this.backend.updateToBackend("apartment_desc", res).toPromise() : true
    )
    .then((_) =>
      this.newApartment
      .map(el => el.price.filter(i => this.loadContent.getApartmentPrice().findIndex(n => n.ID === i.ID) > -1))
    )
    .then((res) =>
        res.length > 1 ? res.reduce((prevColl, currColl) => currColl.concat(prevColl)) : res.map(el => el[0])
    )
    .then((res) =>
      res.filter(el => JSON.stringify(el) !== JSON.stringify(this.loadContent.getApartmentPrice().find(i => i.ID === el.ID)))
    )
    .then((res) =>
      res.length > 0 ? this.backend.updateToBackend("apartment_price", res).toPromise() : true
    )
    .then((_) =>
      this.newApartment
      .map(el => el.detailsToApartment.filter(i => this.loadContent.getDetailsToApartment().findIndex(n => n.ID === i.ID) > -1))      
    )
    .then((res) =>
        res.length > 1 ? res.reduce((prevColl, currColl) => currColl.concat(prevColl)) : res.map(el => el[0])
    )
    .then((res) =>
        res.filter(el => JSON.stringify(el) !== JSON.stringify(this.loadContent.getDetailsToApartment().find(i => i.ID === el.ID)))
    )
    .then((res) =>
      res.length > 0 ? this.backend.updateToBackend("details_to_apartment", res).toPromise() : true
    )
    .then((_) =>
      this.newApartment
      .filter(i => this.loadContent.getApartmentContent().findIndex(n => n.ID === i.content.ID) > -1)
      .map(i => i.content)
      .filter(el => JSON.stringify(el) !== JSON.stringify(this.loadContent.getApartmentContent().find(i => i.ID === el.ID)))
    )
    .then((res) =>
      res.length > 0 ? this.backend.updateToBackend("apartment", res).toPromise() : true
    )
    .catch((err) => {
      console.log("error by trigger update apartment: " + JSON.stringify(err));
    })
  }

  sendNew() {
    return Promise.resolve(true)
    // Apartment Content
    .then(() =>
      this.newApartment
        .filter(i => this.loadContent.getApartmentContent().findIndex(n => n.ID === i.content.ID) < 0)
        .map(i => i.content)
    )
    .then((el) =>
      el.length > 0 ? this.backend.createToBackend("apartment", el).toPromise() : true
    )
    // Apartment Description
    .then(() =>
      this.newApartment
      .map(el => el.description.filter(i => this.loadContent.getApartmentDescription().findIndex(n => n.ID === i.ID) < 0))
    )
    .then((res) =>
      res.length > 1 ? res.reduce((prevColl, currColl) => currColl.concat(prevColl)) : res.map(es => es[0]).filter(es => es != null)
    )
    .then((el) =>
      el.length > 0 ? this.backend.createToBackend("apartment_desc", el).toPromise() : true
    )
    // Apartment Details
    .then((_) =>
      this.newApartment
      .map(el => el.detailsToApartment.filter(i => this.loadContent.getDetailsToApartment().findIndex(n => n.ID === i.ID) < 0))
    )
    .then((res) =>
      res.length > 1 ? res.reduce((prevColl, currColl) => currColl.concat(prevColl)) : res.map(es => es[0]).filter(es => es != null)
    )
    .then((res) =>
      res.length > 0 ? this.backend.createToBackend("details_to_apartment", res).toPromise() : true
    )
    // Apartment Price
    .then( (_) =>
      this.newApartment
      .map(el => el.price.filter(i => this.loadContent.getApartmentPrice().findIndex(n => n.ID === i.ID) < 0))
    )
    .then((res) =>
      res.length > 1 ? res.reduce((prevColl, currColl) => currColl.concat(prevColl)) : res.map(es => es[0]).filter(es => es != null)
    )
    .then((res) =>
      res.length > 0 ? this.backend.createToBackend("apartment_price", res).toPromise() : true
    )
    .catch((err) => {
      console.log("error by trigger changes apartment: " + JSON.stringify(err));
    })
  }

  public sendChangesToBackend() {
    return Promise.resolve(true)
    .then(() => this.sendUpdate())
    .then(() => this.sendDelete())
    .catch((err) => {
      console.log("error by trigger apartment: " + JSON.stringify(err));
    })
  }

  public sendSpecificChangesToBackend(objs: NewApartmentObject) {
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
  }

  public getAllApartmentDescriptionID(): number[] {
    const newOrModIDs = this.newApartment.map(el => el.getAllDescID())
    const flattenIDs = newOrModIDs.length > 1 ? newOrModIDs.reduce((prevEl, curEl) => curEl.concat(prevEl)) : newOrModIDs.map(el => el[0])
    return this.loadContent.getApartmentDescription().map(el => el.ID).concat(flattenIDs);
  }
  public getAllPriceID(): number[] {
    const newOrModIDs = this.newApartment.map(el => el.getAllPriceID())
    const flattenIDs = newOrModIDs.length > 1 ? newOrModIDs.reduce((prevEl, curEl) => curEl.concat(prevEl)) : newOrModIDs.map(el => el[0])
    return this.loadContent.getApartmentPrice().map(el => el.ID).concat(flattenIDs);
  }
  public getAllDetailsRelationID(): number[] {
    const newOrModIDs = this.newApartment.map(el => el.getAllDetailsRelationID())
    const flattenIDs = newOrModIDs.length > 1 ? newOrModIDs.reduce((prevEl, curEl) => curEl.concat(prevEl)) : newOrModIDs.map(el => el[0])
    return this.loadContent.getDetailsToApartment().map(el => el.ID).concat(flattenIDs);
  }
}
