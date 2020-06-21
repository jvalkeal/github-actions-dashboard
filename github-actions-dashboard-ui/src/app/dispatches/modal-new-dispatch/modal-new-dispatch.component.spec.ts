import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http';
import { StoreModule } from '@ngrx/store';
import { ClarityModule } from '@clr/angular';
import { ModalNewDispatchComponent } from './modal-new-dispatch.component';

describe('ModalNewDispatchComponent', () => {
  let component: ModalNewDispatchComponent;
  let fixture: ComponentFixture<ModalNewDispatchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        ClarityModule,
        HttpClientModule,
        StoreModule.forRoot({})
      ],
      declarations: [
        ModalNewDispatchComponent
      ]
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
