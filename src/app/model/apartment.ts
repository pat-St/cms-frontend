export class ApartmentContent {
  ID: number;
  fk_tile: number;
  deleteEntry: boolean = false;
  changed: boolean = false;

  constructor(
    ID: number = null,
    fk_tile: number = null,
    deleteEntry: boolean = false,
    changed: boolean = false
  ) {
    this.ID = ID;
    this.fk_tile = fk_tile;
    this.deleteEntry = deleteEntry;
    this.changed = changed;
  }
  setDelete(): ApartmentContent {
    this.deleteEntry = true;
    return this;
  }
  setChanged(): ApartmentContent {
     this.changed = true;
     return this;
  }
}
export class ApartmentDescription {
  ID: number;
  description: string;
  info: string;
  fk_apartment: number;
  deleteEntry: boolean = false;
  changed: boolean = false;

  constructor(
    ID: number = null,
    description: string = null,
    info: string = null,
    fk_apartment: number = null,
    deleteEntry: boolean = false,
    changed: boolean = false
  ) {
    this.ID = ID;
    this.description = description;
    this.info = info;
    this.fk_apartment = fk_apartment;
    this.deleteEntry = deleteEntry;
    this.changed = changed;
  }
  setDelete(): ApartmentDescription {
    this.deleteEntry = true;
    return this;
  }
  setChanged(): ApartmentDescription {
    this.changed = true;
    return this;
  }
}
export class ApartmentDetails {
  ID: number;
  identifier: string;
  deleteEntry: boolean = false;
  changed: boolean = false;
  constructor(
    ID: number = null,
    identifier: string = null,
    deleteEntry: boolean = false,
    changed: boolean = false
  ) {
    this.ID = ID;
    this.identifier = identifier;
    this.deleteEntry = deleteEntry;
    this.changed = changed;
  }
  setDelete(): ApartmentDetails {
    this.deleteEntry = true;
    return this;
  }
  setChanged(): ApartmentDetails {
    this.changed = true;
    return this;
  }
}

export class DetailsToApartment {
  ID: number;
  info: string;
  fk_apartment: number;
  fk_details: number;
  deleteEntry: boolean = false;
  changed: boolean = false;
  constructor(
    ID: number = null,
    info: string = null,
    fk_apartment: number = null,
    fk_details: number = null,
    deleteEntry: boolean = false,
    changed: boolean = false
  ) {
    this.ID = ID;
    this.info = info;
    this.fk_apartment = fk_apartment;
    this.fk_details = fk_details;
    this.deleteEntry = deleteEntry;
    this.changed = changed;
  }
  setDelete(): DetailsToApartment {
    this.deleteEntry = true;
    return this;
  }
  setChanged(): DetailsToApartment {
    this.changed = true;
    return this;
  }
}

export class ApartmentPrice {
  ID: number;
  personCount: string;
  peakSeason: string;
  offSeason: string;
  nights: string;
  fk_apartment: number;
  deleteEntry: boolean = false;
  changed: boolean = false;
  constructor(
    ID: number = null,
    personCount: string = null,
    peakSeason: string = null,
    offSeason: string = null,
    nights: string = null,
    fk_apartment: number = null,
    deleteEntry: boolean = false,
    changed: boolean = false
  ) {
    this.ID = ID;
    this.personCount = personCount;
    this.peakSeason = peakSeason;
    this.offSeason = offSeason;
    this.nights = nights;
    this.fk_apartment = fk_apartment;
    this.deleteEntry = deleteEntry;
    this.changed = changed;
  }
  setDelete(): ApartmentPrice {
    this.deleteEntry = true;
    return this;
  }
  setChanged(): ApartmentPrice {
    this.changed = true;
    return this;
  }
}

export class NewApartmentObject {
  content: ApartmentContent;
  description: Array<ApartmentDescription>;
  price: Array<ApartmentPrice>;
  detailsToApartment: Array<DetailsToApartment>;
  deleteEntry: boolean;
  changed: boolean = false;

  constructor(
    content: ApartmentContent,
    description: Array<ApartmentDescription>,
    price: Array<ApartmentPrice>,
    detailsToApartment: Array<DetailsToApartment>,
    deleteEntry: boolean = false,
    changed: boolean = false
  ) {
    this.content = content;
    this.description = description;
    this.price = price;
    this.detailsToApartment = detailsToApartment;
    this.deleteEntry = deleteEntry;
    this.changed = changed;
  }
  setDelete(): NewApartmentObject {
    this.deleteEntry = true;
    return this;
   }
   setChanged(): NewApartmentObject {
    this.changed = true;
    return this;
  }
   getAllDescID(): Array<number> {
     return this.description.map(el => el.ID);
   }
   getAllPriceID(): Array<number> {
     return this.price.map(el => el.ID);
   }
   getAllDetailsRelationID(): Array<number> {
     return this.detailsToApartment.map(el => el.ID);
   }
}
