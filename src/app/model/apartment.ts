export class ApartmentContent {
  ID: number;
  fk_tile: number;
  constructor(ID: number = null, fk_tile: number = null) {
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
    ID: number = null,
    description: string = null,
    info: string = null,
    fk_apartment: number = null
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
  constructor(ID: number = null, identifier: string = null) {
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
    ID: number = null,
    info: string = null,
    fk_apartment: number = null,
    fk_details: number = null
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
  fk_apartment: number;
  constructor(
    ID: number = null,
    personCount: string = null,
    peakSeason: string = null,
    offSeason: string = null,
    fk_apartment: number = null,
  ) {
    this.ID = ID;
    this.personCount = personCount;
    this.peakSeason = peakSeason;
    this.fk_apartment = fk_apartment;
  }
}
