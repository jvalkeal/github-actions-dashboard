import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { StoreModule } from '@ngrx/store';
import { StoreRouterConnectingModule } from '@ngrx/router-store';
import { ClarityModule } from '@clr/angular';
import { ModalAddWorkflowComponent } from './modal-add-workflow.component';
import * as fromDashboard from '../../dashboard/dashboard.reducer';
import * as fromAuth from '../../auth/auth.reducer';
import { AppRoutingModule } from '../../app-routing.module';

describe('ModalAddWorkflowComponent', () => {
  let component: ModalAddWorkflowComponent;
  let fixture: ComponentFixture<ModalAddWorkflowComponent>;
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
        FormsModule,
        ReactiveFormsModule,
        HttpClientModule,
        AppRoutingModule,
        ClarityModule,
        StoreModule.forRoot({}),
        StoreRouterConnectingModule.forRoot()
      ],
      providers: [
        provideMockStore({ initialState })
      ],
      declarations: [
        ModalAddWorkflowComponent
      ]
    })
    .compileComponents();
    mockStore = TestBed.inject(MockStore);
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
