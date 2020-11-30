import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {HttpClientModule} from '@angular/common/http';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {WizardComponent} from './wizard/wizard.component';
import {DecisionNodeComponent} from './decision-node/decision-node.component';
import {DecisionPathComponent} from './decision-path/decision-path.component';
import { HomeComponent } from './home/home.component';
import { ResourcesComponent } from './resources/resources.component';
import { FairResourcesComponent } from './common/fair-resources/fair-resources.component';

@NgModule({
  declarations: [
    AppComponent,
    WizardComponent,
    DecisionNodeComponent,
    DecisionPathComponent,
    HomeComponent,
    ResourcesComponent,
    FairResourcesComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
