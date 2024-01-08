import { Component, OnInit } from "@angular/core";
import { MatDialog, MatDialogRef,MatDialogConfig } from '@angular/material/dialog';
import { TabService } from "../../services/tab.service";
import { Tab } from "../../models/tab.model";
import { IssueTreeComponent } from "../../../issue-tree/issue-tree.component";
import { EditorComponent } from "../../../editor/components/editor/editor.component";
import {TabHeaderComponent} from "../tabHeader/tab-header.component"
import {HeaderItem} from '../../../../layouts/components/header/class/headerItem'
import {HeaderService} from '../../../../layouts/components/header/services/header.service'


@Component({
  selector: 'app-tab',
  templateUrl: './tab.component.html',
  styleUrls: ['./tab.component.scss']
})
export class TabComponent implements OnInit {

  tabs = new Array<Tab>();
  selectedTab?: number;
  dialogEditorFormRef: MatDialogRef<EditorComponent> | undefined

  constructor(private tabService: TabService,private headerService: HeaderService,private dialog: MatDialog) {}
  ngOnInit() {
    this.tabService.tabSub.subscribe(tabs => {
    this.tabs = tabs;
    this.selectedTab = tabs.findIndex(tab => tab.active);
    const cmp=new HeaderItem(TabHeaderComponent,{pp:'sss'})
    this.headerService.setcurrentHeader$(cmp)
  });}
  tabChanged(event:any) {
  console.log("tab changed",event);
  }
  addNewTreeTab() {
  this.tabService.addTab(
  new Tab(IssueTreeComponent, "Comp1 View", { parent: "TabComponent" })
  );}
  addNewEditorTab() {
    this.tabService.addTab(
    new Tab(EditorComponent, "Editor", { parent: "TabComponent" })
    );}
  removeTab(index: number): void {
  this.tabService.removeTab(index);
  }
  public newTask(){
    // this.registerService.setNewDeal();
    // this.attachmentService.setBlobsListener(null);
    this.dialogEditorFormRef= this.dialog.open(EditorComponent,{
      width:"98%",
      maxWidth:'95vw',
      height:"90%",
      disableClose:true,
      autoFocus:true,

    });
    this.dialogEditorFormRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`,result);
      if(typeof result!="undefined" && result!=null && result!=""){
        // this.registerService.getregisterItems();
        // this.dataSource._updateChangeSubscription();
      }
    });
  }


}
