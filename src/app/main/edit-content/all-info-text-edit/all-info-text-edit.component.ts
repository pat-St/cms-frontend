import { NewEntryModalComponent } from './../../image-preview-modal/new-entry-modal.component';
import { LoadContentService } from '../../../service/load-content/load-content.service';
import { Component, OnInit, AfterViewInit, NgZone, ViewChild, Input } from '@angular/core';
import {CdkTextareaAutosize} from '@angular/cdk/text-field';
import {take} from 'rxjs/operators';
import { InfoText, InfoTextToTile, NewEntryObject, NewInfoTextToTile } from 'src/app/model/infoText';
import { Tile } from 'src/app/model/tile';
import { UpdateContentService } from 'src/app/service/update-content/update-content.service';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { resolve } from 'path';

@Component({
  selector: 'app-all-info-text-edit',
  templateUrl: './all-info-text-edit.component.html',
  styleUrls: ['./all-info-text-edit.component.styl']
})
export class AllInfoTextEditComponent implements OnInit, AfterViewInit {
  tileExpantionList: Array<Tile> = new Array();
  showImageDetailsStack: Set<number> = new Set();
  newInfoTextList: Array<NewInfoTextToTile>;

  @ViewChild('autosize', {static: false}) autosize: CdkTextareaAutosize;

  constructor(
    private content: LoadContentService,
    private _ngZone: NgZone,
    private updateContent: UpdateContentService,
    private entryDialog: MatDialog) { }

  triggerResize() {
    // Wait for changes to be applied, then trigger textarea resize.
    this._ngZone.onStable.pipe(take(1))
        .subscribe(() => this.autosize.resizeToFitContent(true));
  }

  ngOnInit() {
    this.newInfoTextList = this.updateContent.newInfoText;
  }
  ngAfterViewInit(): void {
    this.loadContent();
  }
  async loadContent(count= 5) {
    if (count < 0) {
      console.warn("could not load content from backend");
      return;
    }
    if (this.content.isFinished()) {
      const responseContent = this.content.getInfoText();
      const infoTextToTile = this.content.getInfoTextToTile();
      this.tileExpantionList = this.content.getTile();
      this.addCurrentInfoTextToTile(responseContent, infoTextToTile);
    } else {
      console.log("await for info text");
      setTimeout( () => this.loadContent(count - 1), count * 500 );
    }
  }

  addNewEntry(currEntry: NewInfoTextToTile = null) {
    const tileRef = this.content.getTile().filter(el => el.modalType === 2).map(el => new NewEntryObject(el.ID, el.titleName));
    const dialogRef = this.entryDialog.open(NewEntryModalComponent, {
      maxWidth: '50vw',
      maxHeight: '50vh',
      data:  {metaInfo: 'Kachel Nummer', listOfEntrys: tileRef}
    });

    dialogRef.afterClosed().subscribe((result: number) => {
      console.log('The dialog was closed');
      if (!result) {
        return;
      }
      if (currEntry) {
        const indexElement = this.newInfoTextList.findIndex(compE => compE === currEntry);
        if (indexElement >= 0) {
          const newEntry = this.newInfoTextList[indexElement];
          newEntry.relation.fk_tile = result;
          this.newInfoTextList[indexElement] = newEntry;
        }
      } else {
        this.addNewInfoTextToTile(result);
      }
    });
  }

  removeEntry(entryObject: NewInfoTextToTile) {
    this.updateContent.deleteNextInfoTile(entryObject);
  }

  addCurrentInfoTextToTile(entryInfo: InfoText[], relation: InfoTextToTile[]) {
    relation.forEach(el => {
      const infoTileEntry = entryInfo.find(obj => obj.ID === el.ID);
      if (infoTileEntry) {
        const newInftoTile = new NewInfoTextToTile(infoTileEntry, el);
        this.updateContent.updateNextInfoTile(newInftoTile);
      }
    });
  }

  addNewInfoTextToTile(tileId: number) {
    this.updateContent.getNextInfoTile(tileId);
  }

  getTileName(entryObject: NewInfoTextToTile) {
    return this.content.getTile().filter(el => el.ID === entryObject.relation.fk_tile)[0];
  }

  showImageDetails(id: number) {
    if (this.showImageDetailsStack.has(id)) {
      this.showImageDetailsStack.delete(id);
    } else {
      this.showImageDetailsStack.add(id);
    }
  }

  isImageDetailsActive(id: number) {
    return this.showImageDetailsStack.has(id);
  }

  trigger_refresh() {
    this.content.loadAll();
    this.loadContent();
  }

  hasImage(id: number) {
    return this.content.hasImageByFkId(null, id, null);
  }

  saveCurrentChanges(objs: NewInfoTextToTile) {
    console.log("save current changes");
    this.updateContent.sendSpecificNextInfoTextTileChangesToBackend(objs);
  }
}

