import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UtilityService {

  constructor() { }

  getFieldFromObject(obj:any,fieldName:string,defaultValue:any):any{
    if(typeof obj[fieldName] !='undefined')return obj[fieldName]
    else return defaultValue;
  }
}
