import { NewEntryModalComponent } from './../../custom-info-modal/new-entry-modal.component';
import { MatDialog } from '@angular/material';
import { ApartmentDetails } from './../../../model/apartment';
import { Component, OnInit, AfterViewInit, ViewChild, NgZone } from '@angular/core';
import { UpdateContentService } from 'src/app/service/update-content/update-content.service';
import { ApartmentDetailsContentService } from 'src/app/service/update-content/apartment-details-content.service';
import { ApartmentContentService } from 'src/app/service/update-content/apartment-content.service';
import {CdkTextareaAutosize} from '@angular/cdk/text-field';
import {take} from 'rxjs/operators';

@Component({
  selector: 'app-all-apartment-details-edit',
  templateUrl: './all-apartment-details-edit.component.html',
  styleUrls: ['./all-apartment-details-edit.component.styl']
})
export class AllApartmentDetailsEditComponent implements OnInit, AfterViewInit {
  apartmentDetailsList: Array<ApartmentDetails>;

  @ViewChild('autosize', {static: false}) autosize: CdkTextareaAutosize;

  constructor(
    private _ngZone: NgZone,
    private updateDetails: ApartmentDetailsContentService,
    private entryDialog: MatDialog) { }


  triggerResize() {
    // Wait for changes to be applied, then trigger textarea resize.
    this._ngZone.onStable.pipe(take(1))
        .subscribe(() => this.autosize.resizeToFitContent(true));
  }

  ngOnInit() {
    this.apartmentDetailsList = this.updateDetails.newApartmentDetails;
  }

  ngAfterViewInit() {

  }

  addNewEntry(currEntry: ApartmentDetails = null) {
    if (currEntry != null) {
      const indexElement = this.apartmentDetailsList.findIndex(compE => compE === currEntry);
      if (indexElement >= 0) {
        const newEntry = this.apartmentDetailsList[indexElement];
        newEntry.changed = true;
        newEntry.identifier = currEntry.identifier;
        this.apartmentDetailsList[indexElement] = newEntry;
      }
    } else {
      const nextId = this.updateDetails.nextIdOf(this.apartmentDetailsList.map(el => el.ID));
      this.updateDetails.addDetailsEntry(new ApartmentDetails(nextId, "", false, false));
    }
  }

  removeEntry(entryObject: ApartmentDetails) {
    this.updateDetails.deleteNextDetails(entryObject);
  }

  filterView(apartComp: ApartmentDetails) {
    return !apartComp.deleteEntry;
  }
}
