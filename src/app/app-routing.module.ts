import { AuthGuard } from "./guard/auth/auth.guard";
import { NgModule } from "@angular/core";
import { Routes, RouterModule, PreloadAllModules } from "@angular/router";

const routes: Routes = [
  {
    path: "",
    loadChildren: () => import('./main/main.module').then(mod => mod.MainModule),
    canActivate: [AuthGuard]
  },
  {
    path: "login", loadChildren: () => import('./login/login.module').then(mod => mod.LoginModule) }
];

@NgModule({
  imports: [RouterModule.forRoot(
    routes,
    {
      enableTracing: true
    }
    )],
  exports: [RouterModule]
})
export class AppRoutingModule { }
