import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DispatchesComponent } from './dispatches.component';

describe('DispatchesComponent', () => {
  let component: DispatchesComponent;
  let fixture: ComponentFixture<DispatchesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DispatchesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DispatchesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
