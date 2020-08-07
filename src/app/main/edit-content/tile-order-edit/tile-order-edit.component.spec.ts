import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TileOrderEditComponent } from './tile-order-edit.component';

describe('TileOrderEditComponent', () => {
  let component: TileOrderEditComponent;
  let fixture: ComponentFixture<TileOrderEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TileOrderEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TileOrderEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
