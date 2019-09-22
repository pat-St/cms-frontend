export class InfoText {
  ID: number;
  headerText: string;
  contentText: string;
  link: string;
  constructor(
    ID: number = null,
    headerText: string = null,
    contentText: string = null,
    link: string = null
  ) {
    this.ID = ID;
    this.headerText = headerText;
    this.contentText = contentText;
    this.link = link;
  }
}
export class InfoTextToTile {
  ID: number;
  fk_info: number;
  fk_tile: number;
  constructor(ID: number, fk_info: number, fk_tile: number) {
    this.ID = ID;
    this.fk_info = fk_info;
    this.fk_tile = fk_tile;
  }
}
