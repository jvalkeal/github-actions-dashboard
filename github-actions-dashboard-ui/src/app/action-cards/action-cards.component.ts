import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Store, select } from '@ngrx/store';
import { Subscription, timer, combineLatest } from 'rxjs';
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
  private timerSub: Subscription;
  private refreshSub: Subscription;
  private refreshSetting = this.store.pipe(select(getRefreshSetting));

  constructor(
    private api: ApiService,
    private store: Store<State>,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.refreshSub = combineLatest([this.route.params, this.refreshSetting]).subscribe(([param, time]) => {
      if (param && param.type && param.id) {
        const refresh = +time;
        this.setupWorkflowsRefresh(refresh, param.type, param.id);
      }
    });
  }

  ngOnDestroy() {
    if (this.timerSub) {
      this.timerSub.unsubscribe();
    }
    if (this.refreshSub) {
      this.refreshSub.unsubscribe();
    }
  }

  private setupWorkflowsRefresh(refresh: number, type: string, id: string) {
    if (this.timerSub) {
      this.timerSub.unsubscribe();
      this.timerSub = null;
    }
    if (!isNaN(refresh)) {
      if (refresh < 1) {
        refresh = undefined;
      } else {
        refresh = refresh *= 1000;
      }
    }
    this.timerSub = timer(0, refresh)
      .pipe(switchMap(() => {
        if (type === 'global') {
          return this.api.getGlobalWorkflow(id);
        } else if (type === 'user') {
          return this.api.getUserWorkflow(id);
        }
      }))
      .subscribe(repos => {
        this.cards = repos;
      });
  }
}
