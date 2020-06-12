import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
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
import { ModalNewDashboardComponent } from './layout/modal-new-dashboard/modal-new-dashboard.component';
import { DashboardEffects } from './dashboard/dashboard.effects';
import { ModalAddWorkflowComponent } from './layout/modal-add-workflow/modal-add-workflow.component';
import { ModalDeleteDashboardComponent } from './layout/modal-delete-dashboard/modal-delete-dashboard.component';
import { DispatchesComponent } from './dispatches/dispatches/dispatches.component';
import { ModalNewDispatchComponent } from './dispatches/modal-new-dispatch/modal-new-dispatch.component';
import { DispatchesEffects } from './dispatches/dispatches.effects';

@NgModule({
  declarations: [
    AppComponent,
    ActionCardsComponent,
    UserHeaderActionComponent,
    HomeComponent,
    ActionCardComponent,
    SettingsComponent,
    LeftNaviComponent,
    ModalNewDashboardComponent,
    ModalAddWorkflowComponent,
    ModalDeleteDashboardComponent,
    DispatchesComponent,
    ModalNewDispatchComponent
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
      AuthEffects
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
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
