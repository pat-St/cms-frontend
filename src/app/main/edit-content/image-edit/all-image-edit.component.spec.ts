import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AllImageEditComponent } from './all-image-edit.component';

describe('ImageEditComponent', () => {
  let component: AllImageEditComponent;
  let fixture: ComponentFixture<AllImageEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AllImageEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AllImageEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
