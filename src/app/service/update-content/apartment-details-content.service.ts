import { filter } from 'minimatch';
import { ApartmentDetails } from './../../model/apartment';
import { LoadContentService } from './../load-content/load-content.service';
import { BackendRequestService } from './../backend-request/backend-request.service';
import { Injectable } from '@angular/core';
import { JsonPipe } from '@angular/common';


@Injectable({
  providedIn: 'root'
})
export class ApartmentDetailsContentService {
  newApartmentDetails: Array<ApartmentDetails> = new Array();

  constructor(private backend: BackendRequestService, private loadContent: LoadContentService) { }

  public nextIdOf(itemColl: Array<number>): number {
    if (itemColl.length < 2) {
      return itemColl.length;
    }
    return itemColl.reduce((currN, nextN) => currN > nextN ? currN : nextN) + 1; }

  async loadNewContent(count= 5) {
    if (count < 0) {
      console.warn('could not load content from backend');
      return;
    }
    if (this.loadContent.isApartmentFinished()) {
      const apartmentDetails = this.loadContent.getApartmentDetails();
      this.addDetailsListEntry(apartmentDetails);
    } else {
      console.log('await for apartment');
      setTimeout( () => this.loadNewContent(count - 1), count * 1000 );
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
      this.newApartmentDetails.push(Object.assign({}, el));
    });
  }

  addDetailsEntry(entryObj: ApartmentDetails) {
    const indexElement = this.newApartmentDetails.findIndex((compE: ApartmentDetails) => compE.ID === entryObj.ID);
    if (indexElement >= 0) {
      this.newApartmentDetails.splice(indexElement, 1);
    }
    this.newApartmentDetails.push(Object.assign({}, entryObj));
  }

  public deleteNextDetails(obj: ApartmentDetails): boolean {
    const index = this.newApartmentDetails.findIndex(el => el.ID === obj.ID);
    if (index >= 0) {
      this.newApartmentDetails[index].deleteEntry = true;
      return true;
    } else {
      return false;
    }
  }

  public updateNextApartment(obj: ApartmentDetails): boolean {
    const index = this.newApartmentDetails.findIndex(el => el.ID === obj.ID);
    if (index >= 0) {
      this.newApartmentDetails[index].changed = true;
      return true;
    } else {
      return false;
    }
  }

  public getDeleteDetailsChanges(singleImage: ApartmentDetails = null): ApartmentDetails[] {
    const listOfImages = singleImage ? new Array(singleImage) : this.newApartmentDetails;
    return listOfImages.filter(i => i.deleteEntry);
  }

  private sendDelete(objs: ApartmentDetails = null) {
    const deleteDescEntities: ApartmentDetails[] = this.getDeleteDetailsChanges(objs);
    return deleteDescEntities.map( el => {
      this.backend.deleteToBackend('apartment_details', el.ID).toPromise();
    });
  }

  public getUpdateDetailsChanges(singleImage: ApartmentDetails = null): ApartmentDetails[] {
    const listOfImages = singleImage ? new Array(singleImage) : this.newApartmentDetails;
    return listOfImages
      .filter(el => this.loadContent.getApartmentDetails().findIndex(i => i.ID === el.ID) > -1)
      .filter(el => JSON.stringify(el) !== JSON.stringify(this.loadContent.getApartmentDetails().find(i => i.ID === el.ID)));
  }

  private sendUpdate(objs: ApartmentDetails = null) {
    const updateDescEntities: ApartmentDetails[] = this.getUpdateDetailsChanges(objs);
    return updateDescEntities.length > 0 ? this.backend.updateToBackend('apartment_details', updateDescEntities).toPromise() : true;
  }

  public getNewDetailsChanges(singleImage: ApartmentDetails = null): ApartmentDetails[] {
    const listOfImages = singleImage ? new Array(singleImage) : this.newApartmentDetails;
    return listOfImages.filter(i => this.loadContent.getApartmentDetails().findIndex(n => n.ID === i.ID) < 0);
  }

  sendNew(objs: ApartmentDetails = null) {
    const newDescEntities: ApartmentDetails[] = this.getNewDetailsChanges(objs);
    return newDescEntities.length > 0 ? this.backend.createToBackend('apartment_details', newDescEntities).toPromise() : true;
  }

  public sendChangesToBackend() {
    // send update
    return Promise.resolve(this.sendUpdate())
    // send new
   // .then(() => this.sendNew())
    // send delete
    .then(() => this.sendDelete());
  }

  public sendSpecificChangesToBackend(objs: ApartmentDetails) {
    // send update
    return Promise.resolve(this.sendUpdate(objs))
    // send new
    .then(() => this.sendNew(objs))
    // send delete
    .then(() => this.sendDelete(objs));
  }
}
