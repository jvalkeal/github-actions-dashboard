import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { tap, map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { ClrWizard, ClrSelect } from '@clr/angular';
import { State, getUserDashboards } from '../../dashboard/dashboard.reducer';
import { ApiService, Repository } from '../../api.service';
import { update } from '../../dashboard/dashboard.actions';
import { selectRouteParams } from '../../../app/reducers';

/**
 * Modal dialog to add workflows to an existing dashboard.
 */
@Component({
  selector: 'app-modal-add-workflow',
  templateUrl: './modal-add-workflow.component.html',
  styleUrls: ['./modal-add-workflow.component.css']
})
export class ModalAddWorkflowComponent implements OnInit, AfterViewInit {

  show = false;
  userDashboards$ = this.store.pipe(select(getUserDashboards));
  options: string;
  name: string;
  repositories: Observable<Repository[]>;
  selected: Repository[] = [];

  private currentUserCardName = this.store.pipe(
    select(selectRouteParams)
  ).pipe(
    map(params => {
      if (params?.type === 'user') {
        return params.id;
      }
      return null;
    })
  );

  @ViewChild(ClrSelect)
  select: ClrSelect;

  @ViewChild(ClrWizard)
  private wizard: ClrWizard;

  constructor(
    private api: ApiService,
    private store: Store<State>
  ) { }

  ngOnInit(): void {
    this.currentUserCardName.pipe(
      tap(name => {
        this.options = name;
      })
    ).subscribe();
  }

  ngAfterViewInit(): void {
  }

  open(): void {
    this.show = true;
  }

  onKey(value: string) {
    this.repositories = this.api.searchRepositories(value);
  }

  doFinish(): void {
    this.store.dispatch(update({ dashboard: { name: this.options, description: '', repositories: this.selected} }));
  }
}
