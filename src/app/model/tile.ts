export class Tile {
  ID: number;
  titleName: string;
  description: string;
  kachelType: number;
  modalType: number;
  kachelSize: number;
  
  constructor(
    ID: number = null,
    titleName: string = null,
    description: string = null,
    kachelType: number = 0,
    modalType: number = 2,
    kachelSize: number = 20
  ) {
    this.ID = ID;
    this.titleName = titleName;
    this.description = description;
    this.kachelType = kachelType;
    this.modalType = modalType;
    this.kachelSize = kachelSize;
  }

  // constructor() {
  //   this.id = null;
  //   this.titleName = null;
  //   this.description = null;
  //   this.kachelType = 0;
  //   this.modalType = 2;
  //   this.kachelSize = 20;
  // }
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
