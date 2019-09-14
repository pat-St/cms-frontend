export class Image {
  id: number;
  image: Array<number>;
  description: string;
  fk_apartment: number;
  fk_info: number;
  fk_tile: number;

  constructor(
    id: number,
    image: Array<number>,
    description: string,
    fk_apartment: number,
    fk_info: number,
    fk_tile: number
  ) {
    this.id = id;
    this.image = image;
    this.description = description;
    this.fk_apartment = fk_apartment;
    this.fk_info = fk_info;
    this.fk_tile = fk_tile;
  }
}
