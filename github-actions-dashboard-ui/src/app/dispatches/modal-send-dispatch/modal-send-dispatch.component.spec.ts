import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { HttpClientModule } from '@angular/common/http';
import { StoreModule } from '@ngrx/store';
import { ClarityModule } from '@clr/angular';
import { ModalSendDispatchComponent } from './modal-send-dispatch.component';
import * as fromAuth from '../../auth/auth.reducer';

describe('ModalSendDispatchComponent', () => {
  let component: ModalSendDispatchComponent;
  let fixture: ComponentFixture<ModalSendDispatchComponent>;
  let mockStore: MockStore;

  const initialState = {
    [fromAuth.authFeatureKey]: {
      loggedIn: false
    }
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        ClarityModule,
        HttpClientModule,
        StoreModule.forRoot({})
      ],
      providers: [
        provideMockStore({ initialState })
      ],
      declarations: [
        ModalSendDispatchComponent
      ]
    })
    .compileComponents();
    mockStore = TestBed.inject(MockStore);
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
