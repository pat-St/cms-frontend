import { LoadContentService } from './../../../service/load-content/load-content.service';
import { Component, OnInit, AfterViewInit, NgZone, ViewChild, Input } from '@angular/core';
import {CdkTextareaAutosize} from '@angular/cdk/text-field';
import {take} from 'rxjs/operators';
import { InfoText, InfoTextToTile } from 'src/app/model/infoText';

@Component({
  selector: 'app-info-edit',
  templateUrl: './info-edit.component.html',
  styleUrls: ['./info-edit.component.styl']
})
export class InfoEditComponent implements OnInit, AfterViewInit {

  infoTextExpansionList: Array<InfoText> = new Array();

  showImageDetailsStack: Set<number> = new Set();

  @ViewChild('autosize', {static: false}) autosize: CdkTextareaAutosize;

  @Input() tileID: number;

  constructor(private content: LoadContentService, private _ngZone: NgZone) { }

  triggerResize() {
    // Wait for changes to be applied, then trigger textarea resize.
    this._ngZone.onStable.pipe(take(1))
        .subscribe(() => this.autosize.resizeToFitContent(true));
  }

  ngOnInit() {
    if (!this.content.getInfoText()) {
      this.content.loadInfoText();
    }
    if (!this.content.getInfoTextToTile()) {
      this.content.loadTextToTile();
    }
  }
  ngAfterViewInit(): void {
    if (this.tileID) {
      this.loadContent();
    }
  }
  async loadContent(count= 5) {
    if (count < 0) {
      console.warn("could not load content from backend");
      return;
    }
    const responseContent = this.content.getInfoText();
    const infoTextToTile = this.content.getInfoTextToTile();
    if (responseContent && infoTextToTile) {
      const listOfRefObjects: number[] = infoTextToTile.filter(element => element.fk_tile === this.tileID).map(element => element.fk_info);
      this.addInfoTextListFromTile(responseContent, listOfRefObjects);
    } else {
      console.log("await for info text");
      setTimeout( () => this.loadContent(count - 1), 1000 );
    }
  }

  addNewEntry() {
    const newEntry: InfoText = new InfoText();
    if (!this.infoTextExpansionList.some((element: InfoText) => element.ID === newEntry.ID)) {
      this.infoTextExpansionList.push(newEntry);
    }
  }

  removeEntry(entryObject: InfoText) {
    if (this.infoTextExpansionList.includes(entryObject)) {
      const indexOf = this.infoTextExpansionList.indexOf(entryObject);
      this.infoTextExpansionList.splice(indexOf, 1);
    }
  }
  addInfoTextListFromTile(entryObject: InfoText[], refObject: number[]) {
    entryObject.filter(element => refObject.includes(element.ID) ).forEach((element: InfoText) => {
      const indexElement = this.infoTextExpansionList.findIndex((compE: InfoText) => compE.ID === element.ID)
      if (indexElement >= 0) {
        this.infoTextExpansionList.splice(indexElement, 1);
      }
      this.infoTextExpansionList.push(element);
    });
  }

  addEntryInTile(entryObject: InfoText, refObject: number[]) {
    if (!refObject.includes(entryObject.ID)) {
      return;
    }
    const indexElement = this.infoTextExpansionList.findIndex((compE: InfoText) => compE.ID === entryObject.ID)
    if (indexElement >= 0) {
      this.infoTextExpansionList.splice(indexElement, 1);
    }
    this.infoTextExpansionList.push(entryObject);
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
