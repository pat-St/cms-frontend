export class Image {
  ID: number;
  image: Array<number>;
  description: string;
  fk_apartment: number;
  fk_info: number;
  fk_tile: number;

  constructor(
    ID: number = null,
    image: Array<number> = null,
    description: string = null,
    fk_apartment: number = null,
    fk_info: number = null,
    fk_tile: number = null
  ) {
    this.ID = ID;
    this.image = image;
    this.description = description;
    this.fk_apartment = fk_apartment;
    this.fk_info = fk_info;
    this.fk_tile = fk_tile;
  }
}
