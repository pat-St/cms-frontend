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
export class ApartmentDetailsContentService {
  newApartmentDetails: Array<ApartmentDetails> = new Array();

  constructor(private backend: BackendRequestService, private loadContent: LoadContentService) { }
  
  public nextIdOf(itemColl: Array<number>): number { return itemColl.reduce((currN, nextN) => currN > nextN ? currN : nextN) + 1; }

  async loadNewContent(count= 5) {
    if (count < 0) {
      console.warn("could not load content from backend");
      return;
    }
    if (this.loadContent.isApartmentFinished()) {

      const apartmentDetails = this.loadContent.getApartmentDetails();
      this.addDetailsListEntry(apartmentDetails);
    } else {
      console.log("await for apartment");
      setTimeout( () => this.loadNewContent(count - 1), count * 800 );
    }
  }

  reset() {
    this.newApartmentDetails = new Array();
  }
  private addDetailsListEntry(entryObj: ApartmentDetails[]) {
    entryObj.forEach(el => {
      const indexElement = this.newApartmentDetails.findIndex((compE: ApartmentDetails) => compE.ID === el.ID);
      if (indexElement >= 0) {
        this.newApartmentDetails.splice(indexElement, 1);
      }
      this.newApartmentDetails.push(el);
    });
  }
  public deleteNextDetails(obj: ApartmentDetails): boolean {
    const index = this.newApartmentDetails.findIndex(el => el.ID === obj.ID)
    if (index > 0) {
      this.newApartmentDetails[index] = obj.setDelete();
      return true;
    } else {
      return false;
    }
  }


  public updateNextApartment(obj: ApartmentDetails): boolean {
    const index = this.newApartmentDetails.findIndex(el => el.ID === obj.ID)
    if (index > 0) {
      this.newApartmentDetails[index] = obj.setChanged();
      return true;
    } else {
      return false;
    }
  }

  private sendDelete(objs: ApartmentDetails = null) {
    let deleteDescEntities: ApartmentDetails[];
    if (objs) {
      deleteDescEntities =  new Array(objs);
    } else {
      deleteDescEntities = this.newApartmentDetails
      .filter(el => el.deleteEntry);
    }
    deleteDescEntities.forEach( el => {
      this.backend.deleteToBackend("apartment_details", el.ID).subscribe((response: boolean) => {});
    });
  }

  private sendUpdate(objs: ApartmentDetails = null) {
    let updateDescEntities: ApartmentDetails[];
    if (objs) {
      updateDescEntities =  new Array(objs);
    } else {
      updateDescEntities = this.newApartmentDetails
    .filter(el => this.loadContent.getApartmentDetails().findIndex(i => i.ID === el.ID) > -1);
    }
    this.backend.updateToBackend("apartment_details", updateDescEntities).subscribe((response: boolean) => {});
  }

  private sendNew(objs: ApartmentDetails = null) {
    let newDescEntities: ApartmentDetails[];
    if (objs) {
      newDescEntities =  new Array(objs);
    } else {
      newDescEntities = this.newApartmentDetails
    .filter(el => this.loadContent.getApartmentDetails().findIndex(i => i.ID === el.ID) < 0);
    }
    this.backend.updateToBackend("apartment_details", newDescEntities).subscribe((response: boolean) => {});
  }

  public sendChangesToBackend() {
    // send delete
    this.sendDelete();
    // send update
    this.sendUpdate();
    // send new
    this.sendNew();
  }

  public sendSpecificChangesToBackend(objs: ApartmentDetails) {
    // send delete
    this.sendDelete(objs);
    // send update
    this.sendUpdate(objs);
    // send new
    this.sendNew(objs);
  }




}
