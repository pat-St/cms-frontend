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
export class InfoTextService {
  newInfoText: Array<NewInfoTextToTile> = new Array();

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

    } else {
      console.log("await for info text");
      setTimeout( () => this.loadNewContent(count - 1), count * 500 );
    }
  }
  reset() {
    this.newInfoText = new Array();
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

  private sendDelete() {
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
  }

  private sendUpdate() {
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
  }

  private sendNew() {
    Promise.resolve(
      this.newInfoText
        .filter(el => !el.deleteEntry)
        .map(el => el.infoText)
        .filter(el => !this.loadContent.infoText.map(s => s.ID).find(s => s === el.ID))
    )
    .then((res) =>  this.backend.createToBackend("info_text", res.map(el => el)).toPromise())
    .then((res) =>  this.newInfoText
      .filter(el => !el.deleteEntry)
      .map(el => el.relation)
      .filter(el => !this.loadContent.infoTextToTile.map(s => s.ID).find(s => s === el.ID))
    )
    .then((res) => this.backend.createToBackend("info_text_to_tile", res.map(el => el)).toPromise())
    .catch((err) => {
      console.log("error by send infotext new entities: " + JSON.stringify(err));
    });
  }

  public sendChangesToBackend() {
    // send delete
    this.sendDelete();

    // send updates
    this.sendUpdate();

    // send new
    this.sendNew();
  }

  public sendSpecificChangesToBackend(objs: NewInfoTextToTile) {
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
}
