import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalEditDispatchComponent } from './modal-edit-dispatch.component';

describe('ModalEditDispatchComponent', () => {
  let component: ModalEditDispatchComponent;
  let fixture: ComponentFixture<ModalEditDispatchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalEditDispatchComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalEditDispatchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
