import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {WizardComponent} from "./wizard/wizard.component";
import {HomeComponent} from "./home/home.component";
import {ResourcesComponent} from "./resources/resources.component";
import {FairResourceComponent} from "./common/fair-resource/fair-resource.component";
import {FairResourcesShowcaseComponent} from "./common/fair-resources-showcase/fair-resources-showcase.component";
import {AssessmentComponent} from "./assessment/assessment.component";

const routes: Routes = [
  {path: 'index', component: HomeComponent},
  {path: 'home', component: HomeComponent},
  {path: 'wizard', component: WizardComponent},
  {path: 'resources', component: ResourcesComponent},
  {path: 'resource', component: FairResourceComponent},
  {path: 'showcase', component: FairResourcesShowcaseComponent},
  {path: 'assessment', component: AssessmentComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
