import { TestBed } from '@angular/core/testing';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { cold } from 'jasmine-marbles';
import { take } from 'rxjs/operators';
import { AlertsService, Alert } from './alerts.service';
import * as fromAlerts from './alerts.reducer';

describe('AlertsService', () => {
  let service: AlertsService;
  let store: MockStore;
  const alert1: Alert = {
    id: 'id1'
  };
  const initialState = { [fromAlerts.alertsFeatureKey]: { alerts: [] } };
  const alert1State = { [fromAlerts.alertsFeatureKey]: { alerts: [alert1] } };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideMockStore({ initialState })
      ]
    });
    service = TestBed.inject(AlertsService);
    store = TestBed.inject(MockStore);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return no alerts', () => {
    const expected = cold('(a|)', {a: []});
    expect(service.alerts().pipe(take(1))).toBeObservable(expected);
  });

  it('should return one alert', () => {
    store.setState(alert1State);
    const alerts: Alert[] = [alert1];
    const expected = cold('(a|)', {a: alerts});
    expect(service.alerts().pipe(take(1))).toBeObservable(expected);
  });
});
