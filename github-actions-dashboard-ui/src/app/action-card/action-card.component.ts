import { Component, OnInit, Input } from '@angular/core';
import { Store } from '@ngrx/store';
import { Repository, CheckRun, Card } from '../api.service';
import { State } from '../dashboard/dashboard.reducer';
import { removeCard } from '../dashboard/dashboard.actions';

@Component({
  selector: 'app-action-card',
  templateUrl: './action-card.component.html',
  styleUrls: ['./action-card.component.css']
})
export class ActionCardComponent implements OnInit {

  @Input()
  workflow: Repository;

  @Input()
  type: string;

  @Input()
  name: string;

  @Input()
  card: Card;


  constructor(
    private store: Store<State>
  ) { }

  ngOnInit() {
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

  public hasActivePrCheckRuns(): boolean {
    let active = false;
    if (this.workflow && this.workflow.pullRequests) {
      this.workflow.pullRequests.forEach(pr => {
        if (!active && pr.checkRuns && pr.checkRuns.length > 0) {
          active = true;
        }
      });
    }
    return active;
  }

  remove(): void {
    console.log('Remove card', this.type, this.name, this.card);
    this.store.dispatch(
      removeCard({
        dashboard:
          { name: this.name,
            description: '',
            repositories: []}, card: this.card }));
  }
}
