import { ApartmentContent } from './../../../model/apartment';
import { LoadContentService } from '../../../service/load-content/load-content.service';
import { Component, OnInit, AfterViewInit, NgZone, ViewChild, Input } from '@angular/core';
import {CdkTextareaAutosize} from '@angular/cdk/text-field';
import {take} from 'rxjs/operators';
import { Tile } from 'src/app/model/tile';


@Component({
  selector: 'app-all-apartment-edit',
  templateUrl: './all-apartment-edit.component.html',
  styleUrls: ['./all-apartment-edit.component.styl']
})
export class AllApartmentEditComponent implements OnInit, AfterViewInit {
  apartmentExpansionList: Array<ApartmentContent> = new Array();
  tileExpantionList: Array<Tile> = new Array();
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
      const responseContent = this.content.getApartmentContent();
      const tileContent = this.content.getTile();
      this.addApartmentEntry(responseContent);
      this.addTileEntry(tileContent);
    } else {
      console.log("await for info text");
      setTimeout( () => this.loadContent(count - 1), count * 500 );
    }
  }

  addNewEntry() {
    const newEntry: ApartmentContent = new ApartmentContent();
    if (!this.apartmentExpansionList.some((element: ApartmentContent) => element.ID === newEntry.ID)) {
      this.apartmentExpansionList.push(newEntry);
    }
  }

  removeEntry(entryObject: ApartmentContent) {
    if (this.apartmentExpansionList.includes(entryObject)) {
      const indexOf = this.apartmentExpansionList.indexOf(entryObject);
      this.apartmentExpansionList.splice(indexOf, 1);
    }
  }
  addApartmentEntry(entryObject: ApartmentContent[]) {
    entryObject.forEach((element: ApartmentContent) => {
      const indexElement = this.apartmentExpansionList.findIndex((compE: ApartmentContent) => compE.ID === element.ID)
      if (indexElement >= 0) {
        this.apartmentExpansionList.splice(indexElement, 1);
      }
      this.apartmentExpansionList.push(element);
    });
  }
  addTileEntry(entryObject: Tile[]) {
    entryObject.forEach((element: Tile) => {
      const indexElement = this.tileExpantionList.findIndex((compE: Tile) => compE.ID === element.ID)
      if (indexElement >= 0) {
        this.tileExpantionList.splice(indexElement, 1);
      }
      this.tileExpantionList.push(element);
    });
  }

  getTileName(entryObject: ApartmentContent) {
    return this.tileExpantionList.filter(element => element.ID === entryObject.fk_tile).map(element => element.titleName)[0];
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

