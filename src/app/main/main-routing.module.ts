import { EditContentComponent } from './edit-content/edit-content.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { MainComponent } from './main.component';
import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

const routes: Routes = [
  {
    path: 'main',
    component: MainComponent,
    children: [
        { path: '', component: DashboardComponent, outlet: 'nav' },
        { path: 'tile', component: EditContentComponent, outlet: 'nav', },
        { path: 'dashboard', component: DashboardComponent, outlet: 'nav' },
    ]
  },
  {path: '', redirectTo: 'main', pathMatch: 'full'}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MainRoutingModule { }
