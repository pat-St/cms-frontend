import { DashboardComponent } from './dashboard/dashboard.component';
import { MainComponent } from './main.component';
import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { TileEditComponent } from './tile-edit/tile-edit.component';

const routes: Routes = [
  {
    path: 'main',
    component: MainComponent,
    children: [
        { path: 'dashboard', component: DashboardComponent, outlet: 'nav' },
        { path: 'tile', component: TileEditComponent, outlet: 'nav', },
        // { path: '', redirectTo: 'dashboard', pathMatch: 'full'}
    ]
  },
  {path: '', redirectTo: 'main', pathMatch: 'full'}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MainRoutingModule { }
