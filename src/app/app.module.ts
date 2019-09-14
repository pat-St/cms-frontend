import { LoginModule } from "./login/login.module";
import { BrowserModule } from "@angular/platform-browser";
import { RouterModule } from "@angular/router";
import { NgModule } from "@angular/core";
import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { MainModule } from "./main/main.module";
import { LayoutModule } from "@angular/cdk/layout";
import { MaterialDependencieModule } from "./material.module";
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  declarations: [AppComponent],
  imports: [
    HttpClientModule,
    RouterModule,
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    LoginModule,
    MainModule,
    LayoutModule,
    MaterialDependencieModule
  ],
  exports: [
    MaterialDependencieModule,
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
