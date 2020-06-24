import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { FormControl, Validators, FormGroup } from '@angular/forms';
import { Store, select } from '@ngrx/store';
import { tap, map, debounceTime } from 'rxjs/operators';
import { Observable, Subject, Subscription } from 'rxjs';
import { ClrWizard, ClrSelect } from '@clr/angular';
import { State, getUserDashboards } from '../../dashboard/dashboard.reducer';
import { ApiService, Repository, Branch } from '../../api/api.service';
import { update } from '../../dashboard/dashboard.actions';
import { selectRouteParams } from '../../../app/reducers';

/**
 * Modal dialog to add workflows to an existing dashboard.
 */
@Component({
  selector: 'app-modal-add-workflow',
  templateUrl: './modal-add-workflow.component.html',
  styleUrls: ['./modal-add-workflow.component.css'],
})
export class ModalAddWorkflowComponent implements OnInit, OnDestroy {
  show = false;
  userDashboards$ = this.store.pipe(select(getUserDashboards));
  options: string;
  name: string;
  title: string;
  repositories: Observable<Repository[]>;
  private selectedRepositoryLocal: Repository;
  selectedBranches: Branch[] = [];
  branches: Branch[] = [];
  loading = false;

  get selectedRepository() {
    return this.selectedRepositoryLocal;
  }

  set selectedRepository(selectedRepository: Repository) {
    this.selectedRepositoryLocal = selectedRepository;
    if (selectedRepository) {
      this.title = selectedRepository.name;
    }
  }

  private currentUserCardName = this.store.pipe(select(selectRouteParams)).pipe(
    map((params) => {
      if (params?.type === 'user') {
        return params.id;
      }
      return null;
    })
  );

  private searchSubject: Subject<string> = new Subject();

  @ViewChild(ClrSelect)
  select: ClrSelect;

  @ViewChild(ClrWizard)
  private wizard: ClrWizard;

  private currentUserCardNameSub: Subscription;
  private searchSubjectSub: Subscription;
  private titleControl: FormControl;
  form: FormGroup;

  constructor(
    private api: ApiService,
    private store: Store<State>
  ) {}

  ngOnInit(): void {
    this.titleControl = new FormControl(this.title, Validators.required);
    this.form = new FormGroup({
      title: this.titleControl
    });
    this.currentUserCardNameSub = this.currentUserCardName
      .pipe(
        tap((name) => {
          this.options = name;
        })
      )
      .subscribe();
    this.searchSubjectSub = this.searchSubject
      .pipe(
        debounceTime(500),
        map((search) => {
          this.loading = true;
          return this.api.searchRepositories(search);
        })
      )
      .subscribe((repositories) => {
        this.repositories = repositories;
        this.loading = false;
      });
  }

  ngOnDestroy(): void {
    if (this.currentUserCardNameSub) {
      this.currentUserCardNameSub.unsubscribe();
    }
    if (this.searchSubjectSub) {
      this.searchSubjectSub.unsubscribe();
    }
  }

  onBranches(): void {
    this.branches = this?.selectedRepositoryLocal?.branches || [];
  }

  open(): void {
    this.show = true;
  }

  onKey(value: string) {
    this.searchSubject.next(value);
  }

  doCancel(): void {
    this.reset();
  }

  doFinish(): void {
    this.store.dispatch(
      update({
        dashboard: {
          name: this.options,
          description: '',
          repositories: [{
            owner: this.selectedRepository.owner,
            name: this.selectedRepository.name,
            title: this.title,
            url: this.selectedRepository.url,
            branches: this.selectedBranches,
            pullRequests: [],
            dispatches: [],
            errors: []
          }],
        },
      })
    );
    this.reset();
  }

  private reset(): void {
    this.wizard.reset();
    this.selectedRepository = null;
    this.selectedBranches = [];
  }
}
