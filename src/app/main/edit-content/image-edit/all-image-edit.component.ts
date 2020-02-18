import { NewInfoTextToTile } from './../../../model/infoText';
import { NewApartmentObject } from './../../../model/apartment';
import { FormSelectModel } from './../../../model/tileEdit/tileEdit';
import { NewEntryModalComponent } from '../../custom-info-modal/new-entry-modal.component';
import { NewEntryObject } from 'src/app/model/infoText';
import { InfoTextService } from './../../../service/update-content/info-text.service';
import { BackendRequestService } from './../../../service/backend-request/backend-request.service';
import { ImageContentService } from './../../../service/update-content/image-content.service';
import { ImagePreviewModalComponent } from '../../custom-info-modal/image-preview-modal.component';
import { LoadContentService } from '../../../service/load-content/load-content.service';
import { Image } from '../../../model/image';
import { Component, OnInit, ViewChild, NgZone, AfterViewInit, Input } from '@angular/core';
import { CdkTextareaAutosize } from '@angular/cdk/text-field';
import {take} from 'rxjs/operators';
import { MatDialog } from '@angular/material/dialog';
import { element } from 'protractor';
import { UpdateContentService } from 'src/app/service/update-content/update-content.service';
import { TouchSequence } from 'selenium-webdriver';
import { ApartmentContentService } from 'src/app/service/update-content/apartment-content.service';
import { Tile } from 'src/app/model/tile';

@Component({
  selector: 'app-all-image-edit',
  templateUrl: './all-image-edit.component.html',
  styleUrls: ['./all-image-edit.component.styl']
})
export class AllImageEditComponent implements OnInit, AfterViewInit {

  imageExpansionList: Array<Image> = new Array();

  apartmentContentList: Array<NewApartmentObject>;
  tileContentList: Array<Tile>;
  infoTextContextList: Array<NewInfoTextToTile>;

  @ViewChild('autosize', {static: false}) autosize: CdkTextareaAutosize;
  @Input() apartmentID: number = null;
  @Input() tileID: number = null;
  @Input() infoTextID: number = null;
  @Input() panelTitle = "Bilder";

  constructor(
    private updateImage: ImageContentService,
    private updateInfoText: InfoTextService,
    private updateContent: UpdateContentService,
    private updateApartment: ApartmentContentService,
    private loadBackend: LoadContentService,
    private entryDialog: MatDialog,
    private _ngZone: NgZone,
    public dialog: MatDialog) { }

  openDialog(imageObj: Image): void {
    const dialogRef = this.dialog.open(ImagePreviewModalComponent, {
      maxWidth: '97vw',
      maxHeight: '97vh',
      data: {image: imageObj}
    });

    dialogRef.afterClosed().subscribe(result => { console.log("Modal closed"); });
  }

  triggerResize() {
    // Wait for changes to be applied, then trigger textarea resize.
    this._ngZone.onStable.pipe(take(1))
        .subscribe(() => this.autosize.resizeToFitContent(true));
  }

  ngOnInit() {
    this.imageExpansionList = this.updateImage.newImage;
    this.apartmentContentList = this.updateApartment.newApartment;
    this.tileContentList = this.updateContent.newTile;
    this.infoTextContextList = this.updateInfoText.newInfoText;
  }

  ngAfterViewInit(): void { }

  onFileChanged(id: number,event) {
    this.loadBackend.uploadImageFromUser(id,event.target.files[0]);
    const changedObj = this.imageExpansionList.find(el => el.ID === id)
    this.updateImage.updateNewImage(changedObj)
  }

  private getNameOfTileRef(id: number): string {
    const listOf = this.updateContent.newTile.filter(el => el.ID === id).map(i => i.titleName)
    return listOf.length < 1 ? null : listOf[0];
  }

  getInfoTextName(id: number): string {
    if (id === null) {
      return "";
    }
    return this.infoTextContextList.filter(el => el.infoText.ID === id).map(el => el.infoText.headerText)[0]
  }

  getTileName(id: number): string {
    if (id === null) {
      return "";
    }
    return this.tileContentList.filter(el => el.ID === id).map(el => el.titleName)[0]
  }

  getApartmentName(id: number): string {
    if (id === null) {
      return "";
    }
    return this.apartmentContentList
      .filter(el => el.content.ID === id)
      .map(el => this.getNameOfTileRef(el.content.fk_tile))[0]
  }

  changeInfoText(obj: Image) {
    const tileRef = this.infoTextContextList
      .map(el => new NewEntryObject(el.infoText.ID as number, el.infoText.headerText));
    tileRef.push(new NewEntryObject(-1 as number, ""))
    this.entryDialog.open(NewEntryModalComponent, {
      maxWidth: '50vw',
      maxHeight: '50vh',
      data:  {metaInfo: 'Info Text Bild', listOfEntrys: tileRef}
    }).afterClosed().subscribe(
      (i) => {
        const index = this.imageExpansionList.findIndex(el => el.ID === obj.ID)
        if (i != null && i < 0) {
          this.imageExpansionList[index].fk_info = null;
        } 
        if (i > -1) {
          this.imageExpansionList[index].fk_info = i
        }
      }
    )
  }


  changeTile(obj: Image) {
    const tileRef = this.tileContentList
      .map(el => new NewEntryObject(el.ID as number, el.titleName));
    tileRef.push(new NewEntryObject(-1 as number, ""))
    this.entryDialog.open(NewEntryModalComponent, {
      maxWidth: '50vw',
      maxHeight: '50vh',
      data:  {metaInfo: 'Kachel Bild', listOfEntrys: tileRef}
    }).afterClosed().subscribe(
      (i) => {
        const index = this.imageExpansionList.findIndex(el => el.ID === obj.ID)
        if (i != null && i < 0) {
          this.imageExpansionList[index].fk_tile = null
        } 
        if (i > -1) {
          this.imageExpansionList[index].fk_tile = i
        }
      }
    )
  }

  changeApartment(obj: Image) {
    const tileRef = this.apartmentContentList
      .map(el => new NewEntryObject(el.content.ID as number, this.getNameOfTileRef(el.content.fk_tile)));
    tileRef.push(new NewEntryObject(-1 as number, ""))
    this.entryDialog.open(NewEntryModalComponent, {
      maxWidth: '50vw',
      maxHeight: '50vh',
      data:  {metaInfo: 'Ferienwohnung Bild', listOfEntrys: tileRef}
    }).afterClosed().subscribe(
      (i) => {
        const index = this.imageExpansionList.findIndex(el => el.ID === obj.ID)
        if (i != null && i < 0) {
          this.imageExpansionList[index].fk_apartment = null
        }
        if (i > -1) {
          this.imageExpansionList[index].fk_apartment = i;
        }
      }
    )
  }

  addNewEntry() {
    const selectRef = [new NewEntryObject(0,"Kachel Bild"), new NewEntryObject(1,"Apartment Bild"), new NewEntryObject(2,"InfoText Bild")]
    new Promise((resolve, reject) => {
      resolve("ok");
    })
    .then(() => 
      this.entryDialog.open(NewEntryModalComponent, {
        maxWidth: '50vw',
        maxHeight: '50vh',
        data:  {metaInfo: 'Bild Referenz', listOfEntrys: selectRef}
      }).afterClosed().toPromise()
    )
    .then((res: number) => {
      if (res === 0) {
        const tileRef = this.tileContentList
        .map(el => new NewEntryObject(el.ID as number, el.titleName));
        this.entryDialog.open(NewEntryModalComponent, {
          maxWidth: '50vw',
          maxHeight: '50vh',
          data:  {metaInfo: 'Kachel Bild', listOfEntrys: tileRef}
        }).afterClosed().subscribe(
          (i) => {
            if (i != null) {
              this.updateImage.getNextNewImage(i,this.apartmentID,this.infoTextID)
            }
          }
        )
      }
      if (res === 1) {
        const apartRef = this.apartmentContentList
        .map(el => new NewEntryObject(el.content.ID as number, this.getNameOfTileRef(el.content.fk_tile)));
        this.entryDialog.open(NewEntryModalComponent, {
          maxWidth: '50vw',
          maxHeight: '50vh',
          data:  {metaInfo: 'Apartment Bild', listOfEntrys: apartRef}
        }).afterClosed().subscribe(
          (i) => {
            if (i != null) {
              this.updateImage.getNextNewImage(this.tileID,i,this.infoTextID)
            }
          }
        )
      }
      if (res === 2) {
        const infoTileRef = this.infoTextContextList
        .map(el => new NewEntryObject(el.infoText.ID as number, el.infoText.headerText));
        this.entryDialog.open(NewEntryModalComponent, {
          maxWidth: '50vw',
          maxHeight: '50vh',
          data:  {metaInfo: 'InfoText Bild', listOfEntrys: infoTileRef}
        }).afterClosed().subscribe(
          (i) => {
            if (i != null) {
              this.updateImage.getNextNewImage(this.tileID,this.apartmentID,i)
            }
          }
        )
      }
      return true
    })
  }

  removeEntry(entryObject: Image) {
    this.updateImage.deleteNewImage(entryObject);
  }

  isChildComponent() {
    return this.apartmentID != null || this.infoTextID != null || this.tileID != null;
  }

  /**
   * If none parent id is set, every Image will shown
   * Otherwise, shows only Images with parent references
   * @param imComp The current Image wich will be shown 
   */
  filterView(imComp: Image) {
    if (this.apartmentID != null) {
      return imComp.fk_apartment === this.apartmentID;
    }
    if (this.infoTextID != null) {
      return imComp.fk_info === this.infoTextID;
    }
    if (this.tileID != null) {
      return imComp.fk_tile === this.tileID;
    }
    return !imComp.deleteEntry;
  }

}

