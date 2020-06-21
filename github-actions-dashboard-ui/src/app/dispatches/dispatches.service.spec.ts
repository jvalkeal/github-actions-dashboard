import { TestBed } from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http';
import { StoreModule } from '@ngrx/store';
import { DispatchesService } from './dispatches.service';

describe('DispatchesService', () => {
  let service: DispatchesService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientModule,
        StoreModule.forRoot({})
      ]
    });
    service = TestBed.inject(DispatchesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
