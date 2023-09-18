import { Component, OnInit } from "@angular/core";
import { TabService } from "../../services/tab.service";
import { Tab } from "../../models/tab.model";
import { IssueTreeComponent } from "../../../issue-tree/issue-tree.component";

@Component({
  selector: 'app-tab',
  templateUrl: './tab.component.html',
  styleUrls: ['./tab.component.css']
})
export class TabComponent implements OnInit {

  tabs = new Array<Tab>();
  selectedTab?: number;
  constructor(private tabService: TabService) {}
  ngOnInit() {
  this.tabService.tabSub.subscribe(tabs => {
  this.tabs = tabs;
  this.selectedTab = tabs.findIndex(tab => tab.active);
  });}
  tabChanged(event:any) {
  console.log("tab changed",event);
  }
  addNewTab() {
  this.tabService.addTab(
  new Tab(IssueTreeComponent, "Comp1 View", { parent: "TabComponent" })
  );}
  removeTab(index: number): void {
  this.tabService.removeTab(index);
  }}
