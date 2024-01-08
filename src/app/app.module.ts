//
import { NgModule, LOCALE_ID } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { registerLocaleData } from '@angular/common';
import localePl from '@angular/common/locales/pl';
registerLocaleData(localePl, 'pl');
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from './material/material.module';
//import {MatTabsModule} from '@angular/material/tabs';
import { HttpClientModule} from '@angular/common/http';
import { AngularEditorModule } from '@kolkov/angular-editor';

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
import { EditorComponent } from './components/editor/components/editor/editor.component';
import { HeaderDirective } from './layouts/components/header.directive';
import { TabHeaderComponent } from './components/tab/components/tabHeader/tab-header.component';
import { StartComponent } from './components/start/components/start/start.component';
import { TabEditorComponent } from './components/editor/components/tab-editor/tab-editor.component';
import { IssueListComponent } from './components/issue/components/issue-list/issue-list.component';
import { IssueDialogFormComponent } from './components/issue/components/issue-dialog-form/issue-dialog-form.component';

// import { TabContentComponent } from './components/tab-content/components/tab-content/tab-content.component';
// import { ContentContainerDirective } from './components/tab-content/directives/content-container.directive';
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
    // ContentContainerDirective,
  EditorComponent,
  HeaderComponent,
  MainComponent,
  FooterComponent,
  HeaderDirective,
  TabHeaderComponent,
  StartComponent,
  TabEditorComponent,
  IssueListComponent,IssueDialogFormComponent,],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MaterialModule,
    BrowserAnimationsModule,
    HttpClientModule,
    AngularEditorModule,
    FormsModule,
        ReactiveFormsModule
    // MatTabsModule
  ],
  providers: [{provide: LOCALE_ID, useValue: 'pl-PL' }],
  bootstrap: [AppComponent]
})
export class AppModule { }
