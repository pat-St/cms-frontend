import { ImageContentService } from './image-content.service';
import { InfoTextToTile, InfoText, NewInfoTextToTile } from 'src/app/model/infoText';
import { LoadContentService } from './../load-content/load-content.service';
import { BackendRequestService } from './../backend-request/backend-request.service';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class InfoTextService {
  newInfoText: Array<NewInfoTextToTile> = new Array();

  constructor(
    private backend: BackendRequestService,
    private loadContent: LoadContentService,
    private imageContent: ImageContentService) { }

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
    if (this.loadContent.isFinished()) {

      const infoTile = this.loadContent.getInfoText();
      const infoTextToTile = this.loadContent.getInfoTextToTile();
      this.addCurrentInfoTextToTile(infoTile, infoTextToTile);

    } else {
      console.log('await for info text');
      setTimeout( () => this.loadNewContent(count - 1), count * 1000 );
    }
  }
  reset() {
    this.newInfoText = new Array();
  }

  private addCurrentInfoTextToTile(entryInfo: InfoText[], relation: InfoTextToTile[]) {
    relation.forEach(el => {
      const infoTileEntry = Object.assign({}, entryInfo.find(obj => obj.ID === el.ID));
      if (infoTileEntry) {
        const newInftoTile = new NewInfoTextToTile(infoTileEntry, Object.assign({}, el));
        this.updateNextInfoTile(newInftoTile);
      }
    });
  }

  public getNextInfoTile(tileId: number): boolean {
    const nextRelationID: number = this.newInfoText.length > 1 ? this.nextIdOf(
      this.loadContent.getInfoTextToTile().map(el => el.ID).concat(this.newInfoText.map(el => el.relation.ID))
    ) : this.newInfoText.length;

    const nextInfoTextID: number = this.newInfoText.length > 1 ? this.nextIdOf(
      this.loadContent.getInfoText().map(el => el.ID).concat(this.newInfoText.map(el => el.infoText.ID))
    ) : this.newInfoText.length;

    const newInfoTextToTile = new InfoTextToTile(nextRelationID, nextInfoTextID, tileId);
    const newInfoText = new InfoText(nextInfoTextID, '', '', '');
    const newInfoTextToTileEntry = new NewInfoTextToTile(newInfoText, newInfoTextToTile);
    this.newInfoText.push(newInfoTextToTileEntry);
    return true;
  }

  public deleteNextInfoTile(entryObj: NewInfoTextToTile) {
    const foundIndex = this.newInfoText.findIndex(el => el === entryObj);
    if (foundIndex >= 0) {
      this.imageContent
        .getImageByFkId(null, entryObj.infoText.ID, null)
        .forEach(element => this.imageContent.deleteNewImage(element));
      this.newInfoText[foundIndex].deleteEntry = true;
    }
  }

  public updateNextInfoTile(entryObj: NewInfoTextToTile) {
    const foundIndex = this.newInfoText.findIndex(el => el === entryObj);
    if (foundIndex >= 0) {
      this.newInfoText[foundIndex].changed = true;
    } else {
      this.newInfoText.push(entryObj.setChanged());
    }
  }

  public getDeleteChanges(entryObj: NewInfoTextToTile = null): NewInfoTextToTile[] {
    const listOfTextToTile = entryObj ? new Array(entryObj) : this.newInfoText;
    return listOfTextToTile.filter(el => el.deleteEntry);
  }

  private sendDelete(): Promise<any> {
    return Promise.resolve(true)
    .then((res) =>  this.getDeleteChanges().map(el => el.relation))
    .then((res) =>
      Promise.all(res.map((el) => this.backend.deleteToBackend('info_text_to_tile', el.ID).toPromise()))
    )
    .then((res) => this.getDeleteChanges().map(el => el.infoText))
    .then((res) =>
      Promise.all(res.map((el) => this.backend.deleteToBackend('info_text', el.ID).toPromise()))
    )
    .catch((err) => {
      console.log('error by send infotext updates: ' + JSON.stringify(err));
    });
  }

  public getUpdateChanges(entryObj: NewInfoTextToTile = null): NewInfoTextToTile[] {
    const listOfTextToTile = entryObj ? new Array(entryObj) : this.newInfoText;
    return listOfTextToTile
      .filter(el => !el.deleteEntry)
      .filter(el => this.filterInfoText(el) > -1 || this.filterInfoTextToTile(el) > -1)
      .filter(el =>
        this.isDiffInfoTextToTile(el.infoText, this.loadContent.getInfoText().find(i => i.ID === el.infoText.ID))
        ||
        this.isDiffInfoTextToTileRef(el.relation, this.loadContent.getInfoTextToTile().find(i => i.ID === el.relation.ID))
      );
  }

  private sendUpdate(): Promise<any> {
    return Promise.resolve(true)
    .then(() => this.getUpdateChanges())
    .then((res: NewInfoTextToTile[]) =>
      res.length > 0 ? this.backend.updateToBackend('info_text', res.map(el => el.infoText)).toPromise() : true
    )
    .catch((err) =>
      console.log('error by send infotext updates: ' + JSON.stringify(err))
    )
    .then(() => this.getUpdateChanges())
    .then((res: NewInfoTextToTile[]) =>
      res.length > 0 ? this.backend.updateToBackend('info_text_to_tile', res.map(el => el.relation)).toPromise() : true
    )
    .catch((err) =>
      console.log('error by send infotext to tile updates: ' + JSON.stringify(err))
    );
  }

  private filterInfoText(entryObj: NewInfoTextToTile): number {
    return this.loadContent.getInfoText().findIndex(s => s.ID === entryObj.infoText.ID);
  }

  private filterInfoTextToTile(entryObj: NewInfoTextToTile): number {
    return this.loadContent.getInfoTextToTile().findIndex(s => s.ID === entryObj.relation.ID);
  }

  public getNewChanges(entryObj: NewInfoTextToTile = null): NewInfoTextToTile[] {
    const listOfTextToTile = entryObj ? new Array(entryObj) : this.newInfoText;
    return listOfTextToTile
      .filter(el => !el.deleteEntry)
      .filter(el => this.filterInfoText(el) < 0 || this.filterInfoTextToTile(el) < 0);
  }

  sendNew() {
    return Promise.resolve(this.getNewChanges(null).map(el => el.infoText))
    .then((res: InfoText[]) =>
      res.length >= 1 ? this.backend.createToBackend('info_text', res).toPromise() : true
    )
    .then(() => this.getNewChanges(null).map(el => el.relation))
    .then((res: InfoTextToTile[]) =>
      res.length >= 1 ? this.backend.createToBackend('info_text_to_tile', res).toPromise() : true
    )
    .catch((err) =>
      console.log('error by send infotext new entities: ' + JSON.stringify(err))
    );
  }

  public sendChangesToBackend() {
    return Promise.resolve(true)
    .then(() => this.sendUpdate())
    .then(() => this.sendDelete());
  }

  public sendSpecificChangesToBackend(objs: NewInfoTextToTile) {
    const checkObjExists = (o: NewInfoTextToTile): boolean => {
      return this.loadContent.infoText.map(s => s.ID).find(s => s === o.infoText.ID) >= 0 &&
      this.loadContent.infoTextToTile.map(s => s.ID).find(s => s === o.relation.ID) >= 0;
    };
    if (checkObjExists(objs) && !objs.deleteEntry) {
      console.log('update objs' + JSON.stringify(objs));
      this.backend.updateToBackend('info_text', new Array<InfoText>(objs.infoText)).subscribe((response: boolean) => {});
      this.backend.updateToBackend('info_text_to_tile', new Array<InfoTextToTile>(objs.relation)).subscribe((response: boolean) => {});
    }
    if (!checkObjExists(objs) && !objs.deleteEntry) {
      console.log('create objs' + JSON.stringify(objs));
      this.backend.createToBackend('info_text', new Array<InfoText>(objs.infoText)).subscribe((response: boolean) => {});
      this.backend.createToBackend('info_text_to_tile', new Array<InfoTextToTile>(objs.relation)).subscribe((response: boolean) => {});
    }
    if (checkObjExists(objs) && objs.deleteEntry) {
      console.log('delete objs' + JSON.stringify(objs));
      this.backend.deleteToBackend('info_text_to_tile', objs.relation.ID).subscribe((response: boolean) => {});
      this.backend.deleteToBackend('info_text', objs.infoText.ID).subscribe((response: boolean) => {});
    }
  }

  isDiffInfoTextToTile(obj1: InfoText, obj2: InfoText) {
    if (obj1.ID !== obj2.ID) {
      return false;
    }
    if (obj1.contentText !== obj2.contentText) {
      return true;
    }
    if (obj1.headerText !== obj2.headerText) {
      return true;
    }
    if (obj1.link !== obj2.link) {
      return true;
    }
    return false;
  }

  isDiffInfoTextToTileRef(obj1: InfoTextToTile, obj2: InfoTextToTile) {
    if (obj1.ID !== obj2.ID) {
      return false;
    }
    if (obj1.changed !== obj2.changed) {
      return true;
    }
    if ((obj1.fk_info - obj2.fk_info) !== 0) {
      return true;
    }
    if ((obj1.fk_tile - obj2.fk_tile) !== 0) {
      return true;
    }
    return false;
  }
}
