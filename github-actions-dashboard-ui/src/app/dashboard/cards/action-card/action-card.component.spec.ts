import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { StoreModule } from '@ngrx/store';
import { HttpClientModule } from '@angular/common/http';
import { ClarityModule } from '@clr/angular';
import { ActionCardComponent } from './action-card.component';
import { Repository, Card } from '../../../api/api.service';
import * as fromDashboard from '../../../dashboard/dashboard.reducer';
import * as fromDispatches from '../../../dispatches/dispatches.reducer';
import * as fromAuth from '../../../auth/auth.reducer';

describe('ActionCardComponent', () => {
  let component: ActionCardComponent;
  let fixture: ComponentFixture<ActionCardComponent>;
  let mockStore: MockStore;

  const initialState = {
    [fromAuth.authFeatureKey]: {
      loggedIn: false
    },
    [fromDispatches.dispatchesFeatureKey]: {
      dispatches: []
    },
    [fromDashboard.dashboardsFeatureKey]: {
      global: [],
      user: [],
      cards: []
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
        ActionCardComponent
      ]
    })
    .compileComponents();
    mockStore = TestBed.inject(MockStore);
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ActionCardComponent);
    component = fixture.componentInstance;
    const repository: Repository = {
      owner: 'fakeowner',
      name: 'fakename',
      title: 'faketitle',
      branches: [],
      pullRequests: [],
      errors: [],
      dispatches: [],
      url: 'fakeurl'
    };
    const card: Card = {
      name: 'fakename',
      type: 'user',
      repository
    };
    component.workflow = repository;
    component.card = card;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
