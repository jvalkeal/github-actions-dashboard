import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { HttpClientModule } from '@angular/common/http';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { ClarityModule } from '@clr/angular';
import { ActionCardsComponent } from './action-cards.component';
import { AppRoutingModule } from '../../../app-routing.module';
import * as fromSettings from '../../../settings/settings.reducer';
import * as fromDashboard from '../../../dashboard/dashboard.reducer';

describe('ActionCardsComponent', () => {
  let component: ActionCardsComponent;
  let fixture: ComponentFixture<ActionCardsComponent>;
  let mockStore: MockStore;

  const initialState = {
    [fromSettings.settingsFeatureKey]: {
      settings: [
        { name: fromSettings.refreshKey, value: fromSettings.refreshDefault },
        { name: fromSettings.themeActiveKey, value: fromSettings.themeActiveDefault }
      ]
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
        StoreModule.forRoot({}),
        EffectsModule.forRoot([]),
        AppRoutingModule
      ],
      providers: [
        provideMockStore({ initialState })
      ],
      declarations: [
        ActionCardsComponent
      ]
    })
    .compileComponents();
    mockStore = TestBed.inject(MockStore);
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ActionCardsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
