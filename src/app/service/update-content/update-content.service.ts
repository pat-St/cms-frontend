import { ImageContentService } from './image-content.service';
import { InfoTextService } from './info-text.service';
import { LoadContentService } from './../load-content/load-content.service';
import { BackendRequestService } from './../backend-request/backend-request.service';
import { Injectable } from '@angular/core';
import { Tile } from 'src/app/model/tile';
import { ApartmentContentService } from './apartment-content.service';

@Injectable({
  providedIn: 'root'
})
export class UpdateContentService {
  newTile: Array<Tile> = new Array();

  constructor(
    private backend: BackendRequestService,
    private loadContent: LoadContentService,
    private updateApartment: ApartmentContentService,
    private updateImage: ImageContentService,
    private updateInfoText: InfoTextService) { }

  public nextIdOf(itemColl: Array<number>): number {
    if (itemColl.length < 2) {
      return itemColl.length;
    }
    return itemColl.reduce((currN, nextN) => currN > nextN ? currN : nextN) + 1;
  }

  async loadNewContent(count= 5) {
    if (count < 0) {
      console.warn('could not load content from backend');
      return;
    }
    if (this.loadContent.isFinished()) {
      const tileContent = this.loadContent.getTile();
      this.addTileEntry(tileContent);
    } else {
      console.log('await for tile');
      setTimeout( () => this.loadNewContent(count - 1), count * 1000 );
    }
  }
  reset() {
    this.newTile = new Array();
  }

  async sendUpdateToBackend() {
    this.sendNewTileChangesToBackend();
  }

  private addTileEntry(entryObject: Tile[]) {
    entryObject.forEach((element: Tile) => {
      const indexElement = this.newTile.findIndex((compE: Tile) => compE.ID === element.ID);
      if (indexElement >= 0) {
        this.newTile.splice(indexElement, 1);
      }
      this.newTile.push(Object.assign({}, element));
    });
  }

  public getNextNewTile(tileType: number = null, tileSize: number = null, modalType: number = 0): Tile {
    const nextID = this.newTile.length > 2 ? this.nextIdOf(this.newTile.map(el => el.ID)) : this.newTile.length;
    const newTile = new Tile(nextID, '', '', tileType, modalType, tileSize);
    this.newTile.push(newTile);
    return newTile;
  }

  public updateNewTile(obj: Tile): boolean {
    const index = this.newTile.findIndex(el => el.ID === obj.ID);
    if (index > -1) {
      this.newTile[index].changed = true;
      return true;
    }
    return false;
  }

  public deleteNewTile(obj: Tile): boolean {
    const index = this.newTile.findIndex(el => el.ID === obj.ID);
    if (index > -1) {
      this.newTile[index].deleteEntry = true;
      // Delete Apartment
      const apartObj = this.updateApartment.newApartment.find(el => el.content.fk_tile === obj.ID);
      if (apartObj) {
        this.updateApartment.deleteNextApartment(apartObj);
      }
      // Delete Info Text
      const infoTextObj = this.updateInfoText.newInfoText.filter(el => el.relation.fk_tile === obj.ID);
      if (infoTextObj.length > 0) {
        infoTextObj.forEach(el => this.updateInfoText.deleteNextInfoTile(el));
      }
      // Delete Images
      const imageObj = this.updateImage.newImage.filter(el => el.fk_tile === obj.ID);
      if (imageObj.length > 0) {
        imageObj.forEach(el => this.updateImage.deleteNewImage(el));
      }
      return true;
    }
    return false;
  }

  public getDeleteChanges(singleTile: Tile = null): Tile[] {
    const listOfTiles = singleTile ? new Array(singleTile) : this.newTile;
    return listOfTiles.filter(el => el.deleteEntry);
  }

  private sendDelete() {
    return Promise.resolve(this.getDeleteChanges(null))
    .then((el) =>
      el.map(i => this.backend.deleteToBackend('tile', i.ID).toPromise())
    )
    .catch((err) => {
      console.log('error by send tile delete: ' + JSON.stringify(err));
    });
  }

  public getUpdateChanges(singleTile: Tile = null): Tile[] {
    const listOfTiles = singleTile ? new Array(singleTile) : this.newTile;
    return listOfTiles
    .filter(i => !i.deleteEntry)
    .filter(el => this.loadContent.getTile().findIndex(i => i.ID === el.ID) > -1)
    .filter(el =>
       JSON.stringify(el) !== JSON.stringify(this.loadContent.getTile().find(i => i.ID === el.ID))
    );
  }

  private sendUpdate() {
    return Promise.resolve(true)
    .then(() => this.getUpdateChanges(null))
    .then((el: Tile[]) =>
      el.length >= 1 ? this.backend.updateToBackend('tile', el).subscribe(() => {}) : true
    )
    .catch((err) =>
      console.log('error by send update tile: ' + JSON.stringify(err))
    );
  }

  public getNewChanges(singleTile: Tile = null): Tile[] {
    const listOfTiles = singleTile ? new Array(singleTile) : this.newTile;
    return listOfTiles
      .filter(el => !el.deleteEntry && this.loadContent.getTile().findIndex(i => i.ID === el.ID) < 0);
  }

  sendNew() {
    return Promise.resolve(true)
    .then(() => this.getNewChanges(null))
    .then((el: Tile[]) =>
      el.length >= 1 ? this.backend.createToBackend('tile', el).subscribe(() => {}) : true
    )
    .catch((err) =>
      console.log('error by send new tile: ' + JSON.stringify(err))
    );
  }

  public sendNewTileChangesToBackend() {
    return Promise.resolve(true)
    // send update
    .then(e => this.sendUpdate())
    // send delete
    .then(e => this.sendDelete())
    .catch((err) => {
      console.log('error by send tile changes to backend: ' + JSON.stringify(err));
    });
  }

  public sendSpecificNewTileChangesToBackend(obj: Tile) {
    if (obj.deleteEntry) {
      // send delete
      return Promise.resolve(obj)
      .then((el) =>
          this.backend.deleteToBackend('tile', el.ID).toPromise()
      )
      .catch((err) => {
        console.log('error by send tile delete entities: ' + JSON.stringify(err));
      });
    } else if (this.loadContent.getTile().findIndex(i => i.ID === obj.ID) > -1) {
      // send update
      return Promise.resolve(obj)
      .then((el) =>
        this.backend.updateToBackend('tile', new Array(el)).toPromise()
      )
      .catch((err) => {
        console.log('error by send delete images: ' + JSON.stringify(err));
      });
    } else {
      // send update
      return Promise.resolve(obj)
      .then((el) =>
        this.backend.createToBackend('tile', new Array(el)).toPromise()
      )
      .catch((err) => {
        console.log('error by send delete images: ' + JSON.stringify(err));
      });
    }
  }
}
