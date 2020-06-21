import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { ClarityModule } from '@clr/angular';
import { DispatchesComponent } from './dispatches.component';

describe('DispatchesComponent', () => {
  let component: DispatchesComponent;
  let fixture: ComponentFixture<DispatchesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        ClarityModule,
        HttpClientModule,
        StoreModule.forRoot({}),
        EffectsModule.forRoot([])
      ],
      declarations: [
        DispatchesComponent
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DispatchesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
