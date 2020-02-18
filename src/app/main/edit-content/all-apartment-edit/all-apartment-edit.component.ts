import { ApartmentDetailsContentService } from './../../../service/update-content/apartment-details-content.service';
import { ImageContentService } from './../../../service/update-content/image-content.service';
import { ApartmentContentService } from './../../../service/update-content/apartment-content.service';
import { NewEntryObject } from 'src/app/model/infoText';
import { NewEntryModalComponent } from '../../custom-info-modal/new-entry-modal.component';
import { NewApartmentObject, ApartmentDetails } from 'src/app/model/apartment';
import { ApartmentContent, ApartmentDescription, ApartmentPrice, DetailsToApartment } from './../../../model/apartment';
import { LoadContentService } from '../../../service/load-content/load-content.service';
import { Component, OnInit, AfterViewInit, NgZone, ViewChild, Input } from '@angular/core';
import {CdkTextareaAutosize} from '@angular/cdk/text-field';
import {take} from 'rxjs/operators';
import { Tile } from 'src/app/model/tile';
import { UpdateContentService } from 'src/app/service/update-content/update-content.service';
import { MatDialog } from '@angular/material/dialog';

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

  @Input() tileID: number;

  constructor(
    private _ngZone: NgZone,
    private updateContent: UpdateContentService,
    private updateApartment: ApartmentContentService,
    private updateDetails: ApartmentDetailsContentService,
    private updateImage: ImageContentService,
    private entryDialog: MatDialog) { }

  triggerResize() {
    // Wait for changes to be applied, then trigger textarea resize.
    this._ngZone.onStable.pipe(take(1))
        .subscribe(() => this.autosize.resizeToFitContent(true));
  }

  ngOnInit() {
    this.apartmentExpansionList = this.updateApartment.newApartment;
    this.tileExpantionList = this.updateContent.newTile;
    this.apartmentDetailsList = this.updateDetails.newApartmentDetails;
  }

  ngAfterViewInit(): void { }

  addNewEntry(currEntry: NewApartmentObject = null) {
    const tileRef = this.tileExpantionList
      .filter(el => el.modalType === 0)
      .filter(el => this.apartmentExpansionList.findIndex(i => i.content.fk_tile === el.ID) < 0)
      .map(el => new NewEntryObject(el.ID, el.titleName));
    const dialogRef = this.entryDialog.open(NewEntryModalComponent, {
      maxWidth: '50vw',
      maxHeight: '50vh',
      data:  {metaInfo: 'Kachel Nummer', listOfEntrys: tileRef}
    });

    dialogRef.afterClosed().subscribe((result: number) => {
      console.log('The dialog was closed');
      if (result == null) {
        return;
      }
      if (currEntry != null) {
        const indexElement = this.apartmentExpansionList.findIndex(compE => compE === currEntry);
        if (indexElement >= 0) {
          const newEntry = this.apartmentExpansionList[indexElement];
          newEntry.content.fk_tile = result;
          this.apartmentExpansionList[indexElement] = newEntry;
        }
      } else {
        this.updateApartment.getNextApartmentTile(result);
      }
    });
  }

  removeEntry(entryObject: NewApartmentObject) {
    this.updateApartment.deleteNextApartment(entryObject);
  }

  getTileName(entryObject: ApartmentContent) {
    return this.tileExpantionList.filter(element => element.ID === entryObject.fk_tile).map(element => element.titleName)[0];
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

  filterView(apartComp: NewApartmentObject) {
    if (this.tileID) {
      return apartComp.content.fk_tile === this.tileID;
    }
    return !apartComp.deleteEntry;
  }
}

