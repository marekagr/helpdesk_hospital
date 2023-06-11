import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CollapsetreeComponent } from './collapsetree/collapsetree.component';
import {IssueTreeComponent} from './components/issue-tree/issue-tree.component'

const routes: Routes = [
  {
    path: '',
    component :IssueTreeComponent,
  },
  {path: '**', redirectTo: ''},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
