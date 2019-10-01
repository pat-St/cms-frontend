import { FormSelectModel } from './../../model/tileEdit/tileEdit';
import { Tile } from 'src/app/model/tile';
import { KachelSize, KachelType, ModalType } from './../../model/tile';
import { LoadContentService } from './../../service/load-content/load-content.service';
import { Component, OnInit, NgZone, ViewChild, AfterViewInit } from '@angular/core';
import {CdkTextareaAutosize} from '@angular/cdk/text-field';
import {take} from 'rxjs/operators';

@Component({
  selector: 'app-tile-edit',
  templateUrl: './tile-edit.component.html',
  styleUrls: ['./tile-edit.component.styl']
})
export class TileEditComponent implements OnInit, AfterViewInit {

  @ViewChild('autosize', {static: false}) autosize: CdkTextareaAutosize;

  panelOpenState = false;

  kachelExpansionList: Array<Tile> = new Array();

  kachelTypeSelected: FormSelectModel[];
  modalTypeSelected: FormSelectModel[];
  kachelSizeSelected: FormSelectModel[];
  imageSelected: FormSelectModel[];
  srcResult: any;

  showTileDetailsStack: Set<number> = new Set();

  constructor(private content: LoadContentService, private _ngZone: NgZone) { }

  ngOnInit() {
    if (!this.content.isFinished()) {
      this.content.loadAll();
    }
  }
  ngAfterViewInit(): void {
    this.loadContent();
    this.kachelTypeSelected = this.getKachelType();
    this.modalTypeSelected = this.getModalType();
    this.kachelSizeSelected = this.getKachelSize();
    this.imageSelected = this.getImageSelected();
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
        kachelSizeList.push(new FormSelectModel(i, KachelSize[i] as any));
      }
    }
    return kachelSizeList;
  }
  getModalType() {
    let modalTypeList: FormSelectModel[] = [];
    for (const i in ModalType) {
      if (typeof ModalType[i] === 'number') {
        modalTypeList.push(new FormSelectModel(i, ModalType[i] as any));
      }
    }
    return modalTypeList;
  }
  getKachelType() {
    let kachelTypeList: FormSelectModel[] = [];
    for (const i in KachelType) {
      if (typeof KachelType[i] === 'number') {
        kachelTypeList.push(new FormSelectModel(i, KachelType[i] as any));
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
      console.warn("could not load content from backend");
      return;
    }
    const responseContent = this.content.getTile();
    if (responseContent) {
      this.addListInTile(responseContent);
      // responseContent.forEach(e => {
      //   this.addEntryInTile(e);
      // });
    } else {
      console.log("await for tile");
      setTimeout( () => { this.loadContent(count - 1) }, 1000 );
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

  addNewEntry() {
    const newEntry: Tile = new Tile();
    if (!this.kachelExpansionList.some((element: Tile) => element.ID === newEntry.ID)) {
      this.kachelExpansionList.push(newEntry);
    }
  }

  removeEntry(entryObject: Tile) {
    if (this.kachelExpansionList.includes(entryObject)) {
      const indexOf = this.kachelExpansionList.indexOf(entryObject);
      this.kachelExpansionList.splice(indexOf, 1);
    }
  }
  addListInTile(entryObject: Tile[]) {
    entryObject.forEach((element: Tile) => {
      const indexElement = this.kachelExpansionList.findIndex((compE: Tile) => compE.ID === element.ID)
      if (indexElement >= 0) {
        this.kachelExpansionList.splice(indexElement, 1);
      }
      this.kachelExpansionList.push(element);
    });
  }

  addEntryInTile(entryObject: Tile) {
    const indexElement = this.kachelExpansionList.findIndex((compE: Tile) => compE.ID === entryObject.ID)
    if (indexElement >= 0) {
      this.kachelExpansionList.splice(indexElement, 1);
    }
    this.kachelExpansionList.push(entryObject);
  }
  trigger_refresh() {
    this.content.loadAll();
    this.loadContent();
  }

  showTileDetails(tileId: number) {
    if (this.showTileDetailsStack.has(tileId)) {
      this.showTileDetailsStack.delete(tileId);
    } else {
      this.showTileDetailsStack.add(tileId);
    }
  }
  isTileDetailsActive(tileId: number) {
    return this.showTileDetailsStack.has(tileId);
  }
  hasImage(id: number) {
    return this.content.hasImageByFkId(null,null, id);
  }

}
