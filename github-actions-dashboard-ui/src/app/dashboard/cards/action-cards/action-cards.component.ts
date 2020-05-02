import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Store, select } from '@ngrx/store';
import { Effect, Actions, ofType } from '@ngrx/effects';
import { Subscription, timer, combineLatest } from 'rxjs';
import { switchMap, map } from 'rxjs/operators';
import { ApiService, Repository, Card, CheckRun, PullRequest } from '../../../api.service';
import { State, getRefreshSetting } from '../../../settings/settings.reducer';
import { getCards } from '../../dashboard.reducer';
import { setCards } from '../../dashboard.actions';
import { PrStates } from '../action-card/action-card.component';
import * as DashboardActions from '../../dashboard.actions';

@Component({
  selector: 'app-action-cards',
  templateUrl: './action-cards.component.html',
  styleUrls: ['./action-cards.component.css']
})
export class ActionCardsComponent implements OnInit, OnDestroy {

  cards = this.store.pipe(select(getCards));
  cardsActive = true;
  loading = false;
  private timerSub: Subscription;
  private refreshSub: Subscription;
  private refreshSetting = this.store.pipe(select(getRefreshSetting));
  private refresh = 0;
  private params: Params;

  @Effect({ dispatch: false })
  refreshCard$ = this.actions$.pipe(
    ofType(DashboardActions.refreshCard),
  ).subscribe(action => {
    this.setupWorkflowsRefresh(this.refresh, this.params);
  });

  constructor(
    private api: ApiService,
    private store: Store<State>,
    private route: ActivatedRoute,
    private actions$: Actions,
  ) {}

  ngOnInit() {
    this.refreshSub = combineLatest([
      this.route.params,
      this.refreshSetting,
    ]).subscribe(([params, time]) => {
      this.refresh = +time;
      this.params = params;
      this.refreshCards();
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

  toggleCardsView(): void {
    this.cardsActive = !this.cardsActive;
  }

  refreshCards(): void {
    this.store.dispatch(DashboardActions.refreshCard({}));
  }

  public checkRunStyle(checkRun: CheckRun): string {
    if (checkRun.status === 'IN_PROGRESS') {
      return '';
    } else if (checkRun.conclusion === 'SUCCESS') {
      return 'success';
    } else {
      return 'danger';
    }
  }

  public hasActivePrCheckRuns(pullRequests: PullRequest[]): boolean {
    let active = false;
    if (pullRequests) {
      pullRequests.forEach(pr => {
        if (!active && pr.checkRuns && pr.checkRuns.length > 0) {
          active = true;
        }
      });
    }
    return active;
  }

  public calculatePrStates(workflow: Repository): PrStates {
    let successCount = 0;
    let failedCount = 0;
    let runningCount = 0;

    workflow.pullRequests.forEach(pr => {
      pr.checkRuns.forEach(cr => {
        if (cr.status === 'IN_PROGRESS') {
          runningCount++;
        } else if (cr.conclusion === 'SUCCESS') {
          successCount++;
        } else {
          failedCount++;
        }
      });
    });

    const totalCount = successCount + failedCount + runningCount;
    const successPersentage = (successCount / totalCount) * 100;
    const failedPersentage = (failedCount / totalCount) * 100;
    const runningPersentage = (runningCount / totalCount) * 100;

    return {
      successCount,
      failedCount,
      runningCount,
      totalCount,
      successPersentage,
      failedPersentage,
      runningPersentage
    };
  }

  public calculateBranchStates(workflow: Repository): PrStates {
    let successCount = 0;
    let failedCount = 0;
    let runningCount = 0;

    workflow.branches.forEach(b => {
      b.checkRuns.forEach(cr => {
        if (cr.status === 'IN_PROGRESS') {
          runningCount++;
        } else if (cr.conclusion === 'SUCCESS') {
          successCount++;
        } else {
          failedCount++;
        }
      });
    });

    const totalCount = successCount + failedCount + runningCount;
    const successPersentage = (successCount / totalCount) * 100;
    const failedPersentage = (failedCount / totalCount) * 100;
    const runningPersentage = (runningCount / totalCount) * 100;

    return {
      successCount,
      failedCount,
      runningCount,
      totalCount,
      successPersentage,
      failedPersentage,
      runningPersentage
    };
  }

  private setupWorkflowsRefresh(refresh: number, params: Params) {
    if (!(params && params.id && params.type)) {
      return;
    }
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
    this.loading = true;
    this.timerSub = timer(0, refresh)
      .pipe(
        switchMap(() => {
          if (params.type === 'global') {
            return this.api.getGlobalWorkflow(params.id);
          } else if (params.type === 'user') {
            return this.api.getUserWorkflow(params.id);
          }
        }),
        map<Repository[], Card[]>(repositories => {
          const cards: Card[] = [];
          repositories.forEach(repository => cards.push({ name: params.id, type: params.type, repository }));
          return cards;
        })
      )
      .subscribe(cards => {
        this.store.dispatch(setCards(
          {
            dashboard: {
              name: params.id,
              description: '',
              repositories: []
            },
            cards
          }));
        this.loading = false;
      });
  }
}
