import { NewEntryObject } from './../../../model/infoText';
import { NewEntryModalComponent } from './../../image-preview-modal/new-entry-modal.component';
import { MatDialog } from '@angular/material';
import { ImageContentService } from './../../../service/update-content/image-content.service';
import { FormSelectModel } from '../../../model/tileEdit/tileEdit';
import { Tile } from 'src/app/model/tile';
import { KachelSize, KachelType, ModalType } from '../../../model/tile';
import { LoadContentService } from '../../../service/load-content/load-content.service';
import { Component, OnInit, NgZone, ViewChild, AfterViewInit } from '@angular/core';
import {CdkTextareaAutosize} from '@angular/cdk/text-field';
import {take} from 'rxjs/operators';
import { UpdateContentService } from 'src/app/service/update-content/update-content.service';
import { reject } from 'q';

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
  srcResult: any;

  showTileDetailsStack: Set<number> = new Set();

  constructor(
    private updateContent: UpdateContentService,
    private updateImage: ImageContentService,
    private entryDialog: MatDialog,
    private _ngZone: NgZone) { }

  ngOnInit() {
    this.kachelExpansionList = this.updateContent.newTile;
    this.kachelTypeSelected = this.getKachelType();
    this.modalTypeSelected = this.getModalType();
    this.kachelSizeSelected = this.getKachelSize();
   }
  ngAfterViewInit(): void { }
  
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
    const tileType = this.kachelTypeSelected.map(el => new NewEntryObject(el.desc as number, el.value));
    const tileModal = this.modalTypeSelected.map(el => new NewEntryObject(el.desc as number, el.value));
    const tileSize = this.kachelSizeSelected.map(el => new NewEntryObject(el.desc as number, el.value));
    let choosedTileType : number;
    let choosedTileModal : number;
    let choosedTileSize : number;
    new Promise((resolve, reject) => {
      resolve("ok");
    })
    .then((res) => 
      this.entryDialog.open(NewEntryModalComponent, {
        maxWidth: '50vw',
        maxHeight: '50vh',
        data:  {metaInfo: 'Kachel Art', listOfEntrys: tileType}
      }).afterClosed().toPromise()
    )
    .then((res: number) => {
      choosedTileType = res
      if (res === null) {
        throw new Error("No Size set")
      }
      return res
      }
    )
    .then((res) => 
      this.entryDialog.open(NewEntryModalComponent, {
        maxWidth: '50vw',
        maxHeight: '50vh',
        data:  {metaInfo: 'Kachel Größe', listOfEntrys: tileSize}
      }).afterClosed().toPromise()
    )
    .then((res) => {
      choosedTileSize = res
      if (res === null) {
        throw new Error("No Size set")
      }
      return res
    })
    .then((res) => 
      this.entryDialog.open(NewEntryModalComponent, {
        maxWidth: '50vw',
        maxHeight: '50vh',
        data:  {metaInfo: 'Modal Art', listOfEntrys: tileModal}
      }).afterClosed().toPromise()
    )
    .then((res: number) => {
      choosedTileModal = res
      if (res === null) {
        throw new Error("No Size set")
      }
      return res
    }).then(() => {
      if (choosedTileType >= 0 && choosedTileModal >= 0 && choosedTileSize >= 0) {
        this.updateContent.getNextNewTile(choosedTileType, choosedTileSize, choosedTileModal)
      }
    })
    .catch((res) => console.log(JSON.stringify(res)))
  }

  removeEntry(entryObject: Tile) {
    this.updateContent.deleteNewTile(entryObject)
  }
  saveEntry(entryObject: Tile) {
    this.updateContent.sendSpecificNewTileChangesToBackend(entryObject);
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
    return this.updateImage.hasImageByFkId(null, null, id);
  }

}
