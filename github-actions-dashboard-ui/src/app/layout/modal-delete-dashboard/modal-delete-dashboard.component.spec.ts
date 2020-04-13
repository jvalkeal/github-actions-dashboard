import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalDeleteDashboardComponent } from './modal-delete-dashboard.component';

describe('ModalDeleteDashboardComponent', () => {
  let component: ModalDeleteDashboardComponent;
  let fixture: ComponentFixture<ModalDeleteDashboardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalDeleteDashboardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalDeleteDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
