export class ApartmentContent {
  ID: number;
  fk_tile: number;
  constructor(ID: number, fk_tile: number) {
    this.ID = ID;
    this.fk_tile = fk_tile;
  }
}
export class ApartmentDescription {
  ID: number;
  description: string;
  info: string;
  fk_apartment: number;
  constructor(
    ID: number,
    description: string,
    info: string,
    fk_apartment: number
  ) {
    this.ID = ID;
    this.description = description;
    this.info = info;
    this.fk_apartment = fk_apartment;
  }
}
export class ApartmentDetails {
  ID: number;
  identifier: string;
  constructor(ID: number, identifier: string) {
    this.ID = ID;
    this.identifier = identifier;
  }
}

export class DetailsToApartment {
  ID: number;
  info: string;
  fk_apartment: number;
  fk_details: number;
  constructor(
    ID: number,
    info: string,
    fk_apartment: number,
    fk_details: number
  ) {
    this.ID = ID;
    this.info = info;
    this.fk_apartment = fk_apartment;
    this.fk_details = fk_details;
  }
}

export class ApartmentPrice {
  ID: number;
  personCount: string;
  peakSeason: string;
  offSeason: string;
  fk_apartment;
  constructor(
    ID: number,
    personCount: string,
    peakSeason: string,
    offSeason: string,
    fk_apartment
  ) {
    this.ID = ID;
    this.personCount = personCount;
    this.peakSeason = peakSeason;
    this.fk_apartment = fk_apartment;
  }
}
