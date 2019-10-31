export class Tile {
  ID: number;
  titleName: string;
  description: string;
  kachelType: number;
  modalType: number;
  kachelSize: number;
  deleteEntry: boolean = false;
  changed: boolean = false;

  constructor(
    ID: number = null,
    titleName: string = null,
    description: string = null,
    kachelType: number = 0,
    modalType: number = 2,
    kachelSize: number = 20,
    deleteEntry: boolean = false,
    changed: boolean = false
  ) {
    this.ID = ID;
    this.titleName = titleName;
    this.description = description;
    this.kachelType = kachelType;
    this.modalType = modalType;
    this.kachelSize = kachelSize;
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
