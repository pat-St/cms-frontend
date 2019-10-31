import { NewEntryObject } from 'src/app/model/infoText';
import { NewEntryModalComponent } from './../../image-preview-modal/new-entry-modal.component';
import { NewApartmentObject, ApartmentDetails } from 'src/app/model/apartment';
import { ApartmentContent, ApartmentDescription, ApartmentPrice, DetailsToApartment } from './../../../model/apartment';
import { LoadContentService } from '../../../service/load-content/load-content.service';
import { Component, OnInit, AfterViewInit, NgZone, ViewChild, Input } from '@angular/core';
import {CdkTextareaAutosize} from '@angular/cdk/text-field';
import {take} from 'rxjs/operators';
import { Tile } from 'src/app/model/tile';
import { UpdateContentService } from 'src/app/service/update-content/update-content.service';
import { MatDialog } from '@angular/material';

@Component({
  selector: 'app-all-apartment-edit',
  templateUrl: './all-apartment-edit.component.html',
  styleUrls: ['./all-apartment-edit.component.styl']
})
export class AllApartmentEditComponent implements OnInit, AfterViewInit {
  apartmentExpansionList: Array<NewApartmentObject> ;
  tileExpantionList: Array<Tile>;
  apartmentDetailsList: Array<ApartmentDetails>;
  showImageDetailsStack: Set<number> = new Set();

  @ViewChild('autosize', {static: false}) autosize: CdkTextareaAutosize;

  constructor(
    private _ngZone: NgZone,
    private updateContent: UpdateContentService,
    private entryDialog: MatDialog) { }

  triggerResize() {
    // Wait for changes to be applied, then trigger textarea resize.
    this._ngZone.onStable.pipe(take(1))
        .subscribe(() => this.autosize.resizeToFitContent(true));
  }

  ngOnInit() {
    this.apartmentExpansionList = this.updateContent.newApartment;
    this.tileExpantionList = this.updateContent.newTile;
    this.apartmentDetailsList = this.updateContent.newApartmentDetails;
  }

  ngAfterViewInit(): void {
  }

  addNewEntry(currEntry: NewApartmentObject = null) {
    const tileRef = this.updateContent.newTile.filter(el => el.modalType === 0).map(el => new NewEntryObject(el.ID, el.titleName));
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
        const indexElement = this.apartmentExpansionList.findIndex(compE => compE === currEntry);
        if (indexElement >= 0) {
          const newEntry = this.apartmentExpansionList[indexElement];
          newEntry.content.fk_tile = result;
          this.apartmentExpansionList[indexElement] = newEntry;
        }
      } else {
        this.updateContent.createNextApartment(result);
      }
    });
  }

  removeEntry(entryObject: NewApartmentObject) {
    this.updateContent.deleteNextApartment(entryObject);
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


  hasImage(id: number) {
    return this.updateContent.hasImageByFkId(null, id, null);
  }
}

