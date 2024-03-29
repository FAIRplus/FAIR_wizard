import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {HttpClientModule} from '@angular/common/http';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {WizardComponent} from './wizard/wizard.component';
import {DecisionNodeComponent} from './decision-node/decision-node.component';
import {DecisionPathComponent} from './decision-path/decision-path.component';
import {HomeComponent} from './home/home.component';
import {ResourcesComponent} from './resources/resources.component';
import {FairResourcesComponent} from './common/fair-resources/fair-resources.component';
import {ProcessDiagramComponent} from './common/process-diagram/process-diagram.component';
import {ProcessDialogComponent} from './common/process-dialog/process-dialog.component';
import {NgbModule} from "@ng-bootstrap/ng-bootstrap";
import { FairResourceComponent } from './common/fair-resource/fair-resource.component';
import {FormsModule} from "@angular/forms";
import { FairResourcesShowcaseComponent } from './common/fair-resources-showcase/fair-resources-showcase.component';
import { FacetPanelComponent } from './common/facet-panel/facet-panel.component';
import { FacetGroupComponent } from './common/facet-group/facet-group.component';
import { FacetComponent } from './common/facet/facet.component';
import { ResourceNetworkComponent } from './common/resource-network/resource-network.component';
import { AssessmentComponent } from './assessment/assessment.component';
import { AboutComponent } from './about/about.component';
import { DsmModelComponent } from './dsm-model/dsm-model.component';
import { SaveDialogComponent } from './common/save-dialog/save-dialog.component';

@NgModule({
  declarations: [
    AppComponent,
    WizardComponent,
    DecisionNodeComponent,
    DecisionPathComponent,
    HomeComponent,
    ResourcesComponent,
    FairResourcesComponent,
    ProcessDiagramComponent,
    ProcessDialogComponent,
    FairResourceComponent,
    FairResourcesShowcaseComponent,
    FacetPanelComponent,
    FacetGroupComponent,
    FacetComponent,
    ResourceNetworkComponent,
    AssessmentComponent,
    AboutComponent,
    DsmModelComponent,
    SaveDialogComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    NgbModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
