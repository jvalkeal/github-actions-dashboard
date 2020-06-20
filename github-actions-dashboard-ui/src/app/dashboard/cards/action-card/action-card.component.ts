import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, of, forkJoin } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { Repository, CheckRun, Card, Dispatch } from '../../../api/api.service';
import { State } from '../../dashboard.reducer';
import { removeCard } from '../../dashboard.actions';
import { DispatchesService } from 'src/app/dispatches/dispatches.service';
import { ModalSendDispatchComponent } from 'src/app/dispatches/modal-send-dispatch/modal-send-dispatch.component';

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
  userDispatches = this.dispatchesService.userDispatches();

  @ViewChild(ModalSendDispatchComponent)
  private dispatchComponent: ModalSendDispatchComponent;

  constructor(
    private store: Store<State>,
    private dispatchesService: DispatchesService
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

  getAllDispatches(): Observable<Dispatch[]> {
    return forkJoin([this.userDispatches.pipe(take(1)), of(this.workflow.dispatches)])
      .pipe(map(([d1, d2]) => [...d1, ...d2]));
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

  dispatch(owner: string, name: string, eventType: string, clientPayload: any): void {
    this.dispatchComponent.open(owner, name, eventType, JSON.stringify(clientPayload));
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
