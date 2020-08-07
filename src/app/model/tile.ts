export class Tile {
  ID: number;
  titleName: string;
  description: string;
  kachelType: number;
  modalType: number;
  tileSizeType: number;
  deleteEntry: boolean = false;
  changed: boolean = false;

  constructor(
    ID: number = null,
    titleName: string = null,
    description: string = null,
    kachelType: number = 0,
    modalType: number = 2,
    tileSizeType: number = 20,
    deleteEntry: boolean = false,
    changed: boolean = false
  ) {
    this.ID = ID;
    this.titleName = titleName;
    this.description = description;
    this.kachelType = kachelType;
    this.modalType = modalType;
    this.tileSizeType = tileSizeType;
    this.changed = changed;
    this.deleteEntry = deleteEntry;
  }
  setDelete(): Tile {
    this.deleteEntry = true;
    return this;
  }

  setChanged(): Tile {
    this.changed = true;
    return this;
  }
}

export class TileOrder {
  ID: number;
  seqNum: number;
  fk_tile: number;
  changed: boolean = false;
  deleteEntry: boolean = false;
  constructor(
    ID: number = null,
    seqNum: number,
    fk_tile: number,
    deleteEntry: boolean = false,
    changed: boolean = false) {
    this.ID = ID;
    this.seqNum = seqNum;
    this.fk_tile = fk_tile;
    this.changed = changed;
    this.deleteEntry = deleteEntry;
  }
  setDelete(): TileOrder {
    this.deleteEntry = true;
    return this;
  }

  setChanged(): TileOrder {
    this.changed = true;
    return this;
  }
}


export enum KachelSize {
  small = 20,
  normal = 35,
  large = 50
}

export enum KachelType {
  headline = 0,
  text = 1,
  map = 2,
  weather = 3
}

export enum ModalType {
  apartment = 0,
  bookRequest = 1,
  info = 2,
  cookie = 3,
  none = 4
}
