import { Component, ElementRef, Input, OnInit, ViewChild } from "@angular/core";
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
  hierarchy
} from "d3";

@Component({
  selector: 'app-collapsetree',
  templateUrl: './collapsetree.component.html',
  styleUrls: ['./collapsetree.component.css']
})
export class CollapsetreeComponent implements OnInit {

  @ViewChild("chartArea", { static: true }) chartArea!: ElementRef<any>;
  private treeData = {
    name: "T",
    level: "red",
    value: 10,
    children: [
      {
        name: "A",
        level: "green",
        value: 15,
        children: [
          { name: "A1",level: "blue", value: 5},
          { name: "A2" ,level: "blue", value: 8},
          { name: "A3",level: "blue",  value: 6,},
          { name: "A4",level: "blue",  value: 6},
          {
            name: "C",
            level: "yellow",
            value: 8,
            children: [
              { name: "C1" ,level: "blue", value: 7},
              {
                name: "D",
                level: "purple",
                value: 6,
                children: [{ name: "D1",value: 5,level: "black" }, { name: "D2",level: "blue",value: 5  }]
              }
            ]
          }
        ]
      },
      { name: "Z" ,level: "blue", value: 8},
      {
        name: "B",
        level: "green",
        value: 12,
        children: [{ name: "B1",level: "blue",value: 7  }, { name: "B2" ,level: "blue",value: 7}, { name: "B3",level: "blue",value: 7  }]
      }
    ]
  };
  margin = { top: 10, right: 30, bottom: 30, left: 60 };
  width!: number;
  height = 600 - this.margin.top - this.margin.bottom;
  svg!: Selection<any, any, any, any>;
  x: any;
  y: any;
  private treemap:any;
  private root:any;
  private rectWidth:number=120 //rect width
  private rectHight:number=50 //rectangle height
  private offsetYLink=14


  ngOnInit(): void {
    this.setSvgArea();
    this.setSVGTree()

    this.update(this.root)
  }

  setSvgArea(): void {
    this.width =
      this.chartArea.nativeElement.offsetWidth -
      this.margin.left -
      this.margin.right;

    this.svg = select(this.chartArea.nativeElement)
      .append("svg")
      .attr("width", this.width + this.margin.left + this.margin.right)
      .attr("height", this.height + this.margin.top + this.margin.bottom)
      .append("g")
      .attr("transform", `translate(${this.margin.left}, ${this.margin.top})`);
  }

  setSVGTree():void{
    this.treemap=tree().size([this.height,this.width])
    this.root = hierarchy(this.treeData, function(d:any) {
        return d.children;
    });
    console.log('root',this.root)
    this.root.x0 = this.height / 2;
    this.root.y0 = 0;

    // this.root.children.forEach((d:any)=>{
    //   if (d.children) {
    //     d._children = d.children;
    //     d._children.forEach((n:any)=>{
    //       console.log('n',n)
    //       this.collapse(n)
    //     });
    //     d.children = null;
    //   }
    // });
    // this.update(this.root);
  }

  private update(source:any) {
    var treeData = this.treemap(this.root);


    var nodes = treeData.descendants(),
    links = treeData.descendants().slice(1);
  let i:number=0

  nodes.forEach(function(d:any) {
    d.y = d.depth * 180;
  });
  var node = this.svg.selectAll("g.node").data(nodes, function(d:any) {
    return d.id || (d.id = ++i);
  });
  var nodeEnter = node
    .enter()
    .append("g")
    .attr("class", "node")
    .attr("transform", function(d:any) {
      // return "translate(" + source.y0 + "," + source.x0 + ")";
      return "translate(" + d.y + "," + d.x + ")";
    })
    .on("click", (d:any)=>{
      console.log('d',d)
      if (d.currentTarget.__data__.children) {
        d.currentTarget.__data__._children = d.currentTarget.__data__.children;
        d.currentTarget.__data__.children = null;
      } else {
        d.currentTarget.__data__.children = d.currentTarget.__data__._children;
        d.currentTarget.__data__._children = null;
      }
      this.update(d.currentTarget.__data__);
    });

//------------------ draw rectangle ---------------------------------
  nodeEnter
    .attr("class", "node")
    .attr("r", 1e-6)
    .style("fill", function(d:any) {
      return d.parent ? "rgb(39, 43, 77)" : "#fe6e9e";
    });
  nodeEnter
    .append("rect")
    .attr("rx", function(d:any) {
      if (d.parent) return d.children || d._children ? 0 : 6;
      return 10;
    })
    .attr("ry", function(d:any) {
      if (d.parent) return d.children || d._children ? 0 : 6;
      return 10;
    })
    .attr("stroke-width", function(d:any) {
      return d.parent ? 1 : 0;
    })
    .attr("stroke", function(d:any) {
      return d.children || d._children
        ? "rgb(3, 192, 220)"
        : "rgb(38, 222, 176)";
    })
    .attr("stroke-dasharray", function(d:any) {
      return d.children || d._children ? "0" : "2.2";
    })
    .attr("stroke-opacity", function(d:any) {
      return d.children || d._children ? "1" : "0.6";
    })
    .attr("x", 0)
    .attr("y", -10)
    .attr("width", (d:any)=> {
      return d.parent ? this.rectWidth : this.rectWidth;
    })
    .attr("height", this.rectHight);
//------------------------ end rectangle -------------------------------------

//----------------------------start link ---------------------------
var link = this.svg.selectAll("path.link").data(links, function(d:any) {
  return d.id;
});
var linkEnter = link
  .enter()
  .insert("path", "g")
  .attr("class", "link")
  .style("stroke", function(d:any) { return d.data.level; })
  .attr("d", (d:any)=> {
   // var o = { x: source.x0, y: source.y0 };
    var o = { x: d.x+this.offsetYLink, y: d.y };
    return this.diagonal(o, {x:d.parent.x+this.offsetYLink,y:d.parent.y+this.rectWidth});
  //  let s=o
  //  let p=o
  //  let path = `M ${s.y} ${s.x}
  //  C ${(s.y + p.y) / 2} ${s.x},
  //    ${(s.y + p.y) / 2} ${p.x},
  //    ${p.y} ${p.x}`;
  //  return path
  //  return "M" + d.y + "," + d.x
  //  + "C" + d.y + "," + (d.x + d.parent.x) / 2
  //  + " " + d.parent.y + "," +  (d.x + d.parent.x) / 2
  //  + " " + d.parent.y + "," + d.parent.x;
  });
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
        console.log('n',n)
        this.collapse(n)
      });
      d.children = null;
    }
  }


  private click(d:any) {
    if (d.currentTarget.__data__.children) {
      d.currentTarget.__data__._children = d.currentTarget.__data__.children;
      d.currentTarget.__data__.children = null;
    } else {
      d.currentTarget.__data__.children = d.currentTarget.__data__._children;
      d.currentTarget.__data__._children = null;
    }
    this.update(d.currentTarget.__data__);
  }



}
