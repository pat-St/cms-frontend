import { UpdateContentService } from './update-content.service';
import { BackendRequestService } from './../backend-request/backend-request.service';
import { Tile } from './../../model/tile';
import { LoadContentService } from './../load-content/load-content.service';
import { Injectable } from '@angular/core';
import { TileOrder } from 'src/app/model/tile';

@Injectable({
  providedIn: 'root'
})
export class TileOrderContentService {
  newTileOder: Array<TileOrder> = new Array();

  constructor(
    private loadContent: LoadContentService,
    private backend: BackendRequestService,
  ) { }

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
      const tileOrder = this.loadContent.getTileOrder();
      this.addCurrentTileOrder(tileOrder);
    } else {
      console.log('await for tile order');
      setTimeout( () => this.loadNewContent(count - 1), count * 1000 );
    }
  }

  reset() {
    this.newTileOder = new Array();
  }

  private addCurrentTileOrder(entryInfo: TileOrder[]) {
    entryInfo.forEach(el => {
      const newEntity = Object.assign({}, new TileOrder(el.ID, el.seqNum, el.fk_tile));
      const indexElement = this.newTileOder.findIndex(compE => compE.ID === newEntity.ID);
      if (indexElement >= 0) {
        this.updateNextTileOrder(newEntity);
      } else {
        this.newTileOder.push(newEntity);
        this.newTileOder.sort((el1, el2) => el1.seqNum - el2.seqNum);
      }
    });
  }

  public getNextTileOrder(tileId: number): boolean {
    const nextRelationID: number = this.newTileOder.length > 1 ? this.nextIdOf(
      this.loadContent.getTileOrder().map(el => el.ID).concat(this.newTileOder.map(el => el.ID))
    ) : this.newTileOder.length;

    const nextOrderNr = this.newTileOder.filter(el => !el.deleteEntry).length + 1;
    const newOrder = new TileOrder(nextRelationID, nextOrderNr, tileId);
    this.newTileOder.push(newOrder);
    this.newTileOder.sort((el1, el2) => el1.seqNum - el2.seqNum);
    return true;
  }

  public deleteNextTileOrder(entryObj: Tile) {
    const foundIndex = this.newTileOder.findIndex(el => el.fk_tile === entryObj.ID);
    if (foundIndex >= 0) {
      this.newTileOder[foundIndex].deleteEntry = true;
    }
  }

  public updateNextTileOrder(entryObj: TileOrder) {
    const foundIndex = this.newTileOder.findIndex(el => el.ID === entryObj.ID);
    if (foundIndex >= 0) {
      this.newTileOder[foundIndex].changed = true;
    } else {
      this.newTileOder.push(entryObj.setChanged());
      this.newTileOder.sort((el1, el2) => el1.seqNum - el2.seqNum);
    }
  }

  public getDeleteChanges(entryObj: TileOrder = null): TileOrder[] {
    const listOfTileOrder = entryObj ? new Array(entryObj) : this.newTileOder;
    return listOfTileOrder.filter(el => el.deleteEntry);
  }

  private sendDelete(): Promise<any> {
    return Promise.resolve(true)
    .then((res) =>  this.getDeleteChanges())
    .then((res) =>
      Promise.all(res.map((el) => this.backend.deleteToBackend('tile_order', el.ID).toPromise()))
    )
    .catch((err) => {
      console.log('error by send infotext updates: ' + JSON.stringify(err));
    });
  }

  public getUpdateChanges(entryObj: TileOrder = null): TileOrder[] {
    const listOfTextToTile = entryObj ? new Array(entryObj) : this.newTileOder;
    return listOfTextToTile
      .filter(el => !el.deleteEntry)
      .filter(el => el.changed)
      .filter(el => this.filterTileOrder(el) > -1)
      .filter(el =>
        this.isDiff(el, this.loadContent.getTileOrder().find(i => i.ID === el.ID))
      );
  }

  private sendUpdate(): Promise<any> {
    return Promise.resolve(true)
    .then(() => this.getUpdateChanges())
    .then((res: TileOrder[]) =>
      res.length > 0 ? this.backend.updateToBackend('tile_order', res.map(el => el)).toPromise() : true
    )
    .catch((err) =>
      console.log('error by send tile order updates: ' + JSON.stringify(err))
    );
  }

  public getNewChanges(entryObj: TileOrder = null): TileOrder[] {
    const listOfTileOrder = entryObj ? new Array(entryObj) : this.newTileOder;
    return listOfTileOrder
      .filter(el => !el.deleteEntry)
      .filter(el => this.filterTileOrder(el) < 0);
  }

  private filterTileOrder(entryObj: TileOrder): number {
    return this.loadContent.getTileOrder().findIndex(s => s.ID === entryObj.ID);
  }

  sendNew() {
    return Promise.resolve(this.getNewChanges(null))
    .then((res: TileOrder[]) =>
      res.length >= 1 ? this.backend.createToBackend('tile_order', res).toPromise() : true
    )
    .catch((err) =>
      console.log('error by send tile order new entities: ' + JSON.stringify(err))
    );
  }

  public sendChangesToBackend() {
    return Promise.resolve(true)
    .then(() => this.sendUpdate())
    .then(() => this.sendDelete());
  }

  public sendSpecificChangesToBackend(objs: TileOrder) {
    const checkObjExists = (o: TileOrder): boolean => {
      return this.loadContent.getTileOrder().map(s => s.ID).find(s => s === o.ID) >= 0;
    };
    if (checkObjExists(objs) && !objs.deleteEntry) {
      console.log('update objs' + JSON.stringify(objs));
      this.backend.updateToBackend('tile_order', new Array<TileOrder>(objs)).subscribe((response: boolean) => {});
    }
    if (!checkObjExists(objs) && !objs.deleteEntry) {
      console.log('create objs' + JSON.stringify(objs));
      this.backend.createToBackend('tile_order', new Array<TileOrder>(objs)).subscribe((response: boolean) => {});
    }
    if (checkObjExists(objs) && objs.deleteEntry) {
      console.log('delete objs' + JSON.stringify(objs));
      this.backend.deleteToBackend('tile_order', objs.ID).subscribe((response: boolean) => {});
    }
  }

  isDiff(obj1: TileOrder, obj2: TileOrder) {
    if (obj1.ID !== obj2.ID) {
      return false;
    }
    if (obj1.seqNum !== obj2.seqNum) {
      return true;
    }
    if (obj1.fk_tile !== obj2.fk_tile) {
      return true;
    }
    return false;
  }


}
