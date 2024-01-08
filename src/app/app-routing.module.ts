import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CollapsetreeComponent } from './collapsetree/collapsetree.component';
import {IssueTreeComponent} from './components/issue-tree/issue-tree.component'
import {TabComponent} from './components/tab/components/tab/tab.component'
import { MainComponent } from './layouts/components/main/main.component'
const routes: Routes = [
  {
    path: '',
    component :MainComponent,
  },
  {path: '**', redirectTo: ''},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
