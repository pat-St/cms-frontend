import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AllApartmentEditComponent } from './all-apartment-edit.component';

describe('AllApartmentEditComponent', () => {
  let component: AllApartmentEditComponent;
  let fixture: ComponentFixture<AllApartmentEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AllApartmentEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AllApartmentEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
