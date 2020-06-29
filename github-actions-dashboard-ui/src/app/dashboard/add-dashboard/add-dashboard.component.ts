import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {
  FormGroup, FormControl, Validators, FormBuilder, AsyncValidatorFn, AbstractControl, ValidationErrors
} from '@angular/forms';
import { Observable, of } from 'rxjs';
import { take, map } from 'rxjs/operators';
import { Store, select } from '@ngrx/store';
import { State } from '../../reducers';
import { save, saveTeam } from '../dashboard.actions';
import { Dashboard, Team } from '../../api/api.service';
import { getUserDashboards } from '../dashboard.reducer';
import { DashboardService } from '../dashboard.service';

@Component({
  selector: 'app-add-dashboard',
  templateUrl: './add-dashboard.component.html',
  styleUrls: ['./add-dashboard.component.css']
})
export class AddDashboardComponent implements OnInit {

  form: FormGroup;
  name = '';
  loading = false;
  selectedTeam: Team;
  teams = this.dashboardService.teams();
  userDashboards$ = this.store.pipe(select(getUserDashboards));

  private nameControl: FormControl;

  constructor(
    private formBuilder: FormBuilder,
    private dashboardService: DashboardService,
    private store: Store<State>,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.nameControl = new FormControl(this.name, Validators.required, existingNameValidator(this.userDashboards$));
    this.form = this.formBuilder.group({
      team: this.formBuilder.group({
      }),
      name: this.formBuilder.group({
        name: this.nameControl
      }),
      summary: this.formBuilder.group({
      })
    });
  }

  submit(): void {
    if (this.selectedTeam) {
      this.store.dispatch(saveTeam({
        team: this.selectedTeam.combinedSlug,
        dashboard: { name: this.name, team: this.selectedTeam.combinedSlug, description: '', repositories: []}
      }));
      this.router.navigate(['/cards/team/' + this.name]);
    } else {
      this.store.dispatch(save({
        dashboard: { name: this.name, description: '', repositories: []}
      }));
      this.router.navigate(['/cards/user/' + this.name]);
    }
  }
}

function existingNameValidator(dashboards: Observable<Dashboard[]>): AsyncValidatorFn {
  return (control: AbstractControl): Promise<ValidationErrors | null> | Observable<ValidationErrors | null> => {
    if (control.value === null || control.value === 0) {
      // this validator only checks if value exists
      return of(null);
    } else {
      // check if given name is already in a state
      return dashboards.pipe(
        take(1),
        map(d => d.some(item => item.name === control.value) ? { duplicateName: control.value } : null)
      );
    }
  };
}
