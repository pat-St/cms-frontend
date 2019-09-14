import { FormSelectModel } from './../../model/tileEdit/tileEdit';
import { Tile } from 'src/app/model/tile';
import { KachelSize, KachelType, ModalType } from './../../model/tile';
import { LoadContentService } from './../../service/load-content/load-content.service';
import { Component, OnInit, NgZone, ViewChild } from '@angular/core';
import {CdkTextareaAutosize} from '@angular/cdk/text-field';
import {take, delay} from 'rxjs/operators';
import {MatTooltipModule} from '@angular/material/tooltip';
import { TileEdit } from 'src/app/model/tileEdit/tileEdit';

@Component({
  selector: 'app-tile-edit',
  templateUrl: './tile-edit.component.html',
  styleUrls: ['./tile-edit.component.styl']
})
export class TileEditComponent implements OnInit {

  @ViewChild('autosize', {static: false}) autosize: CdkTextareaAutosize;

  panelOpenState = false;

  kachelExpansionList: Tile[] = new Array();

  kachelTypeSelected: FormSelectModel[] = this.getKachelType();
  modalTypeSelected: FormSelectModel[] = this.getModalType();
  kachelSizeSelected: FormSelectModel[] = this.getKachelSize();
  imageSelected: FormSelectModel[] = this.getImageSelected();
  srcResult: any;

  constructor(private content: LoadContentService, private _ngZone: NgZone) { }

  ngOnInit() {
    if (!this.content.isFinished()) {
      this.content.loadAll();
    }
    this.loadContent();
  }
  isFinished() {
    return this.content.isFinished();
  }
  triggerResize() {
    // Wait for changes to be applied, then trigger textarea resize.
    this._ngZone.onStable.pipe(take(1))
        .subscribe(() => this.autosize.resizeToFitContent(true));
  }
  getKachelSize() {
    let kachelSizeList: FormSelectModel[] = [];
    for (const i in KachelSize) {
      if (typeof KachelSize[i] === 'number') {
        kachelSizeList.push({value: i, desc: <any>KachelSize[i]});
      }
    }
    return kachelSizeList;
  }
  getModalType() {
    let modalTypeList: FormSelectModel[] = [];
    for (const i in ModalType) {
      if (typeof ModalType[i] === 'number') {
        modalTypeList.push({value: i, desc: <any>ModalType[i]});
      }
    }
    return modalTypeList;
  }
  getKachelType() {
    let kachelTypeList: FormSelectModel[] = [];
    for (const i in KachelType) {
      if (typeof KachelType[i] === 'number') {
        kachelTypeList.push({value: i, desc: <any>KachelType[i]});
      }
    }
    return kachelTypeList;
  }
  getImageSelected() {
    let kachelTypeList: FormSelectModel[] = [];
    // for (const i in KachelType) {
    //   if (typeof KachelType[i] === 'number') {
    //     kachelTypeList.push({value: i, desc: <any>KachelType[i]});
    //   }
    // }
    return kachelTypeList;
  }
  async loadContent(count= 5) {
    if (count < 0) {
      console.warn("could not load conten from backend");
      return;
    }
    if (this.content.getTile()) {
      this.content.getTile().forEach(e => this.kachelExpansionList.push(e));
    } else {
      console.log("await for tile");
      setTimeout( () => { this.loadContent(count-1)}, 1000 );
    }
  }

  onFileSelected() {
    const inputNode: any = document.querySelector('#file');
  
    if (typeof (FileReader) !== 'undefined') {
      const reader = new FileReader();
  
      reader.onload = (e: any) => {
        this.srcResult = e.target.result;
      };
  
      reader.readAsArrayBuffer(inputNode.files[0]);
    }
  }
  


}
