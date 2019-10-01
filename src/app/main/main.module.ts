import { BackendRequestService } from './../service/backend-request/backend-request.service';
import { LoadContentService } from './../service/load-content/load-content.service';
import { RouterModule } from '@angular/router';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MainComponent } from './main.component';
import { NavbarComponent } from './navbar/navbar.component';
import { LayoutModule } from '@angular/cdk/layout';
import { DashboardComponent } from './dashboard/dashboard.component';
import { DragDropComponent } from './drag-drop/drag-drop.component';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TileEditComponent } from './tile-edit/tile-edit.component';
import { MainRoutingModule } from './main-routing.module';
import {MAT_FORM_FIELD_DEFAULT_OPTIONS} from '@angular/material/form-field';
import { MaterialDependencieModule } from '../material.module';
import { ImageEditComponent, ImagePreviewModal } from './tile-edit/image-edit/image-edit.component';
import { InfoEditComponent } from './tile-edit/info-edit/info-edit.component';
import { ApartmentEditComponent } from './tile-edit/apartment-edit/apartment-edit.component';

@NgModule({
  declarations: [
    MainComponent,
    NavbarComponent,
    DashboardComponent,
    DragDropComponent,
    TileEditComponent,
    ImageEditComponent,
    InfoEditComponent,
    ApartmentEditComponent,
    ImagePreviewModal
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
    BackendRequestService, LoadContentService
  ],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
  entryComponents: [
    ImagePreviewModal
  ]
})
export class MainModule { }