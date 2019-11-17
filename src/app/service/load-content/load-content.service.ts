import {
  ApartmentDescription,
  DetailsToApartment,
  ApartmentPrice,
  ApartmentContent,
  ApartmentDetails
} from "./../../model/apartment";
import { BackendRequestService } from "./../backend-request/backend-request.service";
import { Injectable } from "@angular/core";
import { Tile } from "src/app/model/tile";
import { InfoText, InfoTextToTile } from "src/app/model/infoText";
import { Image } from "src/app/model/image";
import { platform } from 'os';

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
  apartmentDetails: ApartmentDetails[];
  apartmentPrice: ApartmentPrice[];
  imageObject: Image[];
  imageCounter = 0;
  finishCounter = 0;
  maxCounter = 9;
  apartmentCounter = 0;

  constructor(private backend: BackendRequestService) {}

  private resetAllCached() {
    this.tile = null;
    this.infoText = null;
    this.infoTextToTile = null;
    this.apartmentContent = null;
    this.apartmentDescription = null;
    this.detailsToApartment = null;
    this.apartmentDetails = null;
    this.apartmentPrice = null;
    this.imageObject = null;
    this.imageCounter = 0;
    this.apartmentCounter = 0;
    this.finishCounter = 0;
  }

  async loadAll() {
    this.resetAllCached();
    this.loadTile();
    this.loadInfoText();
    this.loadTextToTile();
    this.loadApartmentContent();
    this.loadApartmentDesc();
    this.loadDetailsToApartment();
    this.loadApartmentDetails();
    this.loadApartmentPrice();
    this.loadImage();
  }

  private incrementCounter() {
    this.finishCounter += 1;
  }

  isFinished() {
    return this.finishCounter >= this.maxCounter;
  }

  isApartmentFinished() {
    return this.apartmentCounter >= 5;
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
        this.apartmentCounter+=1;
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
        this.apartmentCounter+=1;
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
        this.apartmentCounter+=1;
      });
  }

  getDetailsToApartment(): DetailsToApartment[] {
    return this.detailsToApartment;
  }

  async loadApartmentDetails() {
    this.backend
      .getFromBackend("apartment_details")
      .subscribe((payload: ApartmentDetails[]) => {
        this.apartmentDetails = payload;
        this.incrementCounter();
        this.apartmentCounter+=1;
      });
  }

  getApartmentDetails(): ApartmentDetails[] {
    return this.apartmentDetails;
  }

  async loadApartmentPrice() {
    this.backend
      .getFromBackend("apartment_price")
      .subscribe((payload: ApartmentPrice[]) => {
        this.apartmentPrice = payload;
        this.incrementCounter();
        this.apartmentCounter+=1;
      });
  }

  getApartmentPrice(): ApartmentPrice[] {
    return this.apartmentPrice;
  }

  async loadImage() {
    this.backend.getFromBackend("image/id").subscribe(
      (payloadList: number[]) => {
        this.imageCounter = payloadList.length;
        let currentCounter = 0;
        payloadList.forEach( id => {
          this.imageObject = new Array();
          this.backend.getFromBackend("image/id/" + id).subscribe(
            (imageObj: Image) => {
              this.backend.loadImage(imageObj.description, imageObj.ID);
              this.imageObject.push(imageObj);
              currentCounter += 1;
              this.hasAllImageLoaded(currentCounter);

          });
        });
    });
  }

  hasAllImageLoaded(refCounter: number) {
    if (refCounter === this.imageCounter) {
      this.incrementCounter();
    }
  }

  getImages(): Image[] {
    return this.imageObject;
  }

  getCounter() {
    return this.finishCounter;
  }
}