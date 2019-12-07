import { FormSelectModel } from './../../../model/tileEdit/tileEdit';
import { NewEntryModalComponent } from './../../image-preview-modal/new-entry-modal.component';
import { NewEntryObject } from 'src/app/model/infoText';
import { InfoTextService } from './../../../service/update-content/info-text.service';
import { BackendRequestService } from './../../../service/backend-request/backend-request.service';
import { ImageContentService } from './../../../service/update-content/image-content.service';
import { ImagePreviewModalComponent } from '../../image-preview-modal/image-preview-modal.component';
import { LoadContentService } from '../../../service/load-content/load-content.service';
import { Image } from '../../../model/image';
import { Component, OnInit, ViewChild, NgZone, AfterViewInit, Input } from '@angular/core';
import { CdkTextareaAutosize } from '@angular/cdk/text-field';
import {take} from 'rxjs/operators';
import { MatDialog } from '@angular/material';
import { element } from 'protractor';
import { UpdateContentService } from 'src/app/service/update-content/update-content.service';
import { TouchSequence } from 'selenium-webdriver';
import { ApartmentContentService } from 'src/app/service/update-content/apartment-content.service';

@Component({
  selector: 'app-all-image-edit',
  templateUrl: './all-image-edit.component.html',
  styleUrls: ['./all-image-edit.component.styl']
})
export class AllImageEditComponent implements OnInit, AfterViewInit {

  imageExpansionList: Array<Image> = new Array();

  allTileList: Array<FormSelectModel>      = this.getAllTileList()
  allApartmentList: Array<FormSelectModel> = this.getAllApartmentList() 
  allInfoTextList: Array<FormSelectModel>  = this.getAllInfoTextList() 

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
    private backend: BackendRequestService,
    private entryDialog: MatDialog,
    private _ngZone: NgZone, public dialog: MatDialog) { }

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
    // this.allTileList =      this.getAllTileList()
    // this.allApartmentList = this.getAllApartmentList()
    // this.allInfoTextList =  this.getAllInfoTextList()
  }

  ngAfterViewInit(): void {
  }

  onFileChanged(id: number,event) {
    this.backend.uploadImageFromUser(id,event.target.files[0]);
    const changedObj = this.imageExpansionList.find(el => el.ID === id)
    this.updateImage.updateNewImage(changedObj)
  }

  private getNameOfTileRef(id: number): string {
    const listOf = this.updateContent.newTile.filter(el => el.ID === id).map(i => i.titleName)
    return listOf.length < 1 ? "NaN" : listOf[0]
  }

  private getAllTileList(): FormSelectModel[] {
    let tmp = []
    this.updateContent.newTile
     .forEach(el => tmp.push(new FormSelectModel(el.titleName,el.ID as any)));
     console.log("Tile Ref " + JSON.stringify(tmp))
    return tmp;
  }

  private getAllApartmentList(): FormSelectModel[] {
    let tmp = []
    this.updateApartment.newApartment
    .forEach(el => {
      tmp.push(new FormSelectModel(this.getNameOfTileRef(el.content.fk_tile),el.content.ID as any))
    })
    console.log("Apartment Ref " + JSON.stringify(tmp))
    return tmp
  }

  private getAllInfoTextList(): FormSelectModel[] {
    let tmp = []
    this.updateInfoText.newInfoText
    .forEach(el => {
      tmp.push(new FormSelectModel(el.infoText.headerText,el.infoText.ID as any))
    })
    console.log("Info Text Ref " + JSON.stringify(tmp))
    return tmp
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
        const tileRef = this.getAllTileList().map(el => new NewEntryObject(el.desc,el.value))
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
        const apartRef = this.getAllApartmentList().map(el => new NewEntryObject(el.desc,el.value))
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
        const infoTileRef = this.getAllInfoTextList().map(el => new NewEntryObject(el.desc,el.value))
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
      return imComp.fk_apartment === this.apartmentID
    }
    if (this.infoTextID != null) {
      return imComp.fk_info === this.infoTextID
    }
    if (this.tileID != null) {
      return imComp.fk_tile === this.tileID
    }
    return !imComp.deleteEntry;
  }

}

