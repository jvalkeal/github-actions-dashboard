import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddWorkflowComponent } from './add-workflow.component';

describe('AddWorkflowComponent', () => {
  let component: AddWorkflowComponent;
  let fixture: ComponentFixture<AddWorkflowComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddWorkflowComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddWorkflowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
