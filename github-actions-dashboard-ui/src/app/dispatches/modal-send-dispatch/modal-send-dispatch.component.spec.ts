import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalSendDispatchComponent } from './modal-send-dispatch.component';

describe('ModalSendDispatchComponent', () => {
  let component: ModalSendDispatchComponent;
  let fixture: ComponentFixture<ModalSendDispatchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalSendDispatchComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalSendDispatchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
