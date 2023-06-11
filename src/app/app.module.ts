import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BarComponent } from './bar/bar.component';
import { TreeComponent } from './tree/tree.component';
import { CollapsetreeComponent } from './collapsetree/collapsetree.component';
import { DemoComponent } from './demo/demo.component';
import { ChartComponent } from './chart/chart.component';
import { IssueTreeComponent } from './components/issue-tree/issue-tree.component';

@NgModule({
  declarations: [
    AppComponent,
    BarComponent,
    TreeComponent,
    CollapsetreeComponent,
    DemoComponent,
    ChartComponent,
    IssueTreeComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
