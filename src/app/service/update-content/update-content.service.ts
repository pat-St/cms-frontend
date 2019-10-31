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
export class UpdateContentService {
  newApartment: Array<NewApartmentObject> = new Array();
  newApartmentDetails: Array<ApartmentDetails> = new Array();
  newInfoText: Array<NewInfoTextToTile> = new Array();
  newTile: Array<Tile> = new Array();
  newImage: Array<Image> = new Array();

  constructor(private backend: BackendRequestService, private loadContent: LoadContentService) { }

  public nextIdOf(itemColl: Array<number>): number { return itemColl.reduce((currN, nextN) => currN > nextN ? currN : nextN) + 1; }

  async loadNewContent(count= 5) {
    if (count < 0) {
      console.warn("could not load content from backend");
      return;
    }
    if (this.loadContent.isFinished()) {

      const infoTile = this.loadContent.getInfoText();
      const infoTextToTile = this.loadContent.getInfoTextToTile();
      this.addCurrentInfoTextToTile(infoTile, infoTextToTile);

      const apartmentContent = this.loadContent.getApartmentContent();
      const apartmentDescription = this.loadContent.getApartmentDescription();
      const detailsToApartment = this.loadContent.getDetailsToApartment();
      const apartmentPrice = this.loadContent.getApartmentPrice();

      this.addApartmentEntry(apartmentContent, apartmentDescription, apartmentPrice, detailsToApartment);

      const apartmentDetails = this.loadContent.getApartmentDetails();
      this.addDetailsListEntry(apartmentDetails);

      const tileContent = this.loadContent.getTile();
      this.addTileEntry(tileContent);

      const images = this.loadContent.getImages();
      this.addImageEntry(images);

    } else {
      console.log("await for info text");
      setTimeout( () => this.loadNewContent(count - 1), count * 500 );
    }
  }

  private addCurrentInfoTextToTile(entryInfo: InfoText[], relation: InfoTextToTile[]) {
    relation.forEach(el => {
      const infoTileEntry = entryInfo.find(obj => obj.ID === el.ID);
      if (infoTileEntry) {
        const newInftoTile = new NewInfoTextToTile(infoTileEntry, el);
        this.updateNextInfoTile(newInftoTile);
      }
    });
  }

  public getNextInfoTile(tileId: number): boolean {
    if (this.loadContent.isFinished()) {
      const nextInfoTextToTileID: number = this.nextIdOf(
        this.loadContent.getInfoTextToTile().map(el => el.ID).concat(this.newInfoText.map(el => el.relation.ID))
      );
      const nextInfoTextID: number = this.nextIdOf(
        this.loadContent.getInfoText().map(el => el.ID).concat(this.newInfoText.map(el => el.infoText.ID))
        );
      const newInfoTextToTile = new InfoTextToTile(nextInfoTextToTileID, nextInfoTextID, tileId);
      const newInfoText = new InfoText(nextInfoTextID, null, null, null);
      const newInfoTextToTileEntry = new NewInfoTextToTile(newInfoText, newInfoTextToTile);
      this.newInfoText.push(newInfoTextToTileEntry);
      return true;
    } else {
      return false;
    }
  }

  public deleteNextInfoTile(entryObj: NewInfoTextToTile) {
    const foundIndex = this.newInfoText.findIndex(el => el === entryObj);
    if (foundIndex >= 0) {
      this.newInfoText[foundIndex] = this.newInfoText[foundIndex].setDelete();
    }
    if (foundIndex >= 0 && entryObj.infoText.ID === null && entryObj.relation.ID === null) {
      this.newInfoText.splice(foundIndex, 1);
    }
  }

  public updateNextInfoTile(entryObj: NewInfoTextToTile) {
    const foundIndex = this.newInfoText.findIndex(el => el === entryObj);
    if (foundIndex >= 0) {
      this.newInfoText[foundIndex] = entryObj.setChanged();
    } else {
      this.newInfoText.push(entryObj.setChanged());
    }
  }

  async sendUpdateToBackend() {
    this.sendNextInfoTextTileChangesToBackend();
    this.sendNextApartmentChangesToBackend();
    this.sendNextImageChangesToBackend();
    this.sendNewTileChangesToBackend();
  }

  public sendNextInfoTextTileChangesToBackend() {
    // send delete
    Promise.resolve(this.newInfoText.filter(el => el.deleteEntry))
    .then((res) => {
      res.map(el => el.infoText).forEach((el, i) => {
        this.backend.deleteToBackend("info_text", el.ID).subscribe((response: boolean) => {});
      });
      return res;
    })
    .then((res) => {
      res.map(el => el.relation).forEach((el, i) => {
        this.backend.deleteToBackend("info_text_to_tile", el.ID).subscribe((response: boolean) => {
        });
      });
      return res;
    })
    .then((res) => {
      res
        .map(el =>  this.newInfoText.findIndex(item => item === el))
        .filter(i => i > 0)
        .forEach(i => this.newInfoText.splice(i, 1));
    })
    .catch((err) => {
      console.log("error by send infotext updates: " + JSON.stringify(err));
    });

    // send updates
    Promise.resolve(
      this.newInfoText
        .filter(el => !el.deleteEntry)
        .map(el => el.infoText)
        .filter(el => this.loadContent.infoText.map(s => s.ID).find(s => s === el.ID))
    )
    .then((res: InfoText[]) => {
      return this.backend.updateToBackend("info_text", res).toPromise();
    })
    .then((res) => {
      return this.newInfoText
        .filter(el => !el.deleteEntry)
        .map(el => el.relation)
        .filter(el => this.loadContent.infoTextToTile.map(s => s.ID).find(s => s === el.ID));
    })
    .then((res: InfoTextToTile[]) => {
      return this.backend.updateToBackend("info_text_to_tile", res).toPromise();
    })
    .then((res) => {
      this.newInfoText.forEach(el => { el = el.changed ? el.changeBack() : el; });
    })
    .catch((err) => {
      console.log("error by send infotext updates: " + JSON.stringify(err));
    });

    // send new
    Promise.resolve(
      this.newInfoText
        .filter(el => !el.deleteEntry)
        .map(el => el.infoText)
        .filter(el => !this.loadContent.infoText.map(s => s.ID).find(s => s === el.ID))
    )
    .then((res) => {
      return this.backend.createToBackend("info_text", res.map(el => el)).toPromise();
    })
    .then((res) => {
      return this.newInfoText
        .filter(el => !el.deleteEntry)
        .map(el => el.relation)
        .filter(el => !this.loadContent.infoTextToTile.map(s => s.ID).find(s => s === el.ID));
    })
    .then((res) => {
      return this.backend.createToBackend("info_text_to_tile", res.map(el => el)).toPromise();
    })
    .catch((err) => {
      console.log("error by send infotext new entities: " + JSON.stringify(err));
    });
  }

  public sendSpecificNextInfoTextTileChangesToBackend(objs: NewInfoTextToTile) {
    const checkObjExists = (o: NewInfoTextToTile): boolean => {
      return this.loadContent.infoText.map(s => s.ID).find(s => s === o.infoText.ID) >= 0 &&
      this.loadContent.infoTextToTile.map(s => s.ID).find(s => s === o.relation.ID) >= 0;
    };
    if (checkObjExists(objs) && objs.deleteEntry) {
      console.log("delete objs" + JSON.stringify(objs))
      this.backend.deleteToBackend("info_text", objs.infoText.ID).subscribe((response: boolean) => {});
      this.backend.deleteToBackend("info_text_to_tile", objs.relation.ID).subscribe((response: boolean) => {});
    } else if (checkObjExists(objs) && !objs.deleteEntry) {
      console.log("update objs" + JSON.stringify(objs))
      this.backend.updateToBackend("info_text", new Array<InfoText>(objs.infoText)).subscribe((response: boolean) => {});
      this.backend.updateToBackend("info_text_to_tile", new Array<InfoTextToTile>(objs.relation)).subscribe((response: boolean) => {});
    } else {
      console.log("create objs" + JSON.stringify(objs))
      this.backend.createToBackend("info_text", new Array<InfoText>(objs.infoText)).subscribe((response: boolean) => {});
      this.backend.createToBackend("info_text_to_tile", new Array<InfoTextToTile>(objs.relation)).subscribe((response: boolean) => {});
    }
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

  private addTileEntry(entryObject: Tile[]) {
    entryObject.forEach((element: Tile) => {
      const indexElement = this.newTile.findIndex((compE: Tile) => compE.ID === element.ID)
      if (indexElement >= 0) {
        this.newTile.splice(indexElement, 1);
      }
      this.newTile.push(element);
    });
  }

  public getNextNewTile(): boolean {
    if (this.loadContent.isFinished()) {
      const nextID = this.nextIdOf(this.newTile.map(el => el.ID))
      this.newTile.push(new Tile(nextID));
      return true;
    }
    return false;
  }

  public updateNewTile(obj: Tile): boolean {
    const index = this.newTile.findIndex(el => el.ID === obj.ID);
    if (index > -1) {
      this.newTile[index] = this.newTile[index].setChanged()
      return true;
    }
    return false;
  }

  public deleteNewTile(obj: Tile): boolean {
    const index = this.newTile.findIndex(el => el.ID === obj.ID);
    if (index > -1) {
      this.newTile[index] = this.newTile[index].setDelete()
      return true;
    }
    return false;
  }

  public sendNewTileChangesToBackend() {
    // send delete
    Promise.resolve(this.newTile.filter(el => el.deleteEntry))
    .then((el) => {
      el.map(i => {
        this.backend.deleteToBackend("tile",i.ID).toPromise();
      })
    })
    .then((el) => {
      this.newTile.filter(i => i.deleteEntry).forEach(i => {
        const index = this.newTile.findIndex(item => item.ID === i.ID);
        if (index > -1) {
          this.newTile.splice(index, 1);
          return true;
        }
      });
    })
    .catch((err) => {
      console.log("error by send tile delete entities: " + JSON.stringify(err));
    });

    // send update
    Promise.resolve(
      this.newTile.filter(el => this.loadContent.getTile().findIndex(i => i.ID === el.ID) > -1)
    )
    .then((el) => {
      this.backend.updateToBackend("tile", el).toPromise();
    })
    .catch((err) => {
      console.log("error by send delete images: " + JSON.stringify(err));
    });

    // send update
    Promise.resolve(
      this.newTile.filter(el => this.loadContent.getTile().findIndex(i => i.ID === el.ID) < 0)
    )
    .then((el) => {
      this.backend.createToBackend("tile", el).toPromise();
    })
    .catch((err) => {
      console.log("error by send delete images: " + JSON.stringify(err));
    });
  }

  public sendSpecificNewTileChangesToBackend(obj: Tile) {
    // send delete
    Promise.resolve(obj.deleteEntry ? obj: null)
    .then((el) => {
        this.backend.deleteToBackend("tile",el.ID).toPromise();
    })
    .then((el) => {
      const index = this.newTile.findIndex(item => item.ID === obj.ID);
      if (index > -1) {
        this.newTile.splice(index, 1);
      }
    })
    .catch((err) => {
      console.log("error by send tile delete entities: " + JSON.stringify(err));
    });

    // send update
    Promise.resolve(
      this.loadContent.getTile().findIndex(i => i.ID === obj.ID) > -1 ? obj : null
    )
    .then((el) => {
      this.backend.updateToBackend("tile", new Array(el)).toPromise();
    })
    .catch((err) => {
      console.log("error by send delete images: " + JSON.stringify(err));
    });

    // send update
    Promise.resolve(
      this.loadContent.getTile().findIndex(i => i.ID === obj.ID) < 0 ? obj : null
    )
    .then((el) => {
      this.backend.createToBackend("tile", new Array(el)).toPromise();
    })
    .catch((err) => {
      console.log("error by send delete images: " + JSON.stringify(err));
    });
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

  public createNextApartment(tileId: number): boolean {
    if (this.loadContent.isFinished()) {
      const nextApartmentID = this.nextIdOf(this.loadContent.apartmentContent.map(el => el.ID));
      const apartment = new ApartmentContent(nextApartmentID, tileId);
      const nextDesc = this.nextIdOf(this.getAllApartmentDescriptionID());
      const desc = new Array(new ApartmentDescription(nextDesc, null, null, nextApartmentID));
      const nextPrice = this.nextIdOf(this.getAllPriceID());
      const price = new Array(new ApartmentPrice(nextPrice,null,null,null,nextApartmentID));
      this.newApartment.push(new NewApartmentObject(apartment,desc,price, new Array()));
      return true;
    } else {
      return false;
    }
  }

  public deleteNextApartment(obj: NewApartmentObject): boolean {
    const index = this.newApartment.findIndex(el => el.content.ID === obj.content.ID)
    if (index > 0) {
      obj.description.forEach(element => element = element.setDelete());
      obj.price.forEach(element => element = element.setDelete());
      obj.detailsToApartment.forEach(element => element = element.setDelete());
      this.newApartment[index] = obj.setDelete();
      return true;
    } else {
      return false;
    }
  }
  public updateNextApartment(obj: NewApartmentObject): boolean {
    const index = this.newApartment.findIndex(el => el.content.ID === obj.content.ID)
    if (index > 0) {
      this.newApartment[index] = obj.setChanged();
      return true;
    } else {
      return false;
    }
  }

  public sendNextApartmentChangesToBackend() {
    // send delete
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

    // send update
    const updateDescEntities: ApartmentDescription[] = this.newApartment
      .map(el => el.description.filter(i => this.loadContent.getApartmentDescription().findIndex(el => el.ID === i.ID) > -1))
      .reduce((prevColl, currColl) => currColl.concat(prevColl));
    const updatePriceEntities: ApartmentPrice[] = this.newApartment
      .map(el => el.price.filter(i => this.loadContent.getApartmentPrice().findIndex(el => el.ID === i.ID) > -1))
      .reduce((prevColl, currColl) => currColl.concat(prevColl));
    const updateDetailsRelation: DetailsToApartment[] = this.newApartment
      .map(el => el.detailsToApartment.filter(i => this.loadContent.getDetailsToApartment().findIndex(el => el.ID === i.ID) > -1))
      .reduce((prevColl, currColl) => currColl.concat(prevColl));
    const updateApartmentEntitites: ApartmentContent[] = this.newApartment
      .filter(i => this.loadContent.getApartmentContent().findIndex(el => el.ID === i.content.ID) > -1)
      .map(i => i.content);

    this.backend.updateToBackend("apartment_desc", updateDescEntities).subscribe((response: boolean) => {});
    this.backend.updateToBackend("apartment_price", updatePriceEntities).subscribe((response: boolean) => {});
    this.backend.updateToBackend("details_to_apartment", updateDetailsRelation).subscribe((response: boolean) => {});
    this.backend.updateToBackend("apartment", updateApartmentEntitites).subscribe((response: boolean) => {});

    // send new
    const newDescEntities: ApartmentDescription[] = this.newApartment
      .map(el => el.description.filter(i => updateDescEntities.findIndex( el => el.ID === i.ID) < 0))
      .reduce((prevColl, currColl) => currColl.concat(prevColl));
    const newPriceEntities: ApartmentPrice[] = this.newApartment
      .map(el => el.price.filter(i => updatePriceEntities.findIndex(el => el.ID === i.ID) < 0))
      .reduce((prevColl, currColl) => currColl.concat(prevColl));
    const newDetailsRelation: DetailsToApartment[] = this.newApartment
      .map(el => el.detailsToApartment.filter(i => updateDetailsRelation.findIndex(el => el.ID === i.ID) < 0))
      .reduce((prevColl, currColl) => currColl.concat(prevColl));
    const newApartmentEntitites: ApartmentContent[] = this.newApartment
      .filter(i => updateApartmentEntitites.findIndex(el => el.ID === i.content.ID) < 0)
      .map(i => i.content);

    this.backend.createToBackend("apartment", newApartmentEntitites).subscribe((response: boolean) => {});
    this.backend.createToBackend("apartment_desc", newDescEntities).subscribe((response: boolean) => {});
    this.backend.createToBackend("apartment_price", newPriceEntities).subscribe((response: boolean) => {});
    this.backend.createToBackend("details_to_apartment", newDetailsRelation).subscribe((response: boolean) => {});
  }

  public sendSpecificNextApartmentChangesToBackend(objs: NewApartmentObject) {
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

  private addImageEntry(entryObject: Image[]) {
    entryObject.forEach((element: Image) => {
      const indexElement = this.newImage.findIndex((compE: Image) => compE.ID === element.ID)
      if (indexElement >= 0) {
        this.newImage.splice(indexElement, 1);
      }
      this.newImage.push(element);
    });
  }

  public getNextNewImage(tileID: number = null, apartmentID: number = null, infoTetxId: number = null): boolean {
    if (this.loadContent.isFinished()) {
      const nextImageID = this.nextIdOf(
        this.loadContent.getImages().map(el => el.ID).concat(this.newImage.map(el => el.ID))
      );
      this.newImage.push(new Image(nextImageID, null, null, apartmentID, infoTetxId, tileID));
      return true;
    } else {
      return false;
    }
  }

  public deleteNewImage(obj: Image): boolean {
    const index = this.newImage.findIndex(el => el.ID === obj.ID);
    if (index > -1) {
      this.newImage[index] = this.newImage[index].setDelete();
      return true;
    }
    return false;
  }

  public updateNewImage(obj: Image): boolean {
    const index = this.newImage.findIndex(el => el.ID === obj.ID);
    if (index > -1) {
      this.newImage[index] = this.newImage[index].setChanged();
      return true;
    }
    return false; 
  }

  public sendNextImageChangesToBackend() {
    // send delete
    Promise.resolve(
      this.newImage.filter(el => el.deleteEntry)
    )
    .then((el) => {
      return el.map(i => this.backend.deleteToBackend("image",i.ID).toPromise());
    })
    .then((el) => {
      const list = this.newImage.filter( el => el.deleteEntry).forEach( i => {
        const index = this.newImage.indexOf(i);
        if (index > -1) {
          this.newImage.splice(index, 1);
        }
      });
    })
    .catch((err) => {
      console.log("error by send delete images: " + JSON.stringify(err));
    });

    // send update
    Promise.resolve(
      this.newImage.filter(el => this.loadContent.getImages().findIndex(i => i.ID === el.ID) > -1)
    )
    .then((el) => {
      this.backend.updateToBackend("image",el).toPromise();
    })
    .catch((err) => {
      console.log("error by send delete images: " + JSON.stringify(err));
    });

    // send update
    Promise.resolve(
      this.newImage.filter(el => this.loadContent.getImages().findIndex(i => i.ID === el.ID) < 0)
    )
    .then((el) => {
      this.backend.createToBackend("image", el).toPromise();
    })
    .catch((err) => {
      console.log("error by send delete images: " + JSON.stringify(err));
    });
  }

  public sendSpecificNextImageChangesToBackend(obj: Image) {
    // send delete
    Promise.resolve(
      obj.deleteEntry ? obj : null
    )
    .then((el) => {
      return this.backend.deleteToBackend("image",el.ID).toPromise();
    })
    .catch((err) => {
      console.log("error by send delete images: " + JSON.stringify(err));
    });

    // send update
    Promise.resolve(
      this.newImage.filter(el => this.loadContent.getImages().findIndex(i => i.ID === el.ID) > -1)
    )
    .then((el) => {
      this.backend.updateToBackend("image",el).toPromise();
    })
    .catch((err) => {
      console.log("error by send delete images: " + JSON.stringify(err));
    });

    // send update
    Promise.resolve(
      this.newImage.filter(el => this.loadContent.getImages().findIndex(i => i.ID === el.ID) < 0)
    )
    .then((el) => {
      this.backend.createToBackend("image", el).toPromise();
    })
    .catch((err) => {
      console.log("error by send delete images: " + JSON.stringify(err));
    });
  }

  public getImageByFkId(apartmentId: number = null, infoId: number = null, tileId: number = null): Image[] {
    if (apartmentId) {
      return this.newImage.filter( eachObject => eachObject.fk_apartment === apartmentId);
    }
    if (infoId) {
      return this.newImage.filter( eachObject => eachObject.fk_info === infoId);
    }
    if (tileId) {
      return this.newImage.filter( eachObject => eachObject.fk_tile === tileId);
    }
    return null;
  }

  public hasImageByFkId(apartmentId: number = null, infoId: number = null, tileId: number = null): boolean {
    if (apartmentId) {
      return this.newImage.map( element => element.fk_apartment).includes(apartmentId);
    }
    if (infoId) {
      return this.newImage.map( element => element.fk_info).includes(infoId);
    }
    if (tileId) {
      return this.newImage.map( element => element.fk_tile).includes(tileId);
    }
    return false;
  }


}
