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
  constructor(ID: number = null, fk_info: number = null, fk_tile: number) {
    this.ID = ID;
    this.fk_info = fk_info;
    this.fk_tile = fk_tile;
  }
}

export class NewInfoTextToTile {
  infoText: InfoText;
  relation: InfoTextToTile;
  deleteEntry: boolean;
  constructor(infoText: InfoText, relation: InfoTextToTile, deleteEntry: boolean = false) {
    this.infoText = infoText;
    this.relation = relation;
    this.deleteEntry = deleteEntry;
  }
  setDelete(): NewInfoTextToTile {
    this.deleteEntry = true;
    return this;
   }
}

export class NewEntryObject {
  id: number;
  desc: string;
  constructor(id: number, desc: string) {
    this.id = id;
    this.desc = desc;
  }
}
