import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserHeaderActionComponent } from './user-header-action.component';

describe('UserHeaderActionComponent', () => {
  let component: UserHeaderActionComponent;
  let fixture: ComponentFixture<UserHeaderActionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserHeaderActionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserHeaderActionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
