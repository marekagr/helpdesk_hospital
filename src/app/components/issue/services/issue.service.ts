import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders } from "@angular/common/http";
import { Subject,BehaviorSubject,Observable } from "rxjs";

import { GlobalVariable } from '../../../../global';
import {IssueTree} from "../../../components/issue-tree/models/issueTree"
import {Issue} from "../models/Issue"
const httpOptionsText={headers:new HttpHeaders({'Content-Type':  'text/plain'})};
const httpOptionsform = {headers: new HttpHeaders({   'Content-Type': 'application/x-www-form-urlencoded'})}


@Injectable({
  providedIn: 'root'
})
export class IssueService {
  private issueList$ = new BehaviorSubject<any[]>([]);
  private currentIssue$ = new BehaviorSubject<null|IssueTree|any>(null);
  globalUrl=GlobalVariable.BASE_API_URL;

  constructor(private http:HttpClient) { }


    /**
   * http get all issues
  *
   */
    getIssueList() {
      let url=`${this.globalUrl}/kwestia`;
      return this.http.get<any[]>(url)
      .subscribe((data) => {
        console.log('getissueList',data)
      this.issueList$.next([...data]);
      });
    }
    // getHTTPregisterItems():Observable<any> {
    //   let url=`${this.globalUrl}/rejestr`;
    //   return this.http.get<any[]>(url);
    // }

    setIssueList$(data:any[]){
      this.issueList$.next([...data]);
    }

    getIssueList$() {
      return this.issueList$.asObservable();
    }

    getIssueListValue() {
      return this.issueList$.getValue()
    }

    getIssue(id:string) {
      // this.http.get<Deal>(`${this.globalUrl}/pojazd/${id}`)
      //   .subscribe((data) => {
      //     //this.car = data;
      //     console.log('getCar');
      //     this.currentDeal$.next(data);
      //   });
    }

    getIssueById(id:string):Observable<any>{
      const url = `${this.globalUrl}/kwestia/${id}`;
      return this.http.get<IssueTree>(url)

    }


  setcurrentIssue$(data:any){
    this.currentIssue$.next(data);
  }

  getcurrentIssue$() {
    return this.currentIssue$.asObservable();
  }

  getcurrentIssueValue() {
    return this.currentIssue$.getValue()
  }

  saveIssueMetaData(issue:any):Observable<any> {
    const url = `${this.globalUrl}/kwestia`;
    const issueData = {name:issue.name,description:issue.description};
    return this.http.post(url, issueData,httpOptionsText);
  }

  updateIssueMetaData(id:string,issue:any):Observable<Issue>{
    console.log('updateIssue',issue)
    const issueData = {name:issue.name,description:issue.description};
    return this.http.put<IssueTree>(`${this.globalUrl}/kwestia/${id}`,issueData,httpOptionsText);
  }

}

