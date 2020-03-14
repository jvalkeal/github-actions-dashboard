import { Component, OnInit, OnDestroy } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { Subscription, timer } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { ApiService, Repository } from '../api.service';
import { State, getRefreshSetting } from '../settings/settings.reducer';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-action-cards',
  templateUrl: './action-cards.component.html',
  styleUrls: ['./action-cards.component.css']
})
export class ActionCardsComponent implements OnInit, OnDestroy {

  cards: Repository[];
  private sub1: Subscription;
  private sub2: Subscription;
  private refreshTime = 60;

  constructor(
    private api: ApiService,
    private store: Store<State>,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.route.params.subscribe(p => this.getCards(p && p.type, p && p.id));
    this.sub2 = this.store.pipe(select(getRefreshSetting))
      .subscribe(v => {
        this.refreshTime = +v;
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

  private getCards(type: string, id: string): void {
    console.log('cards', type, id);
    if (type === 'global') {
      this.setupWorkflowsRefresh(type, id);
    }
  }

  private setupWorkflowsRefresh(type: string, id: string) {
    if (this.sub1) {
      this.sub1.unsubscribe();
    }
    if (this.refreshTime && this.refreshTime > 0) {
      this.sub1 = timer(0, this.refreshTime * 1000)
        .pipe(switchMap(() => {
          if (type === 'global') {
            return this.api.getGlobalWorkflow(id);
          }
        }))
        .subscribe(repos => {
          this.cards = repos;
        });
    }
  }
}
