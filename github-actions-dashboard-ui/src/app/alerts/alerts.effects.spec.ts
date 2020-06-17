import { async, TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Action } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import * as AlertsActions from './alerts.actions';
import { Alert } from './alerts.service';
import { AlertsEffects } from './alerts.effects';

describe('Alerts Effects', () => {

  let effects: AlertsEffects;
  let actions$: Observable<Action>;
  const alert1: Alert = {
    id: 'id1'
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      providers: [
        AlertsEffects,
        provideMockActions(() => actions$)
      ]
    })
    .compileComponents();
    effects = TestBed.inject(AlertsEffects);
  }));

  it('should call new browser window', () => {
    actions$ = of(AlertsActions.command({ alert: alert1, command: 'fake', args: ['foo'] }));
    spyOn(window, 'open');
    effects.commands$.subscribe();
    expect(window.open).toHaveBeenCalledWith('foo', '_blank');
  });
});
