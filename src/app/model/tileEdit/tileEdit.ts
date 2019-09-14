import { Tile } from "./../tile";
export class TileEdit {
  listOfImage: FormSelectModel[];
  tileContent: Tile;

  constructor(
    listOfImage: FormSelectModel[],
    tileContent: Tile
  ) {
      this.listOfImage = listOfImage;
      this.tileContent = tileContent;
  }
}
export class FormSelectModel {
  value: string;
  desc: any;
  constructor(value: string, desc: any) {
    this.value = value;
    this.desc = desc;
  }
}
