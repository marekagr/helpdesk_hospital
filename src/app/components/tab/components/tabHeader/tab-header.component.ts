import { Component,Input,OnInit } from '@angular/core';
import {HeaderInterface} from '../../../../layouts/components/header/interface/headerInterface'
import {HeaderService} from '../../../../layouts/components/header/services/header.service'
import { IssueTreeComponent } from "../../../issue-tree/issue-tree.component";
import { TabEditorComponent } from "../../../editor/components/tab-editor/tab-editor.component";
import { TabService } from "../../services/tab.service";
import { Tab } from "../../models/tab.model";
import {HeaderItem} from '../../../../layouts/components/header/class/headerItem'


@Component({
  selector: 'tab-header',
  templateUrl: './tab-header.component.html',
  styleUrls: ['./tab-header.component.scss']
})
export class TabHeaderComponent implements HeaderInterface{
  @Input() data: any;
  constructor(private tabService: TabService,private headerService: HeaderService) {}



  addNewTreeTab() {
    this.tabService.addTab(
    new Tab(IssueTreeComponent, "Comp1 View", { parent: "TabComponent" })
    );}
  addNewEditorTab() {
      this.tabService.addTab(
      new Tab(TabEditorComponent, "Tab Editor", { parent: "TabComponent" })
      );}
}
