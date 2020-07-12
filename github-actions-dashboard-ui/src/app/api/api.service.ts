import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Store } from '@ngrx/store';
import { Observable, of, EMPTY } from 'rxjs';
import { map, catchError, tap } from 'rxjs/operators';
import { State } from '../reducers';
import { unauthorised } from '../auth/auth.actions';
import { AlertsService } from '../alerts/alerts.service';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(
    private http: HttpClient,
    private store: Store<State>,
    private alertsService: AlertsService
  ) {}

  getGlobalDashboards(): Observable<Dashboard[]> {
    return this.http.get<Dashboard[]>('/user/dashboards/global')
      .pipe(
        (catchError(() => EMPTY))
      );
  }

  getUserDashboards(): Observable<Dashboard[]> {
    return this.http.get<Dashboard[]>('/user/dashboards/user')
      .pipe(
        (catchError(() => EMPTY))
      );
  }

  getTeamDashboards(): Observable<Dashboard[]> {
    return this.http.get<Dashboard[]>('/user/dashboards/team')
      .pipe(
        (catchError(() => EMPTY))
      );
  }

  saveDashboard(dashboard: Dashboard): Observable<void> {
    return this.http.post<HttpResponse<string>>('/user/dashboards/user', dashboard)
      .pipe(
        map(r => undefined),
        (catchError(() => EMPTY))
      );
  }

  removeDashboard(dashboard: Dashboard): Observable<void> {
    const params = new HttpParams().set('name', dashboard.name);
    return this.http.delete<HttpResponse<string>>('/user/dashboards/user', { params })
      .pipe(
        map(r => undefined),
        (catchError(() => EMPTY))
      );
  }

  saveTeamDashboard(team: string, dashboard: Dashboard): Observable<void> {
    const params = new HttpParams().set('team', team);
    return this.http.post<HttpResponse<string>>('/user/dashboards/team', dashboard, { params })
      .pipe(
        map(r => undefined),
        (catchError(() => EMPTY))
      );
  }

  removeTeamDashboard(team: string ,dashboard: Dashboard): Observable<void> {
    const params = new HttpParams().set('name', dashboard.name).set('team', team);
    return this.http.delete<HttpResponse<string>>('/user/dashboards/team', { params })
      .pipe(
        map(r => undefined),
        (catchError(() => EMPTY))
      );
  }

  sendDispatch(owner: string, name: string, eventType: string, clientPayload: any): Observable<void> {
    const p = typeof clientPayload === 'string' ? JSON.parse(clientPayload) : clientPayload;
    const params = new HttpParams().set('owner', owner).set('name', name);
    return this.http.post<HttpResponse<string>>('/api/github/dispatch', { eventType, clientPayload: p }, { params })
      .pipe(
        map(r => undefined),
        (catchError(() => EMPTY))
      );
  }

  getUserDispatches(): Observable<Dispatch[]> {
    return this.http.get<Dispatch[]>('/user/dispatches')
      .pipe(
        (catchError(() => {
          this.store.dispatch(unauthorised());
          return EMPTY;
        }))
      );
  }

  updateDispatch(dispatch: Dispatch): Observable<void> {
    let params = new HttpParams().set('name', dispatch.name).set('eventType', dispatch.eventType);
    if (dispatch.team) {
      params = params.set('team', dispatch.team);
    }
    return this.http.post<HttpResponse<string>>('/user/dispatches', dispatch.clientPayload, { params })
      .pipe(
        map(r => undefined),
        (catchError(() => EMPTY))
      );
  }

  removeDispatch(dispatch: Dispatch): Observable<void> {
    let params = new HttpParams().set('name', dispatch.name);
    if (dispatch.team) {
      params = params.set('team', dispatch.team);
    }
    return this.http.delete<HttpResponse<string>>('/user/dispatches', { params })
      .pipe(
        map(r => undefined),
        (catchError(() => EMPTY))
      );
  }

  changeDispatch(dispatch: Dispatch): Observable<void> {
    let params = new HttpParams().set('name', dispatch.name).set('eventType', dispatch.eventType);
    if (dispatch.team) {
      params = params.set('team', dispatch.team);
    }
    return this.http.patch<HttpResponse<string>>('/user/dispatches', dispatch.clientPayload, { params })
      .pipe(
        map(r => undefined),
        (catchError(() => EMPTY))
      );
  }

  searchRepositories(query: string): Observable<Repository[]> {
    const params = new HttpParams().set('query', query);
    return this.http.get<Repository[]>('/api/github/search/repository', { params })
      .pipe(
        (catchError(() => {
          this.store.dispatch(unauthorised());
          return EMPTY;
        }))
      );
  }

  getGlobalWorkflow(name: string): Observable<Repository[]> {
    return this.http.get<Repository[]>('/api/github/dashboard/global/' + name)
      .pipe(
        tap(repos => {
          repos.forEach(repo => {
            repo.errors.forEach(error => {
              this.alertsService.add({
                id: `repository-${repo.url}`,
                alertType: 'warning',
                text: `Unable to access repo ${repo.url}, maybe you need to login to org.`,
                fixCommand: 'login-to-repo',
                fixCommandRepo: repo.url
              });
            });
          });
        }),
        (catchError(() => {
          this.store.dispatch(unauthorised());
          return EMPTY;
        }))
      );
  }

  getUserWorkflow(name: string): Observable<Repository[]> {
    return this.http.get<Repository[]>('/api/github/dashboard/user/' + name)
      .pipe(
        tap(repos => {
          repos.forEach(repo => {
            repo.errors.forEach(error => {
              this.alertsService.add({
                id: `repository-${repo.url}`,
                alertType: 'warning',
                text: `Unable to access repo ${repo.url}, maybe you need to login to org.`,
                fixCommand: 'login-to-repo',
                fixCommandRepo: repo.url
              });
            });
          });
        }),
        (catchError(() => {
          this.store.dispatch(unauthorised());
          return EMPTY;
        }))
      );
  }

  getTeamWorkflow(name: string, team: string): Observable<Repository[]> {
    const params = new HttpParams().set('team', team);
    return this.http.get<Repository[]>('/api/github/dashboard/team/' + name, { params })
      .pipe(
        tap(repos => {
          repos.forEach(repo => {
            repo.errors.forEach(error => {
              this.alertsService.add({
                id: `repository-${repo.url}`,
                alertType: 'warning',
                text: `Unable to access repo ${repo.url}, maybe you need to login to org.`,
                fixCommand: 'login-to-repo',
                fixCommandRepo: repo.url
              });
            });
          });
        }),
        (catchError(() => {
          this.store.dispatch(unauthorised());
          return EMPTY;
        }))
      );
  }

  getWorkflows(): Observable<Repository[]> {
    return this.http.get<Repository[]>('/api/github/workflows').pipe((catchError(() => EMPTY)));
  }

  getRepositories(): Observable<string[]> {
    const response = this.http.get<string[]>('/api/github/repos');
    return response.pipe(map(data => data));
  }

  getSettings(): Observable<Setting[]> {
    const response = this.http.get<Setting[]>('/user/settings');
    return response.pipe(map(data => data));
  }

  updateSetting(setting: Setting): Observable<void> {
    return this.http.post<void>('/user/settings', [setting]);
  }

  isLoggedIn(): Observable<boolean> {
    return this.http.get<OAuth2User>('/user/whoami')
      .pipe(
        map(() => true),
        catchError(() => of(false))
      );
  }

  getUser(): Observable<User> {
    return this.http.get<OAuth2User>('/user/whoami', {observe: 'response'}).pipe(
      map(data => {
        return {
          name: data.body.attributes.login,
          avatar: data.body.attributes.avatar_url
        };
      }),
      catchError(() => {
        return of({});
      })
    );
  }

  logout(): Observable<boolean> {
    return this.http.post<HttpResponse<string>>('/logout', null).pipe(
      map(r => {
          return true;
        }),
      catchError(this.handleError)
    );
  }

  getTeams(): Observable<Team[]> {
    const response = this.http.get<Team[]>('/api/github/teams');
    return response.pipe(map(data => data));
  }

  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error.message);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      console.error(
        `Backend returned code ${error.status}, ` +
        `body was: ${error.error}`, error);
    }
    // return an observable with a user-facing error message
    return of(false);
    // return throwError(
    //   'Something bad happened; please try again later.');
  }

}

export interface Team {
  name: string;
  combinedSlug: string;
}

export interface Setting {
  name: string;
  value: string;
}

export interface CheckRun {
  name: string;
  status: string;
  conclusion: string;
  url: string;
}

export interface PullRequest {
  name: string;
  number: number;
  url: string;
  checkRuns: CheckRun[];
}

export interface Branch {
  name: string;
  url: string;
  checkRuns: CheckRun[];
}

export interface Dispatch {
  name: string;
  team?: string;
  eventType: string;
  clientPayload: any;
}

export interface Repository {
  owner: string;
  name: string;
  title: string;
  url: string;
  branches: Branch[];
  pullRequests: PullRequest[];
  dispatches: Dispatch[];
  errors: string[];
}

export interface Card {
  name: string;
  type: string;
  repository: Repository;
}

export interface Dashboard {
  name: string;
  description: string;
  team?: string;
  repositories: Repository[];
}

export interface User {
  name?: string;
  avatar?: string;
}

interface OAuth2User {
  attributes: {
    login: string;
    avatar_url: string
  };
}
