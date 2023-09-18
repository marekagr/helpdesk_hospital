//
import { NgModule, LOCALE_ID } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { registerLocaleData } from '@angular/common';
import localePl from '@angular/common/locales/pl';
registerLocaleData(localePl, 'pl');
import { MaterialModule } from './material/material.module';
//import {MatTabsModule} from '@angular/material/tabs';


import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BarComponent } from './bar/bar.component';
import { TreeComponent } from './tree/tree.component';
import { CollapsetreeComponent } from './collapsetree/collapsetree.component';
import { DemoComponent } from './demo/demo.component';
import { ChartComponent } from './chart/chart.component';
import { IssueTreeComponent } from './components/issue-tree/issue-tree.component';
import { MainComponent } from './layouts/components/main/main.component';
import { HeaderComponent } from './layouts/components/header/header.component';
import { FooterComponent } from './layouts/components/footer/footer.component';
// import { TabContentComponent } from './components/tab-content/components/tab-content/tab-content.component';
import { ContentContainerDirective } from './components/tab-content/directives/content-container.directive';
// import { MatTabsModule } from "@angular/material/tabs";
@NgModule({
  declarations: [
    AppComponent,
    BarComponent,
    TreeComponent,
    CollapsetreeComponent,
    DemoComponent,
    ChartComponent,
    IssueTreeComponent,
    MainComponent,
    HeaderComponent,
    FooterComponent,
    ContentContainerDirective,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MaterialModule,
    // MatTabsModule
  ],
  providers: [{provide: LOCALE_ID, useValue: 'pl-PL' }],
  bootstrap: [AppComponent]
})
export class AppModule { }
