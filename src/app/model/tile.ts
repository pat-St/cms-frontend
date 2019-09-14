export class Tile {
  id: number;
  titleName: string;
  description: string;
  kachelType: string;
  modalType: string;
  kachelSize: string;
  constructor(
    id: number,
    titleName: string,
    description: string,
    kachelType: string,
    modalType: string,
    kachelSize: string
  ) {
    this.id = id;
    this.titleName = titleName;
    this.description = description;
    this.kachelType = kachelType;
    this.modalType = modalType;
    this.kachelSize = kachelSize;
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
