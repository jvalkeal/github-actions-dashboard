import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { StoreModule } from '@ngrx/store';
import { ClarityModule } from '@clr/angular';
import { LeftNaviComponent } from './left-navi.component';
import * as fromDashboard from '../../dashboard/dashboard.reducer';
import * as fromAuth from '../../auth/auth.reducer';

describe('LeftNaviComponent', () => {
  let component: LeftNaviComponent;
  let fixture: ComponentFixture<LeftNaviComponent>;
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
      imports: [
        ClarityModule,
        BrowserAnimationsModule,
        StoreModule.forRoot({})
      ],
      providers: [
        provideMockStore({ initialState })
      ],
      declarations: [
        LeftNaviComponent
      ]
    })
    .compileComponents();
    mockStore = TestBed.inject(MockStore);
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LeftNaviComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
