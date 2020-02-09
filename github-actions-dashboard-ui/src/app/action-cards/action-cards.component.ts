import { Component, OnInit } from '@angular/core';
import { ApiService, WorkflowRun, WorkflowRuns } from '../api.service';

@Component({
  selector: 'app-action-cards',
  templateUrl: './action-cards.component.html',
  styleUrls: ['./action-cards.component.css']
})
export class ActionCardsComponent implements OnInit {

  cards: WorkflowRuns;

  constructor(private api: ApiService) {}

  ngOnInit() {
    this.api.getWorkflows().subscribe(data => {
      this.cards = data;
    });
  }
}
