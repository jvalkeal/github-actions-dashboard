import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { Store, select } from '@ngrx/store';
import { Subject, Observable, Subscription } from 'rxjs';
import { debounceTime, map, tap } from 'rxjs/operators';
import { Repository, ApiService, Branch } from '../../api/api.service';
import { State } from '../dashboard.reducer';
import { update } from '../dashboard.actions';
import { selectRouteParams } from 'src/app/reducers';

@Component({
  selector: 'app-add-workflow',
  templateUrl: './add-workflow.component.html',
  styleUrls: ['./add-workflow.component.css']
})
export class AddWorkflowComponent implements OnInit, OnDestroy {

  form: FormGroup;
  name: string;
  dashboardName: string;
  title: string;
  repositories: Observable<Repository[]>;
  loading = false;
  selectedBranches: Branch[] = [];
  branches: Branch[] = [];
  private repositoryControl: FormControl;
  private titleControl: FormControl;
  private searchSubject: Subject<string> = new Subject();
  private selectedRepositoryLocal: Repository;
  private searchSubjectSub: Subscription;
  private currentUserCardNameSub: Subscription;

  private currentUserCardName = this.store.pipe(select(selectRouteParams)).pipe(
    map((params) => {
      if (params?.type === 'user') {
        return params.id;
      }
      return null;
    })
  );

  get selectedRepository() {
    return this.selectedRepositoryLocal;
  }

  set selectedRepository(selectedRepository: Repository) {
    this.selectedRepositoryLocal = selectedRepository;
    if (selectedRepository) {
      this.title = selectedRepository.name;
    }
    this.repositoryControl.setValue(selectedRepository);
  }

  constructor(
    private formBuilder: FormBuilder,
    private api: ApiService,
    private store: Store<State>,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.repositoryControl = new FormControl(this.selectedRepositoryLocal, Validators.required);
    this.titleControl = new FormControl(this.title, Validators.required);
    this.form = this.formBuilder.group({
      repository: this.formBuilder.group({
        query: '',
        selectedRepository: this.repositoryControl
      }),
      branch: this.formBuilder.group({
      }),
      card: this.formBuilder.group({
        title: this.titleControl
      }),
      summary: this.formBuilder.group({
      }),
    });
    this.currentUserCardNameSub = this.currentUserCardName
      .pipe(
        tap((name) => {
          this.dashboardName = name;
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

  onKey(value: string) {
    this.searchSubject.next(value);
  }

  onBranches(): void {
    this.branches = this?.selectedRepositoryLocal?.branches || [];
  }

  submit(): void {
    this.store.dispatch(
      update({
        dashboard: {
          name: this.dashboardName,
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
    this.router.navigate(['..'], {relativeTo: this.route, skipLocationChange: true});
  }
}
