import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TileFormComponent } from './tile-form.component';

describe('TileFormComponent', () => {
  let component: TileFormComponent;
  let fixture: ComponentFixture<TileFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TileFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TileFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
