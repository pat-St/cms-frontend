import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ApartmentDetailsEditComponent } from './apartment-details-edit.component';

describe('ApartmentDetailsEditComponent', () => {
  let component: ApartmentDetailsEditComponent;
  let fixture: ComponentFixture<ApartmentDetailsEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ApartmentDetailsEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ApartmentDetailsEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
