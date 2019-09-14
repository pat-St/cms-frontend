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

  async loadAll() {
    this.finishCounter = 0;
    this.backend.getFromBackend("tile").subscribe((payload: Tile[]) => {
      this.tile = new Array().concat(payload);
      this.incrementCounter();
    });
    this.backend
      .getFromBackend("info_text")
      .subscribe((payload: InfoText[]) => {
        this.infoText = new Array().concat(payload);
        this.incrementCounter();
      });
    this.backend
      .getFromBackend("info_text_to_tile")
      .subscribe((payload: InfoTextToTile[]) => {
        this.infoTextToTile = new Array().concat(payload);
        this.incrementCounter();
      });
    this.backend
      .getFromBackend("apartment")
      .subscribe((payload: ApartmentContent[]) => {
        this.apartmentContent = new Array().concat(payload);
        this.incrementCounter();
      });
    this.backend
      .getFromBackend("apartment_desc")
      .subscribe((payload: ApartmentDescription[]) => {
        this.apartmentDescription = new Array().concat(payload);
        this.incrementCounter();
      });
    this.backend
      .getFromBackend("details_to_apartment")
      .subscribe((payload: DetailsToApartment[]) => {
        this.detailsToApartment = new Array().concat(payload);
        this.incrementCounter();
      });
    this.backend
      .getFromBackend("apartment_price")
      .subscribe((payload: ApartmentPrice[]) => {
        this.apartmentPrice = new Array().concat(payload);
        this.incrementCounter();
      });
    this.backend.getFromBackend("image/id").subscribe((payloadList: number[]) => {
      payloadList.forEach( id => {
        this.backend.getFromBackend("image/id/"+id).subscribe((payloadList: Image) => {
          this.imageObject = new Array().concat(payloadList);
        });
      });
      this.incrementCounter();
    });
  }
  private incrementCounter() {
    this.finishCounter += 1;
  }

  isFinished() {
    return this.finishCounter >= 8;
  }

  getTile(): Tile[] {
    return this.tile;
  }

  getInfoText(): InfoText[] {
    return this.infoText;
  }

  getInfoTextToTile(): InfoTextToTile[] {
    return this.infoTextToTile;
  }

  getApartmentContent(): ApartmentContent[] {
    return this.apartmentContent;
  }

  getApartmentDescription(): ApartmentDescription[] {
    return this.apartmentDescription;
  }

  getDetailsToApartment(): DetailsToApartment[] {
    return this.detailsToApartment;
  }

  getApartmentPrice(): ApartmentPrice[] {
    return this.apartmentPrice;
  }

  getImages(): Image[] {
    return this.imageObject;
  }
}
