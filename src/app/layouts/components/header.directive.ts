import { Directive, ViewContainerRef } from '@angular/core';

@Directive({
  selector: '[headerDirective]'
})
export class HeaderDirective {

  constructor(public viewContainerRef: ViewContainerRef) { }

}
