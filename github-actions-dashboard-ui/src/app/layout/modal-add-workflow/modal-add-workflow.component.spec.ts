import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ModalAddWorkflowComponent } from './modal-add-workflow.component';

describe('ModalAddWorkflowComponent', () => {
  let component: ModalAddWorkflowComponent;
  let fixture: ComponentFixture<ModalAddWorkflowComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalAddWorkflowComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalAddWorkflowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
