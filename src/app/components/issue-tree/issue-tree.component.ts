import { Component, ElementRef, Input, OnInit, ViewChild } from "@angular/core";
import {  Selection, select, scaleTime, scaleLinear, max, extent, treemap, tree, hierarchy, TreemapLayout} from "d3";
import {IssueTreeService} from './services/issue-tree.service'

@Component({
  selector: 'issue-tree',
  templateUrl: './issue-tree.component.html',
  styleUrls: ['./issue-tree.component.scss']
})
export class IssueTreeComponent implements OnInit {
  constructor(public issueTreeService: IssueTreeService) {}

  @ViewChild("chartArea", { static: true }) chartArea!: ElementRef<any>;
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
  private rectWidth:number=120 //rect width
  private rectHight:number=50 //rectangle height
  private offsetYLink=15
  private  duration = 750

  private params={licz:0}
  // private licz:number=0


  ngOnInit(): void {
    // this.setSvgArea();
    this.treeData=this.issueTreeService.getTreeData();
    this.width=this.issueTreeService.setWidth(this.chartArea.nativeElement,this.margin)
    this.height=this.issueTreeService.setHeight(this.chartArea.nativeElement,this.margin,900)
    this.svg=this.issueTreeService.setSvgArea(this.chartArea.nativeElement,this.margin,this.width,this.height)
    this.treemap=tree().size([this.height,this.width]);
    this.root=this.issueTreeService.setSVGRoot(this.treemap,this.treeData,this.width,this.height)

    this.issueTreeService.update(this.root,this.svg,this.treemap,this.root,this.rectWidth,this.rectHight,this.offsetYLink,this.duration,this.params)
      // this.update(this.root,this.params)
  }

  public onSave(){
    console.log('root',this.root)
  }




  private update(source:any,params:any) {
    var treeData = this.treemap(this.root);


    var nodes = treeData.descendants(),
    links = treeData.descendants().slice(1);


  nodes.forEach((d:any)=> {
    d.y = d.depth * 180;
  });
  let licz=0
  var node: Selection<any, any, any, any> = this.svg.selectAll("g.node").data(nodes, (d:any)=> {
    let wynik=d.id || (d.id = ++params.licz);
    licz++
    return wynik
  });
  var nodeEnter = node
    .enter()
    .append("g")
    .attr("class", "node")
    .attr("transform", (d:any)=> {
      return "translate(" + source.y0 + "," + source.x0 + ")";
      // return "translate(" + d.y + "," + d.x + ")";
    })
    .on("click", (d:any)=>{
      this.click(d,params)

    });

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
      return d.parent ? this.rectWidth : this.rectWidth;
    })
    .attr("height", this.rectHight);
//------------------------ end rectangle -------------------------------------


//-------------------- text -------------------------------------------------------------
nodeEnter
.append("text")
.style("fill", (d:any)=> {
  if (d.parent) {
    return d.children || d._children ? "#ffffff" : "rgb(38, 222, 176)";
  }
  return "rgb(39, 43, 77)";
})
.attr("dy", ".35em")
.attr("x", (d:any)=> {
  return d.children ? (d.data.value)*(1) : d.data.value+4
})
.attr("text-anchor", function(d) {
  return "middle";
})
.text((d:any)=> {
  return d.data.name;
});
//----------------- end text --------------------------------------------


//------------------------ start a href ------------------------
nodeEnter
.append("a")
.attr("xlink:href", "http://en.wikipedia.org/wiki/")
.on("click", (event:any)=>{
  event.preventDefault();
  event.stopPropagation();
  console.log("d3.event",event)
  let newNodeObj:any={ name: "A6",level: "blue",  value: 6,children: []}
 //Creates new Node
 var newNode:any = hierarchy(newNodeObj);
 newNode.depth = event.target.__data__.depth + 1;
 newNode.height = event.target.__data__.height - 1;
 newNode.parent = event.target.__data__;
 newNode.id = ++params.licz;
 event.target.__data__.children.push(newNode)
 event.target.__data__.data.children.push(newNode)

  this.treeData.children[0].children?.push({ name: "A6",level: "blue",  value: 6})
  // this.root = hierarchy(this.treeData, function(d:any) {
  //   return d.children;
  // });
  this.update(event.target.__data__,params)

})
.append("image")
.attr("xlink:href", "https://github.com/favicon.ico")
.attr("x", 18)
.attr("y", 18)
.attr("width", 16)
.attr("height", 16);
//------------------- end a href -----------------------------------


//------------------------ node update -----------------------
var nodeUpdate = nodeEnter.merge(node);

nodeUpdate
  .transition()
  .duration(this.duration)
  .attr("transform", (d:any)=> {
    return "translate(" + d.y + "," + d.x + ")";
  });
var nodeExit = node
  .exit()
  .transition()
  .duration(this.duration)
  .attr("transform", (d:any)=> {
    return "translate(" + source.y + "," + source.x + ")";
  })
  .remove();
nodeExit.select("rect").style("opacity", 1e-6);
nodeExit.select("rect").attr("stroke-opacity", 1e-6);
nodeExit.select("text").style("fill-opacity", 1e-6);


//------------------------ end node update --------------------


//----------------------------start link ---------------------------
this.link = this.svg.selectAll("path.link").data(links, function(d:any) {
  return d.id;
});
var linkEnter = this.link
  .enter()
  .insert("path", "g")
  .attr("class", "link")
  .style("stroke", (d:any)=> { return d.data.level; })
  .attr("d", (d:any)=> {
   // var o = { x: source.x0, y: source.y0 };
    // var o = { x: d.x+this.offsetYLink, y: d.y };
    var o = { x: source.x0+this.offsetYLink, y: source.y0 };
    // return this.diagonal(o, {x:d.parent.x+this.offsetYLink,y:d.parent.y+this.rectWidth});
    return this.diagonal(o, {x:source.x0+this.offsetYLink,y:source.y0+this.rectWidth});

  });

  var linkUpdate = linkEnter.merge(this.link);
  linkUpdate
    .transition()
    .duration(this.duration)
    .attr("d", (d:any)=> {
      var o = { x: d.x+this.offsetYLink, y: d.y };
      return this.diagonal(o, {x:d.parent.x+this.offsetYLink,y:d.parent.y+this.rectWidth});
    });
  var linkExit = this.link
    .exit()
    .transition()
    .duration(this.duration)
    .attr("d", (d:any)=> {
    // var o = { x: source.x, y: source.y };
      var o = { x: source.x+this.offsetYLink, y: source.y };
      return this.diagonal(o, o);
    })
    .remove();

    nodes.forEach((d:any)=> {
      d.x0 = d.x;
      d.y0 = d.y;
    });
    console.log('nodes',nodes)
  }

  private diagonal(s:any, p:any) {
    let path = `M ${s.y} ${s.x}
            C ${(s.y + p.y) / 2} ${s.x},
              ${(s.y + p.y) / 2} ${p.x},
              ${p.y} ${p.x}`;

    return path;
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


  private click(d:any,params:any) {
    console.log('click',d.currentTarget.__data__)
    if (d.currentTarget.__data__.children) {
      d.currentTarget.__data__._children = d.currentTarget.__data__.children;
      d.currentTarget.__data__.children = null;
    } else {
      d.currentTarget.__data__.children = d.currentTarget.__data__._children;
      d.currentTarget.__data__._children = null;
    }
    this.update(d.currentTarget.__data__,params);
  }



}
