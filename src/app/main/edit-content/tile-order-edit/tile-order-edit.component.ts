import { UpdateContentService } from './../../../service/update-content/update-content.service';
import { TileOrderContentService } from './../../../service/update-content/tile-order-content.service';
import { TileOrder } from './../../../model/tile';
import { CdkTextareaAutosize } from '@angular/cdk/text-field';
import { Component, OnInit, ViewChild } from '@angular/core';
import {CdkDragDrop, moveItemInArray} from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-tile-order-edit',
  templateUrl: './tile-order-edit.component.html',
  styleUrls: ['./tile-order-edit.component.styl']
})
export class TileOrderEditComponent implements OnInit {

  @ViewChild('autosize', {static: false}) autosize: CdkTextareaAutosize;

  tileOrderExpansionList: Array<TileOrder> = new Array();

  constructor(
    private updateContent: TileOrderContentService,
    private tileContent: UpdateContentService
  ) { }

  ngOnInit(): void {
    this.tileOrderExpansionList = this.updateContent.newTileOder;
  }

  getTileTitle(tileID: number): string {
    return this.tileContent.newTile.findIndex(el => el.ID === tileID) > -1 ?
    this.tileContent.newTile.find(el => el.ID === tileID).titleName : "";
  }

  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.tileOrderExpansionList, event.previousIndex, event.currentIndex);
    const start = Math.min(event.previousIndex, event.currentIndex);
    const end = Math.max(event.previousIndex, event.currentIndex);
    this.updateIndex(start, end);
  }

  private updateIndex(start: number, end?: number) {
    if (!end || end >= this.tileOrderExpansionList.length) {
      end = this.tileOrderExpansionList.length - 1;
    }
    if (start === end || start > end || start < 0) {
      return;
    }
    let decreaseIndexByDeleted = 0;
    for (let i = start; i <= end; i++) {
      if (this.tileOrderExpansionList[i].deleteEntry) {
        decreaseIndexByDeleted++;
      }
      this.tileOrderExpansionList[i].seqNum = i - decreaseIndexByDeleted;
      this.tileOrderExpansionList[i].changed = true;
    }
  }

}
