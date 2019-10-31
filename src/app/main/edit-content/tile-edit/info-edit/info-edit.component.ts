import { LoadContentService } from '../../../../service/load-content/load-content.service';
import { Component, OnInit, AfterViewInit, NgZone, ViewChild, Input } from '@angular/core';
import {CdkTextareaAutosize} from '@angular/cdk/text-field';
import {take} from 'rxjs/operators';
import { InfoText, InfoTextToTile, NewInfoTextToTile } from 'src/app/model/infoText';
import { UpdateContentService } from 'src/app/service/update-content/update-content.service';

@Component({
  selector: 'app-info-edit',
  templateUrl: './info-edit.component.html',
  styleUrls: ['./info-edit.component.styl']
})
export class InfoEditComponent implements OnInit, AfterViewInit {

  infoTextExpansionList: Array<NewInfoTextToTile> = new Array();

  showImageDetailsStack: Set<number> = new Set();

  @ViewChild('autosize', {static: false}) autosize: CdkTextareaAutosize;

  @Input() tileID: number;

  constructor(private updateContent: UpdateContentService, private _ngZone: NgZone) { }

  triggerResize() {
    // Wait for changes to be applied, then trigger textarea resize.
    this._ngZone.onStable.pipe(take(1))
        .subscribe(() => this.autosize.resizeToFitContent(true));
  }

  ngOnInit() {
    this.infoTextExpansionList = this.updateContent.newInfoText;
  }
  ngAfterViewInit(): void {
  }


  addNewEntry() {
    this.updateContent.getNextInfoTile(this.tileID)
  }

  removeEntry(entryObject: NewInfoTextToTile) {
    this.updateContent.deleteNextInfoTile(entryObject);
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
