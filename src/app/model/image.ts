export class Image {
  ID: number;
  image: Array<number>;
  description: string;
  fk_apartment: number;
  fk_info: number;
  fk_tile: number;
  deleteEntry: boolean = false;
  changed: boolean = false;

  constructor(
    ID: number = null,
    image: Array<number> = null,
    description: string = null,
    fk_apartment: number = null,
    fk_info: number = null,
    fk_tile: number = null,
    deleteEntry: boolean = false,
    changed: boolean = false
  ) {
    this.ID = ID;
    this.image = image;
    this.description = description;
    this.fk_apartment = fk_apartment;
    this.fk_info = fk_info;
    this.fk_tile = fk_tile;
    this.deleteEntry = deleteEntry;
    this.changed = changed;
  }
  setDelete(): Image {
    this.deleteEntry = true;
    return this;
  }
  setChanged(): Image {
    this.changed = true;
    return this;
  }
  resetDelete(): Image {
    this.deleteEntry = false;
    return this;
  }
}
