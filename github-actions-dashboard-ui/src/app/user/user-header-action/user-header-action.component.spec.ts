import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { HttpClientModule } from '@angular/common/http';
import { StoreModule } from '@ngrx/store';
import { ClarityModule } from '@clr/angular';
import { AppRoutingModule } from '../../app-routing.module';
import { UserHeaderActionComponent } from './user-header-action.component';
import * as fromAuth from '../../auth/auth.reducer';

describe('UserHeaderActionComponent', () => {
  let component: UserHeaderActionComponent;
  let fixture: ComponentFixture<UserHeaderActionComponent>;
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
        AppRoutingModule,
        HttpClientModule,
        StoreModule.forRoot({})
      ],
      providers: [
        provideMockStore({ initialState })
      ],
      declarations: [
        UserHeaderActionComponent
      ]
    })
    .compileComponents();
    mockStore = TestBed.inject(MockStore);
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
