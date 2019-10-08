import { LoadContentService } from '../../../service/load-content/load-content.service';
import { Component, OnInit, AfterViewInit, NgZone, ViewChild, Input } from '@angular/core';
import {CdkTextareaAutosize} from '@angular/cdk/text-field';
import {take} from 'rxjs/operators';
import { InfoText, InfoTextToTile } from 'src/app/model/infoText';

@Component({
  selector: 'app-all-info-text-edit',
  templateUrl: './all-info-text-edit.component.html',
  styleUrls: ['./all-info-text-edit.component.styl']
})
export class AllInfoTextEditComponent implements OnInit, AfterViewInit {
  infoTextExpansionList: Array<InfoText> = new Array();
  infoTextToTileList: Array<InfoTextToTile> = new Array();
  showImageDetailsStack: Set<number> = new Set();

  @ViewChild('autosize', {static: false}) autosize: CdkTextareaAutosize;

  constructor(private content: LoadContentService, private _ngZone: NgZone) { }

  triggerResize() {
    // Wait for changes to be applied, then trigger textarea resize.
    this._ngZone.onStable.pipe(take(1))
        .subscribe(() => this.autosize.resizeToFitContent(true));
  }

  ngOnInit() { }
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
      this.addInfoTextListFromTile(responseContent);
      this.addInfoTextToTileList(infoTextToTile);
    } else {
      console.log("await for info text");
      setTimeout( () => this.loadContent(count - 1), count * 500 );
    }
  }

  addNewEntry() {
    const newEntry: InfoText = new InfoText();
    if (!this.infoTextExpansionList.some((element: InfoText) => element.ID === newEntry.ID)) {
      this.infoTextExpansionList.push(newEntry);
    }
  }
  addNewInfoTextToTileEntry() {
    const newEntry: InfoTextToTile = new InfoTextToTile(null,null,null);
    if (!this.infoTextToTileList.some((element: InfoTextToTile) => element.ID === newEntry.ID)) {
      this.infoTextToTileList.push(newEntry);
    }
  }

  removeEntry(entryObject: InfoText) {
    if (this.infoTextExpansionList.includes(entryObject)) {
      const indexOf = this.infoTextExpansionList.indexOf(entryObject);
      this.infoTextExpansionList.splice(indexOf, 1);
    }
  }
  addInfoTextListFromTile(entryObject: InfoText[]) {
    entryObject.forEach((element: InfoText) => {
      const indexElement = this.infoTextExpansionList.findIndex((compE: InfoText) => compE.ID === element.ID)
      if (indexElement >= 0) {
        this.infoTextExpansionList.splice(indexElement, 1);
      }
      this.infoTextExpansionList.push(element);
    });
  }
  addInfoTextToTileList(entryObject: InfoTextToTile[]) {
    entryObject.forEach((element: InfoTextToTile) => {
      const indexElement = this.infoTextToTileList.findIndex((compE: InfoTextToTile) => compE.ID === element.ID)
      if (indexElement >= 0) {
        this.infoTextToTileList.splice(indexElement, 1);
      }
      this.infoTextToTileList.push(element);
    });
  }
  getTileId(entryObject: InfoText) {
    return this.infoTextToTileList.filter(element => element.fk_info === entryObject.ID)[0];
  }

  showImageDetails(id: number) {
    if(this.showImageDetailsStack.has(id)) {
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
}

