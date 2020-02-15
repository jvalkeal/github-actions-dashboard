import { Component, OnInit } from '@angular/core';
import { ApiService, Repository } from '../api.service';

@Component({
  selector: 'app-action-cards',
  templateUrl: './action-cards.component.html',
  styleUrls: ['./action-cards.component.css']
})
export class ActionCardsComponent implements OnInit {

  cards: Repository[];

  constructor(private api: ApiService) {}

  ngOnInit() {
    this.api.getWorkflows().subscribe(data => {
      this.cards = data;
      // console.log('cards', this.cards);
      // this.cards.forEach(x => {
      //   console.log('prs', x.pullRequests);
      // });
    });
  }
}
