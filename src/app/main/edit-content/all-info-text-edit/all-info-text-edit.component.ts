import { ImageContentService } from './../../../service/update-content/image-content.service';
import { InfoTextService } from './../../../service/update-content/info-text.service';
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
  tileExpantionList: Array<Tile>;
  newInfoTextList: Array<NewInfoTextToTile>;
  showImageDetailsStack: Set<number> = new Set();

  @ViewChild('autosize', {static: false}) autosize: CdkTextareaAutosize;

  @Input() tileID: number;

  constructor(
    private _ngZone: NgZone,
    private updateInfoText: InfoTextService,
    private updateContent: UpdateContentService,
    private updateImage: ImageContentService,
    private entryDialog: MatDialog) { }

  triggerResize() {
    // Wait for changes to be applied, then trigger textarea resize.
    this._ngZone.onStable.pipe(take(1))
        .subscribe(() => this.autosize.resizeToFitContent(true));
  }

  ngOnInit() {
    this.newInfoTextList = this.updateInfoText.newInfoText;
    this.tileExpantionList = this.updateContent.newTile;
  }
  ngAfterViewInit(): void { }

  addNewEntry(currEntry: NewInfoTextToTile = null) {
    const tileRef = this.tileExpantionList.filter(el => el.modalType === 2).map(el => new NewEntryObject(el.ID, el.titleName));
    const dialogRef = this.entryDialog.open(NewEntryModalComponent, {
      maxWidth: '50vw',
      maxHeight: '50vh',
      data:  {metaInfo: 'Kachel Nummer', listOfEntrys: tileRef}
    });

    dialogRef.afterClosed().subscribe((result: number) => {
      console.log('The dialog was closed');
      if (result == null) {
        console.log("no response")
        return;
      }
      if (currEntry != null) {
        const indexElement = this.newInfoTextList.findIndex(compE => compE === currEntry);
        if (indexElement >= 0) {
          // const newEntry = this.newInfoTextList[indexElement];
          // newEntry.relation.fk_tile = result;
          this.newInfoTextList[indexElement].relation.fk_tile = result;
        }
      } else {
        this.addNewInfoTextToTile(result);
      }
    });
  }

  removeEntry(entryObject: NewInfoTextToTile) {
    this.updateInfoText.deleteNextInfoTile(entryObject);
  }

  addNewInfoTextToTile(tileId: number) {
    this.updateInfoText.getNextInfoTile(tileId);
  }

  getTileName(entryObject: NewInfoTextToTile) {
    return this.tileExpantionList.filter(el => el.ID === entryObject.relation.fk_tile).map(el => el.titleName)[0];
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

  hasImage(id: number) {
    return this.updateImage.hasImageByFkId(null, id, null);
  }

  saveCurrentChanges(objs: NewInfoTextToTile) {
    console.log("save current changes");
    this.updateInfoText.sendSpecificChangesToBackend(objs);
  }

  filterView(infoComp: NewInfoTextToTile) {
    if (this.tileID) {
      return infoComp.relation.fk_tile === this.tileID;
    }
    return !infoComp.deleteEntry;
  }
}

