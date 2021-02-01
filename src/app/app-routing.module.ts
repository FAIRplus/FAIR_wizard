import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {WizardComponent} from "./wizard/wizard.component";
import {HomeComponent} from "./home/home.component";
import {ResourcesComponent} from "./resources/resources.component";
import {FairResourceComponent} from "./common/fair-resource/fair-resource.component";

const routes: Routes = [
  {path: 'index', component: HomeComponent},
  {path: 'home', component: HomeComponent},
  {path: 'wizard', component: WizardComponent},
  {path: 'resources', component: ResourcesComponent},
  {path: 'resource', component: FairResourceComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
