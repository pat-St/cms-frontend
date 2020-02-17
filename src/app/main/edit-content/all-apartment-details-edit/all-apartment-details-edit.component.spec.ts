import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AllApartmentDetailsEditComponent } from './all-apartment-details-edit.component';

describe('AllApartmentDetailsEditComponent', () => {
  let component: AllApartmentDetailsEditComponent;
  let fixture: ComponentFixture<AllApartmentDetailsEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AllApartmentDetailsEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AllApartmentDetailsEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
