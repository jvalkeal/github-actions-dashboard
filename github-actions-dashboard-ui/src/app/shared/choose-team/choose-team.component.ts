import { Component, OnInit } from '@angular/core';
import { ClrDatagridStringFilterInterface } from '@clr/angular';
import { Team } from '../../api/api.service';
import { DashboardService } from 'src/app/dashboard/dashboard.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-choose-team',
  templateUrl: './choose-team.component.html',
  styleUrls: ['./choose-team.component.css']
})
export class ChooseTeamComponent implements OnInit {

  teamNameFilter = new TeamNameFilter();
  teamSlugFilter = new TeamSlugFilter();
  teams: Observable<Team[]>;
  loading = false;
  private selectedTeamLocal: Team;

  set selectedTeam(team: Team) {
    // when filtered and move to next block, we some reason get null team, so hack it
    if (team !== null) {
      this.selectedTeamLocal = team;
    }
  }

  get selectedTeam(): Team {
    return this.selectedTeamLocal;
  }

  constructor(
    private dashboardService: DashboardService
  ) { }

  ngOnInit(): void {
  }

  loadTeams() {
    this.teams = this.dashboardService.teams();
  }
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
