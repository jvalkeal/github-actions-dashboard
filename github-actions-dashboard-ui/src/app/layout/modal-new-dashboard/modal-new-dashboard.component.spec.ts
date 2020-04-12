import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ModalNewDashboardComponent } from './modal-new-dashboard.component';

describe('ModalNewDashboardComponent', () => {
  let component: ModalNewDashboardComponent;
  let fixture: ComponentFixture<ModalNewDashboardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalNewDashboardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalNewDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
