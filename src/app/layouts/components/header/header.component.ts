import { Component,ViewChild, OnInit } from '@angular/core';
import {HeaderDirective} from '../header.directive'
import {TabHeaderComponent} from '../../../components/tab/components/tabHeader/tab-header.component'
import {HeaderItem} from './class/headerItem'
import {HeaderService} from './services/header.service'

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit{
  @ViewChild(HeaderDirective, {static: true}) headerDirective!: HeaderDirective;
  private currentHeaderValue:any;

  constructor(public headerService:HeaderService){}


  ngOnInit(): void {
    this.headerService.getcurrentHeader$().subscribe(item=>{
      console.log('current Header',item);
      if(Object.keys(item).length>0){
        this.currentHeaderValue=this.headerService.getcurrentHeaderValue()
        this.setHeader(item)
      }
      //this.ref.detectChanges();
    })


  }

  setHeader(cmp:HeaderItem){
    const viewContainerRef = this.headerDirective.viewContainerRef;
    viewContainerRef.clear()

    const componentRef = viewContainerRef.createComponent<any>(cmp.component);
    componentRef.instance.data=cmp.data
  }
}
