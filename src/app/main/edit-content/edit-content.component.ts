import { LoadContentService } from './../../service/load-content/load-content.service';
import { Component, OnInit, ViewChild, NgZone, ChangeDetectorRef, AfterViewChecked } from '@angular/core';
import { CdkTextareaAutosize } from '@angular/cdk/text-field';
import {take} from 'rxjs/operators';

@Component({
  selector: 'app-edit-content',
  templateUrl: './edit-content.component.html',
  styleUrls: ['./edit-content.component.styl']
})
export class EditContentComponent implements OnInit, AfterViewChecked {

  @ViewChild('autosize', {static: false}) autosize: CdkTextareaAutosize;

  spinnerValue = 0;

  constructor(private content: LoadContentService, private _ngZone: NgZone, private cdRef : ChangeDetectorRef) { }

  ngOnInit() {
    if (!this.content.isFinished()) {
      this.content.loadAll();
    }
  }
  triggerResize() {
    // Wait for changes to be applied, then trigger textarea resize.
    this._ngZone.onStable.pipe(take(1))
        .subscribe(() => this.autosize.resizeToFitContent(true));
  }

  isFinished() {
    return this.content.isFinished();
  }
  ngAfterViewChecked(): void {
    if (this.content.isFinished()) {
      this.cdRef.detectChanges();
    }
  }

  trigger_refresh() {
    this.content.loadAll();
  }

  getSpinnerValue() {
    return Math.round((this.content.getCounter() / this.content.maxCounter) * 100);
  }

}
