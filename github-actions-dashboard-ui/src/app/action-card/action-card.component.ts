import { Component, OnInit, Input } from '@angular/core';
import { WorkflowRun } from '../api.service';

@Component({
  selector: 'app-action-card',
  templateUrl: './action-card.component.html',
  styleUrls: ['./action-card.component.css']
})
export class ActionCardComponent implements OnInit {

  @Input()
  workflow: WorkflowRun;

  @Input()
  name: string;

  constructor() { }

  ngOnInit() {
  }

}
