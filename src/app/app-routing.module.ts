import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CollapsetreeComponent } from './collapsetree/collapsetree.component';
import {DemoComponent} from './demo/demo.component'

const routes: Routes = [
  {
    path: '',
    component :CollapsetreeComponent,
  },
  {path: '**', redirectTo: ''},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
