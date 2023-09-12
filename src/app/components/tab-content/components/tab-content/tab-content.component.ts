import { Component, OnInit ,ComponentFactoryResolver,  ViewChild,Input } from '@angular/core';
import { ContentContainerDirective } from "../../directives/content-container.directive";
import { SkeletonComponent } from "../../interfaces/skeleton.component";
import { Tab } from "../../classes/tab.model";

@Component({
  selector: 'app-tab-content',
  template: "<ng-template content-container></ng-template>",
  styleUrls: ['./tab-content.component.scss']
})
export class TabContentComponent implements OnInit {
  @Input() tab:any;
@ViewChild(ContentContainerDirective, { static: true })contentContainer!: ContentContainerDirective;



  constructor(private componentFactoryResolver: ComponentFactoryResolver) {}
  ngOnInit() {
  const tab: Tab = this.tab;
  const componentFactory = this.componentFactoryResolver.resolveComponentFactory(tab.component);
  const viewContainerRef = this.contentContainer.viewContainerRef;
  const componentRef = viewContainerRef.createComponent(componentFactory);
  (componentRef.instance as SkeletonComponent).data = tab.tabData;
  }}
