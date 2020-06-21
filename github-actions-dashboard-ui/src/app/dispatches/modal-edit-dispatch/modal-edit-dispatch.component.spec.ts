import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { StoreModule } from '@ngrx/store';
import { ClarityModule } from '@clr/angular';
import { ModalEditDispatchComponent } from './modal-edit-dispatch.component';

describe('ModalEditDispatchComponent', () => {
  let component: ModalEditDispatchComponent;
  let fixture: ComponentFixture<ModalEditDispatchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        ClarityModule,
        StoreModule.forRoot({})
      ],
      declarations: [
        ModalEditDispatchComponent
      ]
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
