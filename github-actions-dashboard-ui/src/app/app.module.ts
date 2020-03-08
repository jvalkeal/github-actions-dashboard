import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ClarityModule } from '@clr/angular';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ActionCardsComponent } from './action-cards/action-cards.component';
import { UserHeaderActionComponent } from './user/user-header-action/user-header-action.component';
import { HomeComponent } from './home/home.component';
import { ActionCardComponent } from './action-card/action-card.component';
import { StoreModule } from '@ngrx/store';
import { reducers, metaReducers } from './reducers';
import { SettingsComponent } from './settings/settings/settings.component';
import { FormsModule } from '@angular/forms';
import { EffectsModule } from '@ngrx/effects';
import { SettingsEffects } from './settings/settings.effects';

@NgModule({
  declarations: [
    AppComponent,
    ActionCardsComponent,
    UserHeaderActionComponent,
    HomeComponent,
    ActionCardComponent,
    SettingsComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    AppRoutingModule,
    ClarityModule,
    BrowserAnimationsModule,
    EffectsModule.forRoot([
      SettingsEffects
    ]),
    StoreModule.forRoot(reducers, {
      metaReducers,
      runtimeChecks: {
        strictStateImmutability: true,
        strictActionImmutability: true
      }
    })
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
