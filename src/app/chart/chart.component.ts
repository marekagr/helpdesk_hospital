import { AfterViewInit, Component, ElementRef, HostListener, Input, ViewChild,Renderer2,Output,EventEmitter  } from '@angular/core';
import * as d3 from 'd3'

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.css']
})
export class ChartComponent implements AfterViewInit  {
  @HostListener('window:resize', ['$event'])
  onResize() {
      this.resize();
  }

  @Output() callEvent:EventEmitter<any> = new EventEmitter();
  @Input() colors: string[] = [];
  private _data:number[]=[];
  private callBuildChart:boolean=false;
  @Input()
  set data(val:number[]){
    console.log('set data',val)
    this._data=val;
    if(this._data && this.callBuildChart)
      this.buildChart();
  };
  get data(){
    console.log('get data',this._data)
    return this._data;
  }
  @Input() height: number|any;
  @Input() label: string='';
  @Input() labelColor: string = 'rgba(80,80,80,.8)';
  @Input() title: string='';
  @Input() width: number|any;

  @ViewChild('container') container!: ElementRef<HTMLDivElement>;
  @ViewChild('chart') chart!: ElementRef<SVGElement>;
  @ViewChild('titleContainer' ,{ static: false }) titleContainer!: ElementRef<HTMLDivElement>;
  public svg: any;
  private tekst:any=''
  private path:any;

  constructor(private renderer: Renderer2) { }

  ngAfterViewInit(): void {
    this.callBuildChart=true;
    this.resize();
    this.buildChart();
  }

  private buildChart(): void {
    if (this.title) {
      this.titleContainer.nativeElement.innerHTML = this.title;
    }

    if(!this.svg)
      this.svg = d3.select(this.chart.nativeElement)
      .append('g')
      .attr('overflow', 'visible')
      .attr('transform', `translate(${this.width / 2},${this.height / 2})`);

    const color = d3.scaleOrdinal(this.data, this.colors);

    const arc = d3.arc()
      .innerRadius(Math.min(this.width, this.height) / 3)
      .outerRadius(Math.min(this.width, this.height) / 2)
      .cornerRadius(0);

    const pie = d3.pie()
      .value((d:any) => d);
    if(this.path)this.path.remove()
    this.path = this.svg.selectAll('path')
      .data(pie(this.data))
      .enter()
      .append('path')
      .attr('d', <any>arc)
      .attr('fill', (d:any) => color(d))
      .attr('stroke', 'none')
      .on("click", (e:any)=>{
        console.log('click')
        this.callEvent.emit({todo:'saveLogBook'});
      });



    if (this.label) {
      if(this.tekst)this.tekst.remove()
      this.tekst=this.svg.append('text')
        .attr('alignment-baseline', 'middle')
        .attr('class', 'chart-label')
        .attr('fill', this.labelColor)
        .attr('text-anchor', 'middle')
        .attr('x', 0)
        .attr('y', 0)
        .text(`${this.data[0]}%`);
        //this.svg.
    }
  }

  private resize(): void {
    this.height = (this.height && !isNaN(this.height) && this.height > 0) ? this.height : this.container.nativeElement?.parentElement?.parentElement?.offsetHeight;
    this.width = (this.width && !isNaN(this.width) && this.width > 0) ? this.width : this.container.nativeElement?.parentElement?.parentElement?.offsetWidth;

    this.chart.nativeElement.style.height = `${this.height}px`;
    this.container.nativeElement.style.height = `${this.height}px`;
    this.chart.nativeElement.style.width = `${this.width}px`;
    this.container.nativeElement.style.width = `${this.width}px`;
  }

}
