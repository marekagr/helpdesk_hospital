import { Injectable,ElementRef } from '@angular/core';
import {margin} from '../models/margin'
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

@Injectable({
  providedIn: 'root'
})
export class IssueTreeService {

  constructor() { }

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

    root.children.forEach((d:any)=>{
      this.collapse(d)
    })

    return root

  }



public update(source:any,svg: Selection<any, any, any, any>,treemap:any,root:any,rectWidth:number,rectHight:number,offsetYLink:number,duration:number,params:any) {
  var treeData = treemap(root);


  var nodes = treeData.descendants(),
  links = treeData.descendants().slice(1);


nodes.forEach((d:any)=> {
  d.y = d.depth * 180;
});
let licz=0
var node: Selection<any, any, any, any> = svg.selectAll("g.node").data(nodes, (d:any)=> {
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
    this.click(d,svg,treemap,root,rectWidth,rectHight,offsetYLink,duration,params)

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
    return d.parent ? rectWidth : rectWidth;
  })
  .attr("height", rectHight);
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

//treeData.children[0].children?.push({ name: "A6",level: "blue",  value: 6})
// this.root = hierarchy(this.treeData, function(d:any) {
//   return d.children;
// });
this.update(event.target.__data__,svg,treemap,root,rectWidth,rectHight,offsetYLink,duration,params)

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
.duration(duration)
.attr("transform", (d:any)=> {
  return "translate(" + d.y + "," + d.x + ")";
});
var nodeExit = node
.exit()
.transition()
.duration(duration)
.attr("transform", (d:any)=> {
  return "translate(" + source.y + "," + source.x + ")";
})
.remove();
nodeExit.select("rect").style("opacity", 1e-6);
nodeExit.select("rect").attr("stroke-opacity", 1e-6);
nodeExit.select("text").style("fill-opacity", 1e-6);


//------------------------ end node update --------------------


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
  var o = { x: source.x0+offsetYLink, y: source.y0 };
  // return this.diagonal(o, {x:d.parent.x+this.offsetYLink,y:d.parent.y+this.rectWidth});
  return this.diagonal(o, {x:source.x0+offsetYLink,y:source.y0+rectWidth});

});

var linkUpdate = linkEnter.merge(link);
linkUpdate
  .transition()
  .duration(duration)
  .attr("d", (d:any)=> {
    var o = { x: d.x+offsetYLink, y: d.y };
    return this.diagonal(o, {x:d.parent.x+offsetYLink,y:d.parent.y+rectWidth});
  });
var linkExit = link
  .exit()
  .transition()
  .duration(duration)
  .attr("d", (d:any)=> {
  // var o = { x: source.x, y: source.y };
    var o = { x: source.x+offsetYLink, y: source.y };
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

private click(d:any,svg: Selection<any, any, any, any>,treemap:any,root:any,rectWidth:number,rectHight:number,offsetYLink:number,duration:number,params:any) {
  console.log('click',d.currentTarget.__data__)
  if (d.currentTarget.__data__.children) {
    d.currentTarget.__data__._children = d.currentTarget.__data__.children;
    d.currentTarget.__data__.children = null;
  } else {
    d.currentTarget.__data__.children = d.currentTarget.__data__._children;
    d.currentTarget.__data__._children = null;
  }
  this.update(d.currentTarget.__data__,svg,treemap,root,rectWidth,rectHight,offsetYLink,duration,params);
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
    return nativeElement.offsetWidth - margin.left - margin.right;
  }

  setHeight(nativeElement:HTMLElement,margin:margin,workHeight:number=900):number{
    return workHeight - margin.top - margin.bottom;
  }

  getTreeData():any{
    return {
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
              name: "A5",
              level: "yellow",
              value: 8,
              children: [
                { name: "A5_1" ,level: "blue", value: 7},
                {
                  name: "A5_2",
                  level: "purple",
                  value: 6,
                  children: [{ name: "A5_2_1",value: 5,level: "black"  }, { name: "A5_2_2",level: "blue",value: 5  }]
                }
              ]
            }
          ]
        },
        { name: "B" ,level: "blue", value: 8},
        {
          name: "C",
          level: "green",
          value: 12,
          children: [{ name: "C1",level: "blue",value: 7  }, { name: "C2" ,level: "blue",value: 7}, { name: "C3",level: "blue",value: 7  }]
        }
      ]
    };
  }

}
