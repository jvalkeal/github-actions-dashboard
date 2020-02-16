import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription, timer } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { ApiService, Repository } from '../api.service';

@Component({
  selector: 'app-action-cards',
  templateUrl: './action-cards.component.html',
  styleUrls: ['./action-cards.component.css']
})
export class ActionCardsComponent implements OnInit, OnDestroy {

  cards: Repository[];
  private subscription: Subscription;

  constructor(private api: ApiService) {}

  ngOnInit() {
    this.subscription = timer(0, 30000)
      .pipe(switchMap(() => this.api.getWorkflows()))
      .subscribe(repos => {
        this.cards = repos;
      });
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
