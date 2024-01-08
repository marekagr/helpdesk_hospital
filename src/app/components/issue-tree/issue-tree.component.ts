import { Component, ElementRef, Input, OnInit, ViewChild,AfterViewInit,ChangeDetectorRef } from "@angular/core";
import { MatDialog, MatDialogRef,MatDialogConfig } from '@angular/material/dialog';
import {FormArray, FormControl,FormGroup,Validators,FormBuilder, Form,ValidationErrors } from '@angular/forms';


import {Selection, select, scaleTime, scaleLinear, max, extent, treemap, tree, hierarchy, TreemapLayout} from "d3";
import {IssueTreeService} from './services/issue-tree.service'
import {IssueService} from '../issue/services/issue.service'
import {EditorComponent} from './../editor/components/editor/editor.component'

@Component({
  selector: 'issue-tree',
  templateUrl: './issue-tree.component.html',
  styleUrls: ['./issue-tree.component.scss']
})
export class IssueTreeComponent implements OnInit {
  @ViewChild("chartArea", { static: true }) chartArea!: ElementRef<any>;
  @Input('data') data:any; //object contains of _id
  private treeData :any;
  margin = { top: 10, right: 10, bottom: 30, left: 10 };
  width!: number;
  height = 900 - this.margin.top - this.margin.bottom;
  svg!: Selection<any, any, any, any>;
  link!: Selection<any, any, any, any>;
  x: any;
  y: any;
  private treemap:any;
  private root:any;
  events: string[] = [];
  opened: boolean=false;
  issueForm!:FormGroup;
  // private rectWidth:number=230 //rect width
  // private rectDistance:number=50 //distance between rectangles
  // private rectHight:number=80 //rectangle height
  // private offsetYLink=30
  // private  duration = 750

  private params={licz:0}
  dialogEditorFormRef: MatDialogRef<EditorComponent> | undefined


  constructor(public issueTreeService: IssueTreeService,private ref: ChangeDetectorRef,private dialog: MatDialog,private formBuilder: FormBuilder) {
    console.log('data from tab',this.data)
    this.issueForm= this.formBuilder.group({

      name:new FormControl(null,[Validators.required]),
      type:new FormControl(),
      description:new FormControl(),



      _id:new FormControl(),
      __v:new FormControl(),
    })
  }



  // private licz:number=0




  ngOnInit(): void {
    // this.setSvgArea();
        // this.update(this.root,this.params)
  }
  ngAfterViewInit(): void {

    setTimeout(()=>{                           // <<<---using ()=> syntax
      if(typeof this.data !="undefined" && typeof this.data.issue !="undefined")this.issueForm.patchValue(this.data)
      this.treeData=this.issueTreeService.getTreeData(this.data);
      this.width=this.issueTreeService.setWidth(this.chartArea.nativeElement,this.margin)
      this.height=this.issueTreeService.setHeight(this.chartArea.nativeElement,this.margin,1500)
      this.svg=this.issueTreeService.setSvgArea(this.chartArea.nativeElement,this.margin,this.width,this.height)
      this.treemap=tree().size([this.height,this.width]);
      this.root=this.issueTreeService.setSVGRoot(this.treemap,this.treeData,this.width,this.height)

      this.issueTreeService.update(this.root,this.svg,this.treemap,this.root,this.params)
      this.data.name+="dd"
      console.log('data from tab',this.data)
  }, 500);

  }
  public onSave(){
    console.log('root',this.root,this.data)
    const getCircularReplacer = (deletePorperties:any) => { //func that allows a circular json to be stringified
      const seen = new WeakSet();
      return (key:any, value:any) => {
        if (typeof value === "object" && value !== null) {
          if(deletePorperties){
            delete value.id; //delete all properties you don't want in your json (not very convenient but a good temporary solution)
            delete value.x0;
            delete value.y0;
            delete value.y;
            delete value.x;
            delete value.depth;
            delete value.size;
          }
          if (seen.has(value)) {
            return;
          }
          seen.add(value);
        }
        return value;
      };
    };

    var myRoot = JSON.stringify(this.root, getCircularReplacer(false)); //Stringify a first time to clone the root object (it's allow you to delete properties you don't want to save)
    var myvar= JSON.parse(myRoot);
    myvar= JSON.stringify(myvar, getCircularReplacer(true)); //Stringify a second time to delete the propeties you don't need

    console.log("%j",JSON.parse(myvar)); //You have your json in myvar
    let dane:any=JSON.parse(myvar)
    if(typeof this.data._id!='undefined' && typeof this.data._id=='string')
      this.issueTreeService.updateIssue(this.data._id,dane.data).subscribe(data=>console.log(data))
    else
      this.issueTreeService.saveIssue(dane.data).subscribe(data=>console.log(data))

  }

  newTask(){
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



  onSubmit({ value, valid }: { value: any, valid: boolean }) {
    if(typeof this.data._id!='undefined' && typeof this.data._id=='string')
      this.issueTreeService.updateIssueMetaData(this.data._id,value).subscribe((data:any)=>console.log(data))
    else
       this.issueTreeService.saveIssueMetaData(value).subscribe((data:any)=>console.log(data))
  }









}
