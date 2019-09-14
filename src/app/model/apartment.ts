export class ApartmentContent {
  id: number;
  fk_tile: number;
  constructor(id: number, fk_tile: number) {
    this.id = id;
    this.fk_tile = fk_tile;
  }
}
export class ApartmentDescription {
  id: number;
  description: string;
  info: string;
  fk_apartment: number;
  constructor(
    id: number,
    description: string,
    info: string,
    fk_apartment: number
  ) {
    this.id = id;
    this.description = description;
    this.info = info;
    this.fk_apartment = fk_apartment;
  }
}
export class ApartmentDetails {
  id: number;
  identifier: string;
  constructor(id: number, identifier: string) {
    this.id = id;
    this.identifier = identifier;
  }
}

export class DetailsToApartment {
  id: number;
  info: string;
  fk_apartment: number;
  fk_details: number;
  constructor(
    id: number,
    info: string,
    fk_apartment: number,
    fk_details: number
  ) {
    this.id = id;
    this.info = info;
    this.fk_apartment = fk_apartment;
    this.fk_details = fk_details;
  }
}

export class ApartmentPrice {
  id: number;
  personCount: string;
  peakSeason: string;
  offSeason: string;
  fk_apartment;
  constructor(
    id: number,
    personCount: string,
    peakSeason: string,
    offSeason: string,
    fk_apartment
  ) {
    this.id = id;
    this.personCount = personCount;
    this.peakSeason = peakSeason;
    this.fk_apartment = fk_apartment;
  }
}
