import {
  ApartmentDescription,
  DetailsToApartment,
  ApartmentPrice
} from "./../../model/apartment";
import { BackendRequestService } from "./../backend-request/backend-request.service";
import { Injectable } from "@angular/core";
import { Tile } from "src/app/model/tile";
import { InfoText, InfoTextToTile } from "src/app/model/infoText";
import { ApartmentContent } from "src/app/model/apartment";
import { Image } from "src/app/model/image";

@Injectable({
  providedIn: "root"
})
export class LoadContentService {
  tile: Tile[];
  infoText: InfoText[];
  infoTextToTile: InfoTextToTile[];
  apartmentContent: ApartmentContent[];
  apartmentDescription: ApartmentDescription[];
  detailsToApartment: DetailsToApartment[];
  apartmentPrice: ApartmentPrice[];
  imageObject: Image[];

  finishCounter: number = 0;

  constructor(private backend: BackendRequestService) {}

  async resetAllCached() {
    this.tile = null;
    this.infoText = null;
    this.infoTextToTile = null;
    this.apartmentContent = null;
    this.apartmentDescription = null;
    this.detailsToApartment = null;
    this.apartmentPrice = null;
    this.imageObject = null;
  }

  async loadAll() {
    this.finishCounter = 0;
    this.resetAllCached();
    this.loadTile();
    this.loadInfoText();
    this.loadTextToTile();
    this.loadApartmentContent();
    this.loadApartmentDesc();
    this.loadDetailsToApartment();
    this.loadApartmentPrice();
    this.loadImage();
  }

  private incrementCounter() {
    this.finishCounter += 1;
  }

  isFinished() {
    return this.finishCounter >= 8;
  }

  async loadTile() {
    this.backend.getFromBackend("tile").subscribe((payload: Tile[]) => {
      this.tile = payload;
      this.incrementCounter();
    });
  }

  getTile(): Tile[] {
    return this.tile;
  }

  async loadInfoText() {
    this.backend
      .getFromBackend("info_text")
      .subscribe((payload: InfoText[]) => {
        this.infoText = payload;
        this.incrementCounter();
      });
  }

  getInfoText(): InfoText[] {
    return this.infoText;
  }

  async loadTextToTile() {
    this.backend
      .getFromBackend("info_text_to_tile")
      .subscribe((payload: InfoTextToTile[]) => {
        this.infoTextToTile = payload;
        this.incrementCounter();
      });
  }

  getInfoTextToTile(): InfoTextToTile[] {
    return this.infoTextToTile;
  }

  async loadApartmentContent() {
    this.backend
      .getFromBackend("apartment")
      .subscribe((payload: ApartmentContent[]) => {
        this.apartmentContent = payload;
        this.incrementCounter();
      });
  }

  getApartmentContent(): ApartmentContent[] {
    return this.apartmentContent;
  }

  async loadApartmentDesc() {
    this.backend
      .getFromBackend("apartment_desc")
      .subscribe((payload: ApartmentDescription[]) => {
        this.apartmentDescription = payload;
        this.incrementCounter();
      });
  }

  getApartmentDescription(): ApartmentDescription[] {
    return this.apartmentDescription;
  }

  async loadDetailsToApartment() {
    this.backend
      .getFromBackend("details_to_apartment")
      .subscribe((payload: DetailsToApartment[]) => {
        this.detailsToApartment = payload;
        this.incrementCounter();
      });
  }

  getDetailsToApartment(): DetailsToApartment[] {
    return this.detailsToApartment;
  }

  async loadApartmentPrice() {
    this.backend
      .getFromBackend("apartment_price")
      .subscribe((payload: ApartmentPrice[]) => {
        this.apartmentPrice = payload;
        this.incrementCounter();
      });
  }

  getApartmentPrice(): ApartmentPrice[] {
    return this.apartmentPrice;
  }

  async loadImage() {
    this.backend.getFromBackend("image/id").subscribe((payloadList: number[]) => {
      payloadList.forEach( id => {
        this.imageObject = new Array();
        this.backend.getFromBackend("image/id/"+id).subscribe((payloadList: Image) => {
          this.imageObject.push(payloadList);
        });
      });
      this.incrementCounter();
    });
  }

  getImages(): Image[] {
    return this.imageObject;
  }
}
