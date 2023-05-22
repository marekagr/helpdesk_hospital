import { Component, OnInit,AfterViewInit } from '@angular/core';

@Component({
  selector: 'app-demo',
  templateUrl: './demo.component.html',
  styleUrls: ['./demo.component.css']
})
export class DemoComponent implements AfterViewInit  {
  public data: number[] = [88,12];

  constructor() { }

  ngAfterViewInit(): void {
  }

  callEvent(dane:any){
    console.log('callEvent',dane);
    switch(dane.todo){
      case 'saveLogBook':
        console.log('saveBook')
        this.data=[this.data[0]-10,this.data[1]+10]
      break;
    }
  }
}
