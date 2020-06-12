import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalNewDispatchComponent } from './modal-new-dispatch.component';

describe('ModalNewDispatchComponent', () => {
  let component: ModalNewDispatchComponent;
  let fixture: ComponentFixture<ModalNewDispatchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalNewDispatchComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalNewDispatchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
