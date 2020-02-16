import { Component, OnInit, Input } from '@angular/core';
import { Repository, CheckRun } from '../api.service';

@Component({
  selector: 'app-action-card',
  templateUrl: './action-card.component.html',
  styleUrls: ['./action-card.component.css']
})
export class ActionCardComponent implements OnInit {

  @Input()
  workflow: Repository;

  @Input()
  name: string;

  constructor() { }

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
}
