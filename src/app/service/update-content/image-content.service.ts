import { LoadContentService } from './../load-content/load-content.service';
import { BackendRequestService } from './../backend-request/backend-request.service';
import { Injectable } from '@angular/core';
import { Image } from 'src/app/model/image';

@Injectable({
  providedIn: 'root'
})
export class ImageContentService {

  newImage: Array<Image> = new Array();

  constructor(private backend: BackendRequestService, private loadContent: LoadContentService) { }

  public nextIdOf(itemColl: Array<number>): number {
    if (itemColl.length < 2) { 
      return itemColl.length;
    }
    return itemColl.reduce((currN, nextN) => currN > nextN ? currN : nextN) + 1; }

  async loadNewContent(count= 5) {
    if (count < 0) {
      console.warn("could not load content from backend");
      return;
    }
    if (this.loadContent.isFinished()) {
      const images = this.loadContent.getImages();
      this.addImageEntry(images);
    } else {
      console.log("await for info text");
      setTimeout( () => this.loadNewContent(count - 1), count * 1000 );
    }
  }
  reset() {
    this.newImage = new Array();
  }

  private addImageEntry(entryObject: Image[]) {
    entryObject.forEach((element: Image) => {
      const indexElement = this.newImage.findIndex((compE: Image) => compE.ID === element.ID)
      if (indexElement >= 0) {
        this.newImage.splice(indexElement, 1);
      }
      this.newImage.push(Object.assign({},element));
    });
  }

  public getNextNewImage(tileID: number = null, apartmentID: number = null, infoTetxId: number = null): boolean {
      const nextImageID = this.nextIdOf(
        this.loadContent.getImages().map(el => el.ID).concat(this.newImage.map(el => el.ID))
      );
      this.newImage.push(new Image(nextImageID, [], "", apartmentID, infoTetxId, tileID));
      return true;
  }

  public deleteNewImage(obj: Image): boolean {
    const index = this.newImage.findIndex(el => el.ID === obj.ID);
    if (index > -1) {
      this.newImage[index].deleteEntry = true;
      return true;
    }
    return false;
  }

  public updateNewImage(obj: Image): boolean {
    const index = this.newImage.findIndex(el => el.ID === obj.ID);
    if (index > -1) {
      this.newImage[index].changed = true;
      return true;
    }
    return false;
  }

  private sendDelete(singleImage: Image = null): Promise<any> {
    const listOfImages = singleImage ? new Array(singleImage) : this.newImage;
    return Promise.resolve(
      listOfImages.filter(el => el.deleteEntry)
    )
    .then((el) => 
      Promise.all(el.map(i => this.backend.deleteToBackend("image", i.ID).toPromise()))
    )
    .catch((err) => {
      console.log("error by send delete images: " + JSON.stringify(err));
    });
  }

  private sendUpdate(singleImage: Image = null): Promise<any> {
    const listOfImages = singleImage ? new Array(singleImage) : this.newImage;
    return Promise.resolve(
      listOfImages
      .filter(el => this.loadContent.getImages().findIndex(i => i.ID === el.ID) > -1)
      .filter(el => JSON.stringify(el) !== JSON.stringify(this.loadContent.getImages().find(i => i.ID === el.ID)))
    )
    .then((el) => {
      el.forEach(i => {
        i.description = i.description.replace(" ","_");
        const rawImage = new Array(i.image);
        i.image = new Array();
        this.backend.updateToBackend("image", new Array(i)).toPromise();

        //upload Image
        if (i.changed) {
          const base64Image = this.loadContent.showImage(i.ID).replace(/data:image\/jpeg;base64,/g, '');
          const plainString = window.atob(base64Image);
  
          const arrayBuffer = new ArrayBuffer(plainString.length);
          const int8Array = new Uint8Array(arrayBuffer);
          for (let n = 0; n < plainString.length; n++) {
            int8Array[n] = plainString.charCodeAt(n);
          }
          const fileBlob = new Blob([int8Array], { 'type': 'image/jpeg'})
          this.backend.updateImageToBackend("image/" + i.ID, fileBlob).toPromise();
        }
      })
    })
    .catch((err) => {
      console.log("error by send delete images: " + JSON.stringify(err));
    });
  }

  sendNew(singleImage: Image = null) {
    const listOfImages = singleImage ? new Array(singleImage) : this.newImage;
    Promise.resolve(
      listOfImages
      .filter(el => this.loadContent.getImages().findIndex(i => i.ID === el.ID) < 0)
      .map(el => {
        el.image = [];
        return el;
      })
    )
    .then((res) =>
      res.length > 0 ? this.backend.createToBackend("image", res).toPromise() : false
    )
    .then((res) => {
      if (res === false) {
        return false;
      }
      return listOfImages
        .filter(el => this.loadContent.getImages().findIndex(i => i.ID === el.ID) < 0)
        .map(i => {
          const base64Image = this.loadContent.showImage(i.ID).replace(/data:image\/jpeg;base64,/g, '');
          const plainString = window.atob(base64Image);
          const arrayBuffer = new ArrayBuffer(plainString.length);
          const int8Array = new Uint8Array(arrayBuffer);
          for (let n = 0; n < plainString.length; n++) {
            int8Array[n] = plainString.charCodeAt(n);
          }
          const fileBlob = new Blob([int8Array], { 'type': 'image/jpeg'})
          return this.backend.updateImageToBackend("image/" + i.ID, fileBlob).toPromise();
        });
      }
    )
    .catch((err) => 
      console.log("error by send delete images: " + JSON.stringify(err))
    );
  }

  public sendChangesToBackend() {
    return Promise.resolve(true)
    .then(() => this.sendUpdate())
    .then(() => this.sendDelete());
  }

  public sendSpecificChangesToBackend(obj: Image) {
    return Promise.resolve(true)
    .then(() => this.sendUpdate(obj))
    .then(() => this.sendNew(obj))
    .then(() => this.sendDelete(obj));
  }

  public getImageByFkId(apartmentId: number = null, infoId: number = null, tileId: number = null): Image[] {
    if (apartmentId !== null) {
      return this.newImage.filter( eachObject => eachObject.fk_apartment === apartmentId);
    }
    if (infoId !== null) {
      return this.newImage.filter( eachObject => eachObject.fk_info === infoId);
    }
    if (tileId !== null) {
      return this.newImage.filter( eachObject => eachObject.fk_tile === tileId);
    }
    return null;
  }

  public hasImageByFkId(apartmentId: number = null, infoId: number = null, tileId: number = null): boolean {
    if (apartmentId !== null) {
      return this.newImage.map( element => element.fk_apartment).includes(apartmentId);
    }
    if (infoId !== null) {
      return this.newImage.map( element => element.fk_info).includes(infoId);
    }
    if (tileId !== null) {
      return this.newImage.map( element => element.fk_tile).includes(tileId);
    }
    return false;
  }


}
