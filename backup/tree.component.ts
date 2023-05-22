import { Component, OnInit } from '@angular/core';
import * as d3 from 'd3';


@Component({
  selector: 'app-tree',
  templateUrl: './tree.component.html',
  styleUrls: ['./tree.component.scss']
})
export class TreeComponent implements OnInit {
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

  private svg: any;
  private i:number = 0
  private duration:number = 750
  private root:any;
  private treemap:any;

  private margin = { top: 20, right: 90, bottom: 30, left: 90 }
  private width = 1200 - this.margin.left - this.margin.right
  private height = 900 - this.margin.top - this.margin.bottom;


  constructor() { }

  ngOnInit(): void {
     this.createSvg();
  }

  private createSvg(): void {
      this.svg = d3.select("body")
        .append("svg")
        .attr("width", this.width + this.margin.right + this.margin.left)
        .attr("height", this.height + this.margin.top + this.margin.bottom)
        .append("g")
        .attr("transform", "translate(" + this.margin.left + "," + this.margin.top + ")");
      this.treemap=d3.tree().size([this.height,this.width])
      this.root = d3.hierarchy(this.treeData, function(d:any) {
        return d.children;
      });
      this.root.x0 = this.height / 2;
      this.root.y0 = 0;
      this.root.children.forEach(this.collapse);
      this.update(this.root);
  }

  private collapse(d:any | null){
    if (d.children) {
      d._children = d.children;
      d._children.forEach(this.collapse);
      d.children = null;
    }
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
        return "translate(" + source.y0 + "," + source.x0 + ")";
      })
      .on("click", this.click);

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
      .attr("width", function(d:any) {
        return d.parent ? 120 : 90;
      })
      .attr("height", 50);
  //------------------------ end rectangle -------------------------------------


  //-------------------- text -------------------------------------------------------------
    nodeEnter
      .append("text")
      .style("fill", function(d:any) {
        if (d.parent) {
          return d.children || d._children ? "#ffffff" : "rgb(38, 222, 176)";
        }
        return "rgb(39, 43, 77)";
      })
      .attr("dy", ".35em")
      .attr("x", function(d:any) {
        return d.children ? (d.data.value)*(1) : d.data.value+4
      })
      .attr("text-anchor", function(d:any) {
        return "middle";
      })
      .text(function(d:any) {
        return d.data.name;
      });
    //----------------- end text --------------------------------------------

    nodeEnter
    .append("a")
    .attr("xlink:href", "http://en.wikipedia.org/wiki/")
    .on("click", (event:any)=>{
      console.log("d3.event",event)
      event.preventDefault();
      event.stopPropagation();
    })
    .append("image")
    .attr("xlink:href", "https://github.com/favicon.ico")
    .attr("x", 18)
    .attr("y", 18)
    .attr("width", 16)
    .attr("height", 16);


    var nodeUpdate = nodeEnter.merge(node);

    nodeUpdate
      .transition()
      .duration(this.duration)
      .attr("transform", function(d:any) {
        return "translate(" + d.y + "," + d.x + ")";
      });
    var nodeExit = node
      .exit()
      .transition()
      .duration(this.duration)
      .attr("transform", function(d:any) {
        return "translate(" + source.y + "," + source.x + ")";
      })
      .remove();
    nodeExit.select("rect").style("opacity", 1e-6);
    nodeExit.select("rect").attr("stroke-opacity", 1e-6);
    nodeExit.select("text").style("fill-opacity", 1e-6);
    var link = this.svg.selectAll("path.link").data(links, function(d:any) {
      return d.id;
    });
    var linkEnter = link
      .enter()
      .insert("path", "g")
      .attr("class", "link")
      .style("stroke", function(d:any) { return d.data.level; })
      .attr("d", function(d:any) {
        var o = { x: source.x0, y: source.y0 };
        return diagonal(o, o);
      });
    var linkUpdate = linkEnter.merge(link);
    linkUpdate
      .transition()
      .duration(this.duration)
      .attr("d", function(d:any) {
        return diagonal(d, d.parent);
      });
    var linkExit = link
      .exit()
      .transition()
      .duration(this.duration)
      .attr("d", function(d:any) {
        var o = { x: source.x, y: source.y };
        return diagonal(o, o);
      })
      .remove();
    nodes.forEach(function(d:any) {
      d.x0 = d.x;
      d.y0 = d.y;
    });
    function diagonal(s:any, d:any) {
      let path = `M ${s.y} ${s.x}
              C ${(s.y + d.y) / 2} ${s.x},
                ${(s.y + d.y) / 2} ${d.x},
                ${d.y} ${d.x}`;

      return path;
    }
    // function click(d) {
    //   if (d.children) {
    //     d._children = d.children;
    //     d.children = null;
    //   } else {
    //     d.children = d._children;
    //     d._children = null;
    //   }
    //   update(d);
    // }


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
