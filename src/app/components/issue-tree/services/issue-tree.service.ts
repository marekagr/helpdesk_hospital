import { Injectable,ElementRef,ApplicationRef } from '@angular/core';
import { HttpClient,HttpHeaders } from "@angular/common/http";
import { Router } from "@angular/router";
import { Subject,BehaviorSubject,Observable } from "rxjs";
import { MatDialog, MatDialogRef,MatDialogConfig,MAT_DIALOG_DATA } from '@angular/material/dialog';
import {margin} from '../models/margin'
import {EditorComponent} from '../../editor/components/editor/editor.component'
import {IssueDialogFormComponent} from '../../issue/components/issue-dialog-form/issue-dialog-form.component'
import { GlobalVariable } from '../../../../global';
import {IssueTree} from "../models/issueTree"
import {UtilityService} from '../../../common/services/utility.service'

const httpOptionsText={headers:new HttpHeaders({'Content-Type':  'text/plain'})};

import {
  Selection,
  select,
  scaleTime,
  scaleLinear,
  max,
  extent,
  axisBottom,
  axisLeft,
  line,
  treemap,
  tree,
  hierarchy,
  selection
} from "d3";

@Injectable({
  providedIn: 'root'
})
export class IssueTreeService {
  dialogEditorFormRef: MatDialogRef<EditorComponent> | undefined
  issueDialogFormComponentRef: MatDialogRef<IssueDialogFormComponent> | undefined
  globalUrl=GlobalVariable.BASE_API_URL;
  private issueTree$ = new BehaviorSubject<IssueTree|null>(null);



  constructor(private utilityService:UtilityService,private http: HttpClient, private router: Router,private ref: ApplicationRef,private dialog: MatDialog) { }

  setSvgArea(nativeElement:HTMLElement,margin:margin,width:number,height:number): Selection<any, any, any, any> {

    return  select(nativeElement)
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", `translate(${margin.left}, ${margin.top})`);
  }

  setSVGRoot(treemap:any,treeData:any,width:number,height:number):any{

    let root:any = hierarchy(treeData, function(d:any) {
        return d.children;
    });
    // console.log('root',this.root)
    root.x0 = height / 2;

    root.y0 = 0;

    root.children?.forEach((d:any)=>{
      this.collapse(d)
    })

    return root

  }



public update(source:any,svg: Selection<any, any, any, any>,treemap:any,root:any,params:any) {
  var nodeEnter:any
  var node: Selection<any, any, any, any>;
  let licz=0
  var treeData = treemap(root);


    var nodes = treeData.descendants(),
    links = treeData.descendants().slice(1);

    this.setNodesYCoordinate(nodes)

    node=this.setNode(nodes,svg,params);

    nodeEnter=this.nodeEnter(node,source,svg,treemap,root,params)

    //------------------ draw rectangle ---------------------------------
    this.drawRect(nodeEnter)

    //-------------------- text -------------------------------------------------------------
    this.drawText(nodeEnter)

    //------------------------ add Icons & Menu ------------------------
    this.addIconsAndMenu(nodeEnter,svg,treemap,root,params)

    //------------------------ node update -----------------------
    this.updateNode(nodeEnter,node,source)

    //----------------------------start link ---------------------------
    this.drawLinks(svg,links,source)

    this.update0Coordinate(nodes)

    console.log('nodes',nodes)

}

private setNodesYCoordinate(nodes:any){
  nodes.forEach((d:any)=> {
    d.y = d.depth * (GlobalVariable.d3.rect.rectWidth+GlobalVariable.d3.rect.rectDistance);
  });
}

private setNode(nodes:any,svg: Selection<any, any, any, any>,params:any):Selection<any, any, any, any>{
  return  svg.selectAll("g.node").data(nodes, (d:any)=> {
    let wynik=d.id || (d.id = ++params.licz);
    // licz++
    return wynik
  });

}

private nodeEnter(node: Selection<any, any, any, any>,source:any,svg: Selection<any, any, any, any>,treemap:any,root:any,params:any):any{
   let nodeEnter = node
  .enter()
  .append("g")
  .attr("class", "node")
  .attr("transform", (d:any)=> {
    return "translate(" + source.y0 + "," + source.x0 + ")";
    // return "translate(" + d.y + "," + d.x + ")";
  })
  .on("click", (d:any)=>{
    this.click(d,svg,treemap,root,params)

  })
  .on('contextmenu', (d:any)=>{
    this.contextMenu(d,svg,treemap,root,params)
  });;

  return nodeEnter
}

private drawRect(nodeEnter:any){
  //------------------ draw rectangle ---------------------------------
// nodeEnter
//   .attr("class", "node")
//   .attr("r", 1e-6)
//   .style("fill", (d:any)=> {
//     return d.parent ? "rgb(39, 43, 77)" : "#fe6e9e";
//   });
nodeEnter
.append("rect")
.attr("rx", (d:any)=> {
  if (d.parent) return d.children || d._children ? 0 : 6;
  return 10;
})
.attr("ry", (d:any)=> {
  if (d.parent) return d.children || d._children ? 0 : 6;
  return 10;
})
.attr("stroke-width", (d:any)=> {
  return d.parent ? 1 : 0;
})
.attr("stroke", (d:any)=> {
  return d.children || d._children
    ? "rgb(3, 192, 220)"
    : "rgb(38, 222, 176)";
})
.attr("stroke-dasharray", (d:any)=> {
  return d.children || d._children ? "0" : "2.2";
})
.attr("stroke-opacity", (d:any)=> {
  return d.children || d._children ? "1" : "0.6";
})
.attr("x", 0)
.attr("y", -10)
.attr("width", (d:any)=> {
  return d.parent ? GlobalVariable.d3.rect.rectWidth : GlobalVariable.d3.rect.rectWidth;
})
.attr("height",  GlobalVariable.d3.rect.rectHight)
.attr('fill', GlobalVariable.d3.rect.fill)
//------------------------ end rectangle -------------------------------------

}

private drawText(nodeEnter:any){
  //-------------------- text -------------------------------------------------------------
// nodeEnter
// .append("text")
// .style("fill", (d:any)=> {
// if (d.parent) {
//   return d.children || d._children ? "#212121" : "#bbbbbb";
// }
// return "#777777";
// })
// .style('inline-size', '200px')
// .attr("dy", ".35em")
// .attr("x", (d:any)=> {
// return d.children ? (d.data.value)*(1) : d.data.value+4
// })
// .attr("text-anchor", (d:any)=> {
// return "start";
// })
// .text((d:any)=> {
// return d.data.name;
// });

nodeEnter
  .append("foreignObject").attr("y", "-5px")
  .attr("x", (d:any)=> {
  return d.children ? (d.data.value)*(1) : d.data.value+4
  })
  .attr("width",GlobalVariable.d3.rect.rectWidth-20).attr("height",GlobalVariable.d3.rect.rectHight-10)
  .append("xhtml:div")
  .style("color", (d:any)=> {
    if (d.parent) {
      return d.children || d._children ? "#212121" : "#bbbbbb";
    }
    return "#777777";
  })
  .classed('foreignObjectText',true)
      .html((d:any)=>`${d.data.name}`);


//----------------- end text --------------------------------------------
}

private addIconsAndMenu(nodeEnter:any,svg: Selection<any, any, any, any>,treemap:any,root:any,params:any){
  //------------------------ start a href ------------------------
nodeEnter
.append("a")
.attr("xlink:href", "http://en.wikipedia.org/wiki/")
.on("click", (event:any)=>{
   event.preventDefault();
   event.stopPropagation();
   console.log("d3.event",event)
  // let newNodeObj:any={ name: "A6",level: "blue",  value: 6,children: []}
  // //Creates new Node
  // var newNode:any = hierarchy(newNodeObj);
  // newNode.depth = event.target.__data__.depth + 1;
  // newNode.height = event.target.__data__.height - 1;
  // newNode.parent = event.target.__data__;
  // newNode.id = ++params.licz;
  // event.target.__data__.children.push(newNode)
  // event.target.__data__.data.children.push(newNode)

  // //treeData.children[0].children?.push({ name: "A6",level: "blue",  value: 6})
  // // this.root = hierarchy(this.treeData, function(d:any) {
  // //   return d.children;
  // // });
  // this.update(event.target.__data__,svg,treemap,root,rectWidth,rectHight,offsetYLink,duration,params)
    //this.addNode(event,svg,treemap,root,rectWidth,rectHight,offsetYLink,duration,params)

  }
)
.append("image")
.attr("xlink:href", "https://github.com/favicon.ico")
.attr("x", 18)
.attr("y", 18)
.attr("width", 16)
.attr("height", 16);
//------------------- end a href -----------------------------------
}

/**
 *
 * @param event
 * @param svg
 * @param treemap
 * @param root
 * @param rectWidth
 * @param rectHight
 * @param offsetYLink
 * @param duration
 * @param params
 */

private addNode(event:any,svg: Selection<any, any, any, any>,treemap:any,root:any,params:any){
  event.preventDefault();
  event.stopPropagation();
  console.log("d3.event",event)
  this.issueDialogFormComponentRef= this.dialog.open(IssueDialogFormComponent,{
    width:"40%",
    maxWidth:'95vw',
    height:"30%",
    disableClose:true,
    autoFocus:true,
    data: {
      currentIssue: {name:'Wielkie dupsko i nic więcej. Lorem lopsem morelem dupa tylko skolko ty być',description:'description'},
      isEdit : false,
    }
  });
  this.issueDialogFormComponentRef.afterClosed().subscribe(result => {
    console.log(`Dialog result: ${result}`,result);
    if(typeof result!="undefined" && result!=null && result!=""){
        console.log('close issueDialogFormComponentRef',result)
        let newNodeObj:any={ name: result.name,description:result.description,level: "blue",  value: 6,children: []}
        //Creates new Node
        var newNode:any = hierarchy(newNodeObj);
        newNode.depth = event.target.__data__.depth + 1;
        newNode.height = event.target.__data__.height - 1;
        newNode.parent = event.target.__data__;
        newNode.id = ++params.licz;
        this.addChildrenToNode(newNode,event,svg,treemap,root,params)
        this.update(event.target.__data__,svg,treemap,root,params)
    }
  });

  // if(event.target.__data__.children || event.target.__data__._children){
  //   event.target.__data__.children.push(newNode)
  //   event.target.__data__.data.children.push(newNode)
  // }
  // else{
  //   event.target.__data__.children=[]
  //   event.target.__data__.children.push(newNode)
  //   event.target.__data__.data.children=[]
  //   event.target.__data__.data.children.push(newNode)
  // }

  //treeData.children[0].children?.push({ name: "A6",level: "blue",  value: 6})
  // this.root = hierarchy(this.treeData, function(d:any) {
  //   return d.children;
  // });

}


editNode(event:any,svg: Selection<any, any, any, any>,treemap:any,root:any,params:any,data:any){

  this.issueDialogFormComponentRef= this.dialog.open(IssueDialogFormComponent,{
    width:"40%",
    maxWidth:'95vw',
    height:"40%",
    disableClose:true,
    autoFocus:true,
    data: {
      currentIssue: {name:this.utilityService.getFieldFromObject(data,'name',''),description:this.utilityService.getFieldFromObject(data,'description','')},
      isEdit : true,
    }
  });
  this.issueDialogFormComponentRef.afterClosed().subscribe(result => {
    console.log(`Dialog result: ${result}`,result);
    if(typeof result!="undefined" && result!=null && result!=""){
        console.log('close issueDialogFormComponentRef',result,event.target.name)
        console.log('editNode',event,event.target);

        if(event.target.localName=='div') {
          event.target.parentElement.__data__.data.name=result.name
          event.target.parentElement.__data__.data.description=result.description
          event.target.innerText=result.name
          event.target.textContent=result.name
        }
        else if(event.target.localName=='foreignObject'){
          event.target.__data__.data.name=result.name
          event.target.__data__.data.description=result.description
          event.target.innerHTML=`<div class="foreignObjectText" style="color: rgb(187, 187, 187);">${result.name}</div>`
        }


        // event.target.__data__.data.name=result.name
        // event.target.innerText=result.name
        // event.target.textContent=result.name
        this.update(event.target.__data__,svg,treemap,root,params)
    }
  });






}





/**
 * add children to node
 * @param newNode
 * @param event
 * @param svg
 * @param treemap
 * @param root
 * @param rectWidth
 * @param rectHight
 * @param offsetYLink
 * @param duration
 * @param params
 */
private addChildrenToNode(newNode:any,event:any,svg: Selection<any, any, any, any>,treemap:any,root:any,params:any){
  if(event.target.__data__.children) {
    event.target.__data__.children.push(newNode)
    event.target.__data__.data.children.push(newNode.data)
  }
  else
  if(event.target.__data__._children)
  {
    event.target.__data__._children.push(newNode)
    event.target.__data__.data.children.push(newNode.data)
    this.click(event,svg,treemap,root,params,'target')
  }
  else
  {
    event.target.__data__.children=[]
    event.target.__data__.children.push(newNode)
    event.target.__data__.data.children=[]
    event.target.__data__.data.children.push(newNode.data)
  }
}


private removeNode(event:any,svg: Selection<any, any, any, any>,treemap:any,root:any,params:any){
  event.preventDefault();
  event.stopPropagation();
  console.log("d3.event",event)
  if (event.target.__data__.parent) {

    // find child and remove it
    for (var ii = 0; ii < event.target.__data__.parent.children.length; ii++) {
      if (event.target.__data__.parent.children[ii].id === event.target.__data__.id) {
        event.target.__data__.parent.children.splice(ii, 1);
        if(event.target.__data__.parent.children.length===0)event.target.__data__.parent.children=null
        break;
      }
    }
  }


  // this.addChildrenToNode(newNode,event,svg,treemap,root,rectWidth,rectHight,offsetYLink,duration,params)
  // if(event.target.__data__.children || event.target.__data__._children){
  //   event.target.__data__.children.push(newNode)
  //   event.target.__data__.data.children.push(newNode)
  // }
  // else{
  //   event.target.__data__.children=[]
  //   event.target.__data__.children.push(newNode)
  //   event.target.__data__.data.children=[]
  //   event.target.__data__.data.children.push(newNode)
  // }

  //treeData.children[0].children?.push({ name: "A6",level: "blue",  value: 6})
  // this.root = hierarchy(this.treeData, function(d:any) {
  //   return d.children;
  // });
  this.update(event.target.__data__,svg,treemap,root,params)
}


private addSalution(event:any,svg: Selection<any, any, any, any>,treemap:any,root:any,params:any){
  event.preventDefault();
  event.stopPropagation();
  console.log("d3.event",event)
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

  // if (event.target.__data__.parent) {

  //   // find child and remove it
  //   for (var ii = 0; ii < event.target.__data__.parent.children.length; ii++) {
  //     if (event.target.__data__.parent.children[ii].id === event.target.__data__.id) {
  //       event.target.__data__.parent.children.splice(ii, 1);
  //       if(event.target.__data__.parent.children.length===0)event.target.__data__.parent.children=null
  //       break;
  //     }
  //   }
  // }





  // this.update(event.target.__data__,svg,treemap,root,rectWidth,rectHight,offsetYLink,duration,params)
}


private updateNode(nodeEnter:any,node: Selection<any, any, any, any>,source:any){
  //------------------------ node update -----------------------
  var nodeUpdate = nodeEnter.merge(node);

  nodeUpdate
  .transition()
  .duration(GlobalVariable.d3.rect.duration)
  .attr("transform", (d:any)=> {
    return "translate(" + d.y + "," + d.x + ")";
  });
  var nodeExit = node
  .exit()
  .transition()
  .duration(GlobalVariable.d3.rect.duration)
  .attr("transform", (d:any)=> {
    return "translate(" + source.y + "," + source.x + ")";
  })
  .remove();
  nodeExit.select("rect").style("opacity", 1e-6);
  nodeExit.select("rect").attr("stroke-opacity", 1e-6);
  nodeExit.select("text").style("fill-opacity", 1e-6);


//------------------------ end node update --------------------
}
/**
 * draw  links of node
 * @param svg
 * @param links
 * @param source
 * @param rectWidth
 * @param offsetYLink
 * @param duration
 */
private drawLinks(svg: Selection<any, any, any, any>,links:any,source:any){
  //----------------------------start link ---------------------------
let link:Selection<any, any, any, any> = svg.selectAll("path.link").data(links, function(d:any) {
  return d.id;
  });
  var linkEnter = link
  .enter()
  .insert("path", "g")
  .attr("class", "link")
  .style("stroke", (d:any)=> { return d.data.level; })
  .attr("d", (d:any)=> {
   // var o = { x: source.x0, y: source.y0 };
    // var o = { x: d.x+this.offsetYLink, y: d.y };
    var o = { x: source.x0+GlobalVariable.d3.rect.offsetYLink, y: source.y0 };
    // return this.diagonal(o, {x:d.parent.x+this.offsetYLink,y:d.parent.y+this.rectWidth});
    return this.diagonal(o, {x:source.x0+GlobalVariable.d3.rect.offsetYLink,y:source.y0+GlobalVariable.d3.rect.rectWidth});

  });

  var linkUpdate = linkEnter.merge(link);
  linkUpdate
    .transition()
    .duration(GlobalVariable.d3.rect.duration)
    .attr("d", (d:any)=> {
      var o = { x: d.x+GlobalVariable.d3.rect.offsetYLink, y: d.y };
      return this.diagonal(o, {x:d.parent.x+GlobalVariable.d3.rect.offsetYLink,y:d.parent.y+GlobalVariable.d3.rect.rectWidth});
    });
  var linkExit = link
    .exit()
    .transition()
    .duration(GlobalVariable.d3.rect.duration)
    .attr("d", (d:any)=> {
    // var o = { x: source.x, y: source.y };
      var o = { x: source.x+GlobalVariable.d3.rect.offsetYLink, y: source.y };
      return this.diagonal(o, o);
    })
    .remove();
}

private update0Coordinate(nodes:any){
  nodes.forEach((d:any)=> {
    d.x0 = d.x;
    d.y0 = d.y;
  });
}

private diagonal(s:any, p:any) {
  let path = `M ${s.y} ${s.x}
          C ${(s.y + p.y) / 2} ${s.x},
            ${(s.y + p.y) / 2} ${p.x},
            ${p.y} ${p.x}`;

  return path;
}

/**
 *
 * @param d
 * @param svg
 * @param treemap
 * @param root
 * @param rectWidth
 * @param rectHight
 * @param offsetYLink
 * @param duration
 * @param params
 * @param string target default 'currentTarget'
 */
private click(d:any,svg: Selection<any, any, any, any>,treemap:any,root:any,params:any,target:string="currentTarget") {
  console.log('click',d[target].__data__)
  if (d[target].__data__.children) {
    d[target].__data__._children = d[target].__data__.children;
    d[target].__data__.children = null;
  } else {
    d[target].__data__.children = d[target].__data__._children;
    d[target].__data__._children = null;
  }
  this.update(d[target].__data__,svg,treemap,root,params);
  // this.update(d.target.__data__,svg,treemap,root,rectWidth,rectHight,offsetYLink,duration,params);
}



private contextMenu(d:any,svg: Selection<any, any, any, any>,treemap:any,root:any,params:any){
  console.log('contextMenu',d,d.currentTarget.__data__)
  let data=d.currentTarget.__data__
  d.currentTarget.__data__.data["salution"]="dupa"
  // create the div element that will hold the context menu
  // svg.selectAll('.svg-popupmenu').remove()
  // let foreignObject=svg.append('foreignObject')
  // .attr('x',d.pageX - 20)
  // .attr('y',d.pageY - 120)
  // .attr('width',100)
  // .attr('overflow','visible')
  // .attr('class','svg-popupmenu')
  //  var div = foreignObject.append('xhtml:div')
  //  .attr('class','svg-popupmenuDiv')
  //  .append('p').html('kuwa mac')


  select('body').selectAll('.d3-context-menu').data([1])
  .enter()
  .append('div')
  .attr('class', 'd3-context-menu');

  // close menu
  select('body').on('click.d3-context-menu', function() {
     select('.d3-context-menu').style('display', 'none');
  });

  var elm = this;

  select('body').selectAll('.d3-context-menu').html('');
  var list = select('body').selectAll('.d3-context-menu').append('ul');
  list.selectAll('li').data(this.menuItems).enter()
    .append('li')
    .html(function(i) {
      return i.title;
    })
    .on('click', (i, item)=> {
      console.log('d',i.currentTarget.__data__,item,data)
      let parametry:[any,Selection<any, any, any, any>,any,any,any,any]=[d,svg,treemap,root,params,data.data]
      // item.action(elm, ...parametry);
      item.action(item, parametry);
      select('body').select('.d3-context-menu').style('display', 'none');
    });

  // the openCallback allows an action to fire before the menu is displayed
  // an example usage would be closing a tooltip
  // if (openCallback) openCallback(data, index);

  // display context menu
  select('body').select('.d3-context-menu')
    .style('left', (d.pageX - 2) + 'px')
    .style('top', (d.pageY - 2) + 'px')
    .style('display', 'block');

  d.preventDefault();
}

private collapse(d:any | null){
    if (d.children) {
      d._children = d.children;
      d._children.forEach((n:any)=>{
        // console.log('n',n)
        this.collapse(n)
      });
      d.children = null;
    }
  }


  setWidth(nativeElement:HTMLElement,margin:margin):number{
    // let width=nativeElement.offsetWidth==0?1200:nativeElement.offsetWidth
   let width=nativeElement.offsetWidth

    return width - margin.left - margin.right;
  }

  setHeight(nativeElement:HTMLElement,margin:margin,workHeight:number=900):number{
    return workHeight - margin.top - margin.bottom;
  }

  getTreeData(data:any):any{
    return typeof data !="undefined" && typeof data.issue !="undefined"?data.issue:{name: "T",level: "red", value: 10, children: []};
    // {
    //   name: "T",
    //   level: "red",
    //   value: 10,
    //   children: [
    //     {
    //       name: "A",
    //       level: "green",
    //       value: 15,
    //       children: [
    //         { name: "A1",level: "blue", value: 5},
    //         { name: "A2" ,level: "blue", value: 8},
    //         { name: "A3",level: "blue",  value: 6,},
    //         { name: "A4",level: "blue",  value: 6},
    //         {
    //           name: "A5",
    //           level: "yellow",
    //           value: 8,
    //           children: [
    //             { name: "A5_1" ,level: "blue", value: 7},
    //             {
    //               name: "A5_2",
    //               level: "purple",
    //               value: 6,
    //               children: [{ name: "A5_2_1",value: 5,level: "black"  }, { name: "A5_2_2",level: "blue",value: 5  }]
    //             }
    //           ]
    //         }
    //       ]
    //     },
    //     { name: "B" ,level: "blue", value: 8},
    //     {
    //       name: "C",
    //       level: "green",
    //       value: 12,
    //       children: [{ name: "C1",level: "blue",value: 7  }, { name: "C2" ,level: "blue",value: 7}, { name: "C3",level: "blue",value: 7  }]
    //     }
    //   ]
    // };
  }


  private  menuItems = [
    {
      title: 'Dodaj węzeł',
      action: (d:any,data:any) => {
        // TODO: add any action you want to perform
        let parametry:[any,Selection<any, any, any, any>,any,any,any]=data
        // parametry[0]['currentTarget']=parametry[0]['target']
        console.log('add node',d,'data',data);
        this.addNode(...parametry)
      }
    },
    {
      title: 'Edytuj węzeł',
      action: (d:any,data:any) => {
        // TODO: add any action you want to perform
        let parametry:[any,Selection<any, any, any, any>,any,any,any,any]=data
        // parametry[0]['currentTarget']=parametry[0]['target']
        console.log('edit node',d,'data',data);
        this.editNode(...parametry)
      }
    },
    {
      title: 'Usuń węzeł',
      action: (d:any,data:any) => {
        // TODO: add any action you want to perform
        let parametry:[any,Selection<any, any, any, any>,any,any,any,]=data
        this.removeNode(...parametry)
        console.log('remove node',d,data);
      }
    },
    {
      title: 'Rozwiązanie',
      action: (d:any,data:any) => {
        // TODO: add any action you want to perform
        let parametry:[any,Selection<any, any, any, any>,any,any,any]=data
        this.addSalution(...parametry)
        console.log('add salution',d,data);
      }
    }
  ];


  saveIssue(issue:any):Observable<any> {
    const url = `${this.globalUrl}/kwestia`;
    const issueData = { issue: issue };
    return this.http.post(url, issueData,httpOptionsText);
  }

  updateIssue(id:string,issue:any):Observable<IssueTree>{
    console.log('updateIssue',issue)
    const issueData = { issue: issue };
    return this.http.put<IssueTree>(`${this.globalUrl}/kwestia/${id}`,issueData,httpOptionsText);
  }

  saveIssueMetaData(issue:any):Observable<any> {
    const url = `${this.globalUrl}/kwestia`;
    const issueData = {name:issue.value,description:issue.description};
    return this.http.post(url, issueData,httpOptionsText);
  }

  updateIssueMetaData(id:string,issue:any):Observable<IssueTree>{
    console.log('updateIssue',issue)
    const issueData = {name:issue.name,description:issue.description};
    return this.http.put<IssueTree>(`${this.globalUrl}/kwestia/${id}`,issueData,httpOptionsText);
  }


  setIssueTree$(item:any){
    this.issueTree$.next(item);
  }

  getIssueTree$() {
    return this.issueTree$.asObservable();
  }

  getIssueTreeValue() {
    return this.issueTree$.value;
  }


  getIssueTreeById(id:string):Observable<any>{
    const url = `${this.globalUrl}/kwestia/${id}`;
    return this.http.get<IssueTree>(url)

  }



}
