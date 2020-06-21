import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http';
import { StoreModule } from '@ngrx/store';
import { ClarityModule } from '@clr/angular';
import { AppRoutingModule } from '../../app-routing.module';
import { UserHeaderActionComponent } from './user-header-action.component';

describe('UserHeaderActionComponent', () => {
  let component: UserHeaderActionComponent;
  let fixture: ComponentFixture<UserHeaderActionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        ClarityModule,
        AppRoutingModule,
        HttpClientModule,
        StoreModule.forRoot({})
      ],
      declarations: [
        UserHeaderActionComponent
      ]
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
