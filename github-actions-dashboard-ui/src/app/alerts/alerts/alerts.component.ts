import { Component, OnInit } from '@angular/core';
import { AlertsService, Alert } from '../alerts.service';

@Component({
  selector: 'app-alerts',
  templateUrl: './alerts.component.html',
  styleUrls: ['./alerts.component.css']
})
export class AlertsComponent implements OnInit {

  alerts = this.alertService.alerts();

  constructor(
    private alertService: AlertsService
  ) { }

  ngOnInit(): void {
  }

  onClose(alert: Alert) {
    this.alertService.remove(alert);
  }

  fixCommand(alert: Alert): void {
    this.alertService.fixCommand(alert);
  }
}
