export class Image {
  ID: number;
  image: Array<number>;
  description: string;
  fk_apartment: number;
  fk_info: number;
  fk_tile: number;

  constructor(
    ID: number,
    image: Array<number>,
    description: string,
    fk_apartment: number,
    fk_info: number,
    fk_tile: number
  ) {
    this.ID = ID;
    this.image = image;
    this.description = description;
    this.fk_apartment = fk_apartment;
    this.fk_info = fk_info;
    this.fk_tile = fk_tile;
  }
}
