import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LeftNaviComponent } from './left-navi.component';

describe('LeftNaviComponent', () => {
  let component: LeftNaviComponent;
  let fixture: ComponentFixture<LeftNaviComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LeftNaviComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LeftNaviComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
