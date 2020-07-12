import { BrowserModule } from '@angular/platform-browser';
import { NgModule, APP_INITIALIZER } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { StoreModule } from '@ngrx/store';
import { StoreRouterConnectingModule } from '@ngrx/router-store';
import { EffectsModule } from '@ngrx/effects';
import { ClarityModule } from '@clr/angular';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ActionCardsComponent } from './dashboard/cards/action-cards/action-cards.component';
import { UserHeaderActionComponent } from './user/user-header-action/user-header-action.component';
import { HomeComponent } from './home/home.component';
import { ActionCardComponent } from './dashboard/cards/action-card/action-card.component';
import { reducers, metaReducers } from './reducers';
import { SettingsComponent } from './settings/settings/settings.component';
import { SettingsEffects } from './settings/settings.effects';
import { LeftNaviComponent } from './layout/left-navi/left-navi.component';
import { AuthEffects } from './auth/auth.effects';
import { DashboardEffects } from './dashboard/dashboard.effects';
import { DispatchesComponent } from './dispatches/dispatches/dispatches.component';
import { ModalNewDispatchComponent } from './dispatches/modal-new-dispatch/modal-new-dispatch.component';
import { DispatchesEffects } from './dispatches/dispatches.effects';
import { ModalEditDispatchComponent } from './dispatches/modal-edit-dispatch/modal-edit-dispatch.component';
import { AlertsComponent } from './alerts/alerts/alerts.component';
import { AlertsEffects } from './alerts/alerts.effects';
import { ModalSendDispatchComponent } from './dispatches/modal-send-dispatch/modal-send-dispatch.component';
import { AddWorkflowComponent } from './dashboard/add-workflow/add-workflow.component';
import { AddDashboardComponent } from './dashboard/add-dashboard/add-dashboard.component';
import { ChooseTeamComponent } from './shared/choose-team/choose-team.component';
import { AuthService } from './auth/auth.service';

@NgModule({
  declarations: [
    AppComponent,
    ActionCardsComponent,
    UserHeaderActionComponent,
    HomeComponent,
    ActionCardComponent,
    SettingsComponent,
    LeftNaviComponent,
    DispatchesComponent,
    ModalNewDispatchComponent,
    ModalEditDispatchComponent,
    AlertsComponent,
    ModalSendDispatchComponent,
    AddWorkflowComponent,
    AddDashboardComponent,
    ChooseTeamComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    AppRoutingModule,
    ClarityModule,
    BrowserAnimationsModule,
    EffectsModule.forRoot([
      DashboardEffects,
      SettingsEffects,
      DispatchesEffects,
      AuthEffects,
      AlertsEffects
    ]),
    StoreModule.forRoot(reducers, {
      metaReducers,
      runtimeChecks: {
        strictStateImmutability: true,
        strictActionImmutability: true
      }
    }),
    StoreRouterConnectingModule.forRoot(),
  ],
  providers: [
    {
      provide: APP_INITIALIZER,
      useFactory: (authService: AuthService) => {
        return () => {
          return authService.login().toPromise();
        };
      },
      deps: [AuthService],
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
