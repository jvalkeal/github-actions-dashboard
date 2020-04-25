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

  private localWorkflow: Repository;

  @Input()
  type: string;

  @Input()
  name: string;

  @Input()
  card: Card;

  prState: PrStates;
  branchState: PrStates;
  activePrCheckRuns = false;

  constructor(
    private store: Store<State>
  ) { }

  ngOnInit() {
  }

  @Input()
  set workflow(workflow: Repository) {
    this.localWorkflow = workflow;
    this.prState = this.calculatePrStates(workflow);
    this.branchState = this.calculateBranchStates(workflow);
    this.activePrCheckRuns = this.hasActivePrCheckRuns();
  }

  get workflow(): Repository {
    return this.localWorkflow;
  }

  get title() {
    return this.card.repository.title || this.card.repository.name;
  }

  private calculatePrStates(workflow: Repository): PrStates {
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

  private calculateBranchStates(workflow: Repository): PrStates {
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

export interface PrStates {
  successCount: number;
  failedCount: number;
  runningCount: number;
  totalCount: number;
  successPersentage: number;
  failedPersentage: number;
  runningPersentage: number;
}
