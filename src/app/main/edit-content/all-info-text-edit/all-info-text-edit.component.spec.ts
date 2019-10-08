import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AllInfoTextEditComponent } from './all-info-text-edit.component';

describe('AllInfoTextEditComponent', () => {
  let component: AllInfoTextEditComponent;
  let fixture: ComponentFixture<AllInfoTextEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AllInfoTextEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AllInfoTextEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
