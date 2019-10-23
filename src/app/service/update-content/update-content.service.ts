import { InfoTextToTile, InfoText, NewInfoTextToTile } from 'src/app/model/infoText';
import { LoadContentService } from './../load-content/load-content.service';
import { BackendRequestService } from './../backend-request/backend-request.service';
import { Injectable, Optional } from '@angular/core';
import { element } from 'protractor';

@Injectable({
  providedIn: 'root'
})
export class UpdateContentService {
  newInfoText: Array<NewInfoTextToTile> = new Array();

  constructor(private backend: BackendRequestService, private loadContent: LoadContentService) { }

  getNextInfoTile(tileId: number): NewInfoTextToTile {
    if (this.loadContent.isFinished()) {
      const nextInfoTextToTileID: number = this.nextIdOf(
        this.loadContent.getInfoTextToTile().filter(el => el.fk_tile === tileId).map(el => el.ID)
        );
      const nextInfoTextID: number = this.nextIdOf(
        this.loadContent.getInfoText().map(el => el.ID)
        );
      const newInfoTextToTile = new InfoTextToTile(nextInfoTextToTileID, nextInfoTextID, tileId);
      const newInfoText = new InfoText(nextInfoTextID, null, null, null);
      const newInfoTextToTileEntry = new NewInfoTextToTile(newInfoText, newInfoTextToTile);
      this.newInfoText.push(newInfoTextToTileEntry);
      return newInfoTextToTileEntry;
    } else {
      return null;
    }
  }

  deleteNextInfoTile(entryObj: NewInfoTextToTile) {
    const foundIndex = this.newInfoText.findIndex(el => el === entryObj);
    if (foundIndex >= 0 && entryObj.infoText.ID !== null && entryObj.relation.ID !== null) {
      this.newInfoText[foundIndex] = this.newInfoText[foundIndex].setDelete();
    }
    if (foundIndex >= 0 && entryObj.infoText.ID === null && entryObj.relation.ID === null) {
      this.newInfoText.splice(foundIndex, 1);
    }
  }

  updateNextInfoTile(entryObj: NewInfoTextToTile) {
    const foundIndex = this.newInfoText.findIndex(el => el === entryObj);
    if (foundIndex >= 0) {
      this.newInfoText[foundIndex] = entryObj;
    } else {
      this.newInfoText.push(entryObj);
    }
  }

  async sendUpdateToBackend() {
    this.sendNextInfoTextTileChangesToBackend();
  }

  sendNextInfoTextTileChangesToBackend() {
    // send delete
    const deleteEntities = this.newInfoText.filter(el => el.deleteEntry);
    deleteEntities.map(el => el.infoText).forEach(el => {
      this.backend.deleteToBackend("info_text", el.ID).subscribe((response: boolean) => {});
    });
    deleteEntities.map(el => el.relation).forEach(el => {
      this.backend.deleteToBackend("info_text_to_tile", el.ID).subscribe((response: boolean) => {});
    });
    // send updates
    const updateInfoTextEntities = this.newInfoText
      .filter(el => !el.deleteEntry)
      .map(el => el.infoText)
      .filter(el => this.loadContent.infoText.map(s => s.ID).find(s => s === el.ID));
    this.backend.updateToBackend("info_text", updateInfoTextEntities).subscribe((response: boolean) => {});
    const updateRelationEntities = this.newInfoText
      .filter(el => !el.deleteEntry)
      .map(el => el.relation)
      .filter(el => this.loadContent.infoTextToTile.map(s => s.ID).find(s => s === el.ID));
    this.backend.updateToBackend("info_text_to_tile", updateRelationEntities).subscribe((response: boolean) => {});
    // send new
    const newInfoTextEntities = this.newInfoText
      .filter(el => !el.deleteEntry)
      .map(el => el.infoText)
      .filter(el => !this.loadContent.infoText.map(s => s.ID).find(s => s === el.ID));
    this.backend.createToBackend("info_text", newInfoTextEntities).subscribe((response: boolean) => {});
    const newRelationEntities = this.newInfoText
    .filter(el => !el.deleteEntry)
      .map(el => el.infoText)
      .filter(el => !this.loadContent.infoTextToTile.map(s => s.ID).find(s => s === el.ID));
    this.backend.createToBackend("info_text_to_tile", newRelationEntities).subscribe((response: boolean) => {});
  }

  sendSpecificNextInfoTextTileChangesToBackend(objs: NewInfoTextToTile) {
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

  private nextIdOf(itemColl: Array<number>): number { return itemColl.reduce((currN, nextN) => currN > nextN ? currN : nextN) + 1; }
}
