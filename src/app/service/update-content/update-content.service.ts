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
  
  newTile: Array<Tile> = new Array();

  constructor(private backend: BackendRequestService, private loadContent: LoadContentService) { }

  public nextIdOf(itemColl: Array<number>): number { return itemColl.reduce((currN, nextN) => currN > nextN ? currN : nextN) + 1; }

  async loadNewContent(count= 5) {
    if (count < 0) {
      console.warn("could not load content from backend");
      return;
    }
    if (this.loadContent.isFinished()) {
      const tileContent = this.loadContent.getTile();
      this.addTileEntry(tileContent);

    } else {
      console.log("await for info text");
      setTimeout( () => this.loadNewContent(count - 1), count * 500 );
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
      this.newTile[index] = this.newTile[index].setChanged();
      return true;
    }
    return false;
  }

  public deleteNewTile(obj: Tile): boolean {
    const index = this.newTile.findIndex(el => el.ID === obj.ID);
    if (index > -1) {
      this.newTile[index].deleteEntry = true;
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

 

}
