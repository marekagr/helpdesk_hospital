import { Component } from '@angular/core';
import {IssueService} from '../../services/issue.service'
import {UtilityService} from '../../../../common/services/utility.service'

import {Issue} from "../../models/Issue"
import {IssueTree} from "../../../issue-tree/models/issueTree"
import { TabService } from "../../../tab/services/tab.service";
import { IssueTreeComponent } from "../../../issue-tree/issue-tree.component";
import { Tab } from "../../../tab/models/tab.model";
// import { isTemplateExpression } from 'typescript';

@Component({
  selector: 'issue-list',
  templateUrl: './issue-list.component.html',
  styleUrls: ['./issue-list.component.css']
})
export class IssueListComponent {
  public issueList:Issue[]=[];


  constructor(public issueService:IssueService,private tabService: TabService,private utilityService: UtilityService) {}


  ngOnInit(): void {
    this.issueService.getIssueList()
    this.issueService.getIssueList$().subscribe(items=>{

      this.issueList=this.issueService.getIssueListValue()
      console.log('registerItems',this.issueList);
    })

    this.issueService.getcurrentIssue$().subscribe((item:Issue|null)=>{
      let indexIssue:number=-1;
      if(item!=null && typeof item._id != undefined){
        indexIssue=this.issueList.findIndex((kwestia:Issue)=>kwestia._id==item._id)
        this.issueList[indexIssue]=item
      }
    })
  }

  getIssue(id:string){
    this.issueService.getIssueById(id).subscribe(issue=>{
      this.issueService.setcurrentIssue$(issue);
      this.tabService.addTab(
        new Tab(IssueTreeComponent, this.utilityService.getFieldFromObject(issue,'name','Mój problem'), { parent: "TabComponent",...this.prepareIssue(issue)}))
      console.log('getIsuue',issue)
    })
  }

  private prepareIssue(kwestia:IssueTree|any):IssueTree|any{

    if(typeof kwestia.type=='undefined' || kwestia.type=='tree'){
      return {
        name:this.utilityService.getFieldFromObject(kwestia,'name',''),
        description:this.utilityService.getFieldFromObject(kwestia,'description',''),
        _id:kwestia._id,
        issue:kwestia.issue,
      }
    }
  }

}
