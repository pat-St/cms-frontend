export class InfoText {
  id: number;
  headerText: string;
  contentText: string;
  link: string;
  constructor(
    id: number,
    headerText: string,
    contentText: string,
    link: string
  ) {
    this.id = id;
    this.headerText = headerText;
    this.contentText = contentText;
    this.link = link;
  }
}
export class InfoTextToTile {
  id: number;
  fk_info: number;
  fk_tile: number;
  constructor(id: number, fk_info: number, fk_tile: number) {
    this.id = id;
    this.fk_info = fk_info;
    this.fk_tile = fk_tile;
  }
}
