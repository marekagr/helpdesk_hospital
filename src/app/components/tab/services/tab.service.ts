import { Injectable } from "@angular/core";
import { Tab } from "../models/tab.model";
// import { Comp1Component } from "./components/comp1/comp1.component";
import { IssueTreeComponent } from "../../issue-tree/issue-tree.component";
import { BehaviorSubject } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class TabService {
  public tabs: Tab[] = [
    new Tab(IssueTreeComponent, "Comp1 View", { parent: "AppComponent" }),
    // new Tab(Comp2Component, "Comp2 View", { parent: "AppComponent" })
  ];

  public tabSub = new BehaviorSubject<Tab[]>(this.tabs);

  public removeTab(index: number) {
    this.tabs.splice(index, 1);
    if (this.tabs.length > 0) {
      this.tabs[this.tabs.length - 1].active = true;
    }
    this.tabSub.next(this.tabs);
  }

  public addTab(tab: Tab) {
    for (let i = 0; i < this.tabs.length; i++) {
      if (this.tabs[i].active === true) {
        this.tabs[i].active = false;
      }
    }
    tab.id = this.tabs.length + 1;
    tab.active = true;
    this.tabs.push(tab);
    this.tabSub.next(this.tabs);
  }
}

