import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api.service';

@Component({
  selector: 'app-action-cards',
  templateUrl: './action-cards.component.html',
  styleUrls: ['./action-cards.component.css']
})
export class ActionCardsComponent implements OnInit {

  cards: string[] = [];
  constructor(private api: ApiService) { }

  ngOnInit() {
    this.api.getRepositories().subscribe(data => {
      console.log('data', data);
      this.cards = data;
    });
  }

}
