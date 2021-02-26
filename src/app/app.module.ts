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
    FairResourceComponent
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
