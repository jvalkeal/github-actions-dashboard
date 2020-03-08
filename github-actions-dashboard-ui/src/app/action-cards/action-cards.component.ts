import { Component, OnInit, OnDestroy } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { Subscription, timer } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { ApiService, Repository } from '../api.service';
import { State, getRefreshSetting } from '../settings/settings.reducer';

@Component({
  selector: 'app-action-cards',
  templateUrl: './action-cards.component.html',
  styleUrls: ['./action-cards.component.css']
})
export class ActionCardsComponent implements OnInit, OnDestroy {

  cards: Repository[];
  private sub1: Subscription;
  private sub2: Subscription;

  constructor(
    private api: ApiService,
    private store: Store<State>
  ) {}

  ngOnInit() {
    this.setupWorkflowsRefresh(60);
    this.sub2 = this.store.pipe(select(getRefreshSetting))
      .subscribe(v => {
        this.setupWorkflowsRefresh(+v);
      });
  }

  ngOnDestroy() {
    if (this.sub1) {
      this.sub1.unsubscribe();
    }
    if (this.sub2) {
      this.sub2.unsubscribe();
    }
  }

  private setupWorkflowsRefresh(interval: number) {
    if (this.sub1) {
      this.sub1.unsubscribe();
    }
    if (interval && interval > 0) {
      this.sub1 = timer(0, interval * 1000)
        .pipe(switchMap(() => this.api.getWorkflows()))
        .subscribe(repos => {
          this.cards = repos;
        });
    }
  }
}
