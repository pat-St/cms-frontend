import { ModifyModalComponent } from './custom-info-modal/modify-list-for-save.component';
import { environment } from './../../environments/environment';
import { RefreshModalComponent } from './custom-info-modal/refresh-information-modal.component';
import { ApartmentDetailsContentService } from './../service/update-content/apartment-details-content.service';
import { ImageContentService } from './../service/update-content/image-content.service';
import { InfoTextService } from './../service/update-content/info-text.service';
import { NewEntryModalComponent } from './custom-info-modal/new-entry-modal.component';
import { UpdateContentService } from './../service/update-content/update-content.service';
import { AllImageEditComponent } from './edit-content/image-edit/all-image-edit.component';
import { BackendRequestService } from './../service/backend-request/backend-request.service';
import { LoadContentService } from './../service/load-content/load-content.service';
import { RouterModule } from '@angular/router';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MainComponent } from './main.component';
import { NavbarComponent } from './navbar/navbar.component';
import { LayoutModule } from '@angular/cdk/layout';
import { DashboardComponent } from './dashboard/dashboard.component';
import { DragDropComponent } from './drag-drop/drag-drop.component';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TileEditComponent } from './edit-content/tile-edit/tile-edit.component';
import { MainRoutingModule } from './main-routing.module';
import {MAT_FORM_FIELD_DEFAULT_OPTIONS} from '@angular/material/form-field';
import { MaterialDependencieModule } from '../material.module';
import { EditContentComponent } from './edit-content/edit-content.component';
import { ImagePreviewModalComponent } from './custom-info-modal/image-preview-modal.component';
import { AllInfoTextEditComponent } from './edit-content/all-info-text-edit/all-info-text-edit.component';
import { AllApartmentEditComponent } from './edit-content/all-apartment-edit/all-apartment-edit.component';
import { ApartmentDetailsEditComponent } from './edit-content/all-apartment-edit/apartment-details-edit/apartment-details-edit.component';
import { ApartmentContentService } from '../service/update-content/apartment-content.service';

@NgModule({
  declarations: [
    MainComponent,
    NavbarComponent,
    DashboardComponent,
    DragDropComponent,
    TileEditComponent,
    AllImageEditComponent,
    EditContentComponent,
    ImagePreviewModalComponent,
    NewEntryModalComponent,
    RefreshModalComponent,
    ModifyModalComponent,
    AllInfoTextEditComponent,
    AllApartmentEditComponent,
    ApartmentDetailsEditComponent
  ],
  imports: [
    CommonModule,
    LayoutModule,
    DragDropModule,
    RouterModule,
    MainRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialDependencieModule
  ],
  providers: [
    { provide: MAT_FORM_FIELD_DEFAULT_OPTIONS, useValue: { appearance: 'outline' } },
    BackendRequestService,
    LoadContentService,
    UpdateContentService,
    InfoTextService,
    ImageContentService,
    ApartmentDetailsContentService,
    ApartmentContentService
  ],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
  entryComponents: [
    ImagePreviewModalComponent,
    NewEntryModalComponent,
    RefreshModalComponent,
    ModifyModalComponent
  ]
})
export class MainModule { }
