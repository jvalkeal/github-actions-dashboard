import { Component, OnInit, ViewChild } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { State, getGlobalDashboards, getUserDashboards } from '../../dashboard/dashboard.reducer';
import { ModalNewDashboardComponent } from '../modal-new-dashboard/modal-new-dashboard.component';
import { ModalAddWorkflowComponent } from '../modal-add-workflow/modal-add-workflow.component';
import { ModalDeleteDashboardComponent } from '../modal-delete-dashboard/modal-delete-dashboard.component';

@Component({
  selector: 'app-left-navi',
  templateUrl: './left-navi.component.html',
  styleUrls: ['./left-navi.component.css']
})
export class LeftNaviComponent implements OnInit {

  globalDashboards = this.store.pipe(select(getGlobalDashboards));
  userDashboards = this.store.pipe(select(getUserDashboards));
  collapsible = true;

  @ViewChild(ModalNewDashboardComponent)
  private modal: ModalNewDashboardComponent;

  @ViewChild(ModalAddWorkflowComponent)
  private modalAddWorkflow: ModalAddWorkflowComponent;

  @ViewChild(ModalDeleteDashboardComponent)
  private modalDeleteDashboard: ModalDeleteDashboardComponent;

  constructor(
    private store: Store<State>
  ) {}

  ngOnInit(): void {
  }

  showNewDashboard(): void {
    this.modal.open();
  }

  showAddWorkflow(): void {
    this.modalAddWorkflow.open();
  }

  showDeleteDashboard(): void {
    this.modalDeleteDashboard.open();
  }
}
