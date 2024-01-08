import { Injectable } from '@angular/core';
import { BehaviorSubject } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class HeaderService {
  private currentHeader$ = new BehaviorSubject<any>({});

  constructor() { }

  setcurrentHeader$(data:{}){
    this.currentHeader$.next(data);
  }

  getcurrentHeaderValue() {
    return this.currentHeader$.getValue()
  }

  getcurrentHeader$() {
    return this.currentHeader$.asObservable();
  }

}
