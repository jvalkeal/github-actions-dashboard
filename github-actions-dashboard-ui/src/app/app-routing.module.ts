import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ActionCardsComponent } from './action-cards/action-cards.component';
import { AuthGuard } from './auth/auth.guard';
import { HomeComponent } from './home/home.component';

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'cards'},
  { path: 'cards', component: ActionCardsComponent, canActivate: [AuthGuard] },
  { path: 'home', component: HomeComponent },
  { path: '**', component: HomeComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { enableTracing: false, useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
