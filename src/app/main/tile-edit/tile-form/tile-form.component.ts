import { KachelType, KachelSize } from './../../../model/tile';
import { Component, OnInit, Input } from '@angular/core';
import { Tile } from 'src/app/model/tile';

@Component({
  selector: 'app-tile-form',
  templateUrl: './tile-form.component.html',
  styleUrls: ['./tile-form.component.styl']
})
export class TileFormComponent implements OnInit {

  @Input() tileModel: Tile;
  id: number = this.tileModel ? this.tileModel.id : 0;
  tileName: string = this.tileModel ? this.tileModel.titleName : "";
  description: string = this.tileModel ? this.tileModel.description : "";
  kachelType: string = this.tileModel ? this.tileModel.kachelType : "";
  modalType: string = this.tileModel ? this.tileModel.modalType : "";
  kachelSize: string = this.tileModel ? this.tileModel.kachelSize : "";

  constructor() { }

  ngOnInit() {
  }

}
