import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {
  FormGroup, FormControl, Validators, FormBuilder, AsyncValidatorFn, AbstractControl, ValidationErrors
} from '@angular/forms';
import { Observable, of } from 'rxjs';
import { take, map } from 'rxjs/operators';
import { Store, select } from '@ngrx/store';
import { ClrDatagridStringFilterInterface } from '@clr/angular';
import { State } from '../../reducers';
import { save, saveTeam } from '../dashboard.actions';
import { Dashboard, Team } from '../../api/api.service';
import { getUserDashboards, getTeamDashboards } from '../dashboard.reducer';
import { DashboardService } from '../dashboard.service';

@Component({
  selector: 'app-add-dashboard',
  templateUrl: './add-dashboard.component.html',
  styleUrls: ['./add-dashboard.component.css']
})
export class AddDashboardComponent implements OnInit {

  form: FormGroup;
  loading = false;
  selectedTeamx: Team;
  teams = this.dashboardService.teams();
  userDashboards$ = this.store.pipe(select(getUserDashboards));
  teamDashboards$ = this.store.pipe(select(getTeamDashboards));
  teamNameFilter = new TeamNameFilter();
  teamSlugFilter = new TeamSlugFilter();

  set selectedTeam(team: Team) {
    // when filtered and move to next block, we some reason get null team, so hack it
    if (team !== null) {
      this.selectedTeamx = team;
    }
  }

  get selectedTeam(): Team {
    return this.selectedTeamx;
  }

  get name(): string {
    return this.nameControl.value;
  }

  private nameControl: FormControl;

  constructor(
    private formBuilder: FormBuilder,
    private dashboardService: DashboardService,
    private store: Store<State>,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.nameControl = new FormControl(
      '',
      Validators.required,
      existingNameValidator(this.userDashboards$, this.teamDashboards$, () => this.selectedTeam));
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
        dashboard: { name: this.nameControl.value, team: this.selectedTeam.combinedSlug, description: '', repositories: []}
      }));
      this.router.navigate(['/cards/team/' + this.nameControl.value], { queryParams: {team: this.selectedTeam.combinedSlug}});
    } else {
      this.store.dispatch(save({
        dashboard: { name: this.nameControl.value, description: '', repositories: []}
      }));
      this.router.navigate(['/cards/user/' + this.nameControl.value]);
    }
  }
}

function existingNameValidator(
  userDashboards: Observable<Dashboard[]>,
  teamDashboards: Observable<Dashboard[]>,
  selectedTeam: () => Team
): AsyncValidatorFn {
  return (control: AbstractControl): Promise<ValidationErrors | null> | Observable<ValidationErrors | null> => {
    if (control.value === null || control.value === 0) {
      // this validator only checks if value exists
      return of(null);
    } else {
      const team = selectedTeam();
      if (team?.combinedSlug) {
        return teamDashboards.pipe(
          take(1),
          map(d => {
            return d.some(item => (item.name === control.value) && (item.team === team.combinedSlug))
              ? { duplicateTeamDashboardName: control.value }
              : null;
          })
        );
      } else {
        return userDashboards.pipe(
          take(1),
          map(d => d.some(item => item.name === control.value) ? { duplicateUserDashboardName: control.value } : null)
        );
      }
    }
  };
}

class TeamNameFilter implements ClrDatagridStringFilterInterface<Team> {
  accepts(team: Team, search: string): boolean {
    return team.name.toLowerCase().indexOf(search) >= 0;
  }
}

class TeamSlugFilter implements ClrDatagridStringFilterInterface<Team> {
  accepts(team: Team, search: string): boolean {
    return team.combinedSlug.toLowerCase().indexOf(search) >= 0;
  }
}
