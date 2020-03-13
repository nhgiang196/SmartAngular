import { Injectable } from '@angular/core';
import { ChartModel } from '../models/SmartInModels';
import * as signalR from "@aspnet/signalr";
import { HttpClient } from '@angular/common/http';
const ApiUrl = "signalR/api/v1";
@Injectable({
  providedIn: 'root'
})
export class SignalRService {
  public data: ChartModel[];
  public FactoryData:any [] =[];
  public myData: number[] =[];
  public myLabel:string[]=[]
  public bradcastedData: ChartModel[];
  private hubConnection: signalR.HubConnection
  private monitorHubConnection: signalR.HubConnection
  constructor(private http: HttpClient) { }

  public startConnection = () => {
    Object.defineProperty(WebSocket, 'OPEN', { value: 1, });
    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl('http://localhost:7777/chart')
      .build();   
    this.hubConnection.onclose(() =>{
      console.log('Reconnection after 500')
      this.start();
    });
    this.start();
  }
  public startMonitorConnection = () => {
    Object.defineProperty(WebSocket, 'OPEN', { value: 1, });
    this.monitorHubConnection = new signalR.HubConnectionBuilder()
      .withUrl('http://localhost:7777/monitor')
      .build(); 
    this.monitorHubConnection
      .start()
      .then(() => console.log('Connection started'))
      .catch(err =>{       
          console.log('Error while starting connection: ' + err)       
        })  
  }
  start(){
    this.hubConnection
    .start()
    .then(() => console.log('Connection started'))
    .catch(err => 
      {
        setTimeout(()=>{
          this.start();
        },5000);
        console.log('Error while starting connection: ' + err)       
      })
  }

  public addTransferChartDataListener = () => {
    this.hubConnection.on('transferchartdata', (data) => {
     this.data = data;
     //let item = data[5].data[0];
      this.myData.push(data.cod);
      this.myLabel.push(data.monitorDate);   
     
      if(this.myData.length >150)
      {
        
        this.myLabel.shift();
        this.myData.shift();
      }
    });   
  }
  public addTransferFactoryDataListener =()=>
  {
    this.hubConnection.on('transferFactoryData', (data) => {
      this.FactoryData.push(data);
      if(this.FactoryData.length >4)
        this.FactoryData.shift();
      console.log(this.FactoryData);
     });
  }

  public broadcastChartData = () => {
    this.hubConnection.invoke('broadcastchartdata', this.data)
    .catch(err => console.error(err));
  }

  public addBroadcastChartDataListener = () => {
    this.hubConnection.on('broadcastchartdata', (data) => {
      this.bradcastedData = data;
    })
  }
  
  public getMonitorChart =() => this.http.get(`${ApiUrl}/Monitor/GetRealTimeChart`);
  public getLatestMonitorChart =() => this.http.get(`${ApiUrl}/Monitor/Chart`);
  public getChartByDate =(start,end) => this.http.get(`${ApiUrl}/Monitor/GetChartByDate?start=${start}&end=${end}`);
  public getTableFactory =() => this.http.get(`${ApiUrl}/Monitor/GetTableFactory`);
}