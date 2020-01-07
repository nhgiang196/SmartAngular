import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

import { User } from '../models/user';
import { WorkFlow, Task, ProcessDefinition } from '../models/camunda';
import { FileService } from './file.service';
import { Observable } from 'rxjs';

const apiUrl = "bpmn/engine-rest";
@Injectable({
  providedIn: 'root'
})
export class EngineService {

  workFlows: WorkFlow[];
  entity: WorkFlow;
  taskItems: Task[];
  data: any[];
  currentTask: any;
  user: User;
  myTaskCount:number;
  myTaksList: ProcessDefinition[];
  processInstance: ProcessDefinition;
  processDefinitions: ProcessDefinition[];
  decisionList:any[];
  lsCheckers:any[];
  hiddenApprove: boolean= true;
  saveDraft:boolean = true;
  myParams = new HttpParams()
  .set('sortBy', 'created')
  .set('sortOrder', 'desc');
  constructor(private httpClient: HttpClient, private fileUpload:FileService) {    
    // set currentTask
    this.currentTask={
      id:null,
      businessKey:null
    }
  }

  /**
   * Deploye new BPMN Diagram XML
   */
  public deploymentWorkFlow(formData) {
     return this.fileUpload.uploadFile(`${apiUrl}/deployment/create`,formData);   
  }
 

  //Redeployment WorkFlow by Id
  public redeploymentWorkFlow = (id: string) => { return this.httpClient.post(`${apiUrl}/deployment/${id}/redeploy`, {}); }

  //Get all WorkFlow in System
  public getWorkFlow() {
    return this.httpClient.get(`${apiUrl}/deployment`).toPromise()
      .then((res) => {
        this.workFlows = res as WorkFlow[];
      });
  }
  // GET ProcessDefinitionID by KEY
  public getDiagramByProDefId(proDefKey:string){
    return this.httpClient.get<any>(`${apiUrl}/process-definition/${proDefKey}/xml`)
  }
  
  //Get resources WorkFlow
  public getResources(id: string){ return this.httpClient.get(`${apiUrl}/deployment/${id}/resources`); }

  //Delete WorkFlow
  public deleteWorkFlow = (id: string) => { return this.httpClient.delete(`${apiUrl}/deployment/${id}?cascade=true`); }


  /**
   * All processDefinition Api Camunda
   */
  //Get all Process Definition print into list
  public processDefinitionList = () => {
    return this.httpClient.get<ProcessDefinition[]>(`${apiUrl}/process-definition`);
  }

  public taskInProcessCount(procId) {
    this.user = <User>JSON.parse(localStorage.getItem('currentUser'));
    return this.httpClient.get<any>(`${apiUrl}/task/count?processDefinitionId=${procId}&candidateUser=${this.user.Username}`)
  }

  //list All Task in Process Definition
  public allTaskInProcess() {
    this.processDefinitions = [];
    this.processDefinitionList()
      .toPromise()
      .then((data) => {
        data.forEach(i => {
          this.taskInProcessCount(i.id).subscribe((res) => {
            i.count = res.count as number;
            this.processDefinitions.push(i);
            this.processDefinitions = this.processDefinitions.filter(x => x.count > 0);
          })
        })

      })
  }
  /**
   * 
   * @param key ProcessDefinition key like BankId
   * @param formData input data to Start Form like set group user list User=[{'issac','cassie'}]
   */
  public processDefinitionStart(key: String, formData: any) {
    return this.httpClient.post<any>(`${apiUrl}/process-definition/key/${key}/start`, formData);
  }

  /**
   * All Task Api Camunda
   */

  //Get All Task
  public taskList() {
    return this.httpClient.get(`${apiUrl}/task`).toPromise()
      .then((res) => {
        this.taskItems = res as Task[];
      })
  }
  //Get All Task
  public getTaskById = (id) => {
    return this.httpClient.get<Task[]>(`${apiUrl}/task?processDefinitionId=${id}`)
      .toPromise()
      .then((res) => {
        this.taskItems = res as Task[];
      })
  }

   //Get processIntance
   public getProcessIntance = (id) => {
    return this.httpClient.get<any>(`${apiUrl}/process-instance?processInstanceIds=${id}`)//For get processInstanceId after that get bussinessKey
  }

  //Get TaskCount
  public taskCount() { return this.httpClient.get<any>(`${apiUrl}/task/count?candidateUser=${this.user.Username}`); }

  //Get TaskCount
  public myTask() {
    let params = new HttpParams()
      .set('candidateUser',this.user.Username) //or assignee
      // .set('processDefinitionKey',null)
      //.set('owner',null)
      // .set('assignee',this.user.Username)
      .set('sortBy', 'created')
      .set('sortOrder', 'desc');
    return this.httpClient.get<Task[]>(`${apiUrl}/task`, { params: params });
  }


  //Get by Task ID
  public getByTaskId(id: string) { return this.httpClient.get<Task[]>(`${apiUrl}/task/${id}`); }



  //Get task FormKey
  public getFormKey = (id: string) => { return this.httpClient.get(`${apiUrl}/${id}/form`); }

  /**
   * //Get task FormKey
   * with Params as conditionType for Decisions
   */
  public completeTask = (id: string, params: any) => { return this.httpClient.post<any>(`${apiUrl}/task/${id}/complete`, params); }

  /**
   * 
   * @param type when true load litmited, false load all tasks
   */
  public loadAllTask(type:boolean){
    this.taskItems = []
    this.user = <User>JSON.parse(localStorage.getItem('currentUser'));
    this.taskCount().subscribe((res)=>{
      this.myTaskCount = res.count;
    })
    this.myTask().subscribe((data)=>{
      var ls:Task[] = (type)? data.slice(0,4) :data;           
        ls.forEach(el=>{
          this.getProcessIntance(el.processInstanceId).subscribe(res=>{
            el.businessKey = res[0].businessKey
            this.taskItems.push(el)
          })         
        })      
    });
  }
}
