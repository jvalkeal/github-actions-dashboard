import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { StoreModule } from '@ngrx/store';
import { ClarityModule } from '@clr/angular';
import { ModalDeleteDashboardComponent } from './modal-delete-dashboard.component';
import * as fromDashboard from '../../dashboard/dashboard.reducer';
import * as fromAuth from '../../auth/auth.reducer';

describe('ModalDeleteDashboardComponent', () => {
  let component: ModalDeleteDashboardComponent;
  let fixture: ComponentFixture<ModalDeleteDashboardComponent>;
  let mockStore: MockStore;

  const initialState = {
    [fromAuth.authFeatureKey]: {
      loggedIn: false
    },
    [fromDashboard.dashboardsFeatureKey]: {
      global: [],
      user: [],
      cards: []
    }
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports:[
        ClarityModule,
        StoreModule.forRoot({})
      ],
      providers: [
        provideMockStore({ initialState })
      ],
      declarations: [ ModalDeleteDashboardComponent ]
    })
    .compileComponents();
    mockStore = TestBed.inject(MockStore);
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
