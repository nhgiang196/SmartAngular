import { Injectable } from '@angular/core';
import * as signalR from "@aspnet/signalr";
import { HttpClient } from '@angular/common/http';
const ApiUrl = "signalR/api/v1";
@Injectable({
  providedIn: 'root'
})
export class SignalRService {
  public FactoryData: any[] = [];
  public myData: number[] = [];
  public codData : number[] = [];
  public pHData : number[] = [];
  public TSSData : number[] = [];
  public colorData : number[] = [];
  public amoniData : number[] = [];
  public qData : number[] = [];
  public dataMonitorDate: string[]=[];
  public temperatureData : number[] = [];
  private hubConnection: signalR.HubConnection
  private monitorHubConnection: signalR.HubConnection
  constructor(private http: HttpClient) { }

  public startConnection = () => {
    Object.defineProperty(WebSocket, 'OPEN', { value: 1, });
    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl('http://localhost:7777/chart')
      .build();
    this.hubConnection.onclose(() => {
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
      .catch(err => {
        console.log('Error while starting connection: ' + err)
      })
  }
  start() {
    this.hubConnection
      .start()
      .then(() => console.log('Connection started'))
      .catch(err => {
        setTimeout(() => {
          this.start();
        }, 5000);
        console.log('Error while starting connection: ' + err)
      })
  }

  public addTransferChartDataListener = () => {
    var currentData: any = {};
    let result : any;
    this.hubConnection.on('transferchartdata', (data) => {
      console.log(data)
      result = data[0];
      if (result!=null &&JSON.stringify(currentData) != JSON.stringify(data)) {
        currentData = data;
        this.temperatureData.push(result.temperature)
        this.codData.push(result.cod)
        this.pHData.push(result.ph)
        this.TSSData.push(result.tss)
        this.amoniData.push(result.amoni)
        this.codData.push(result.cod)
        this.colorData.push(result.color)
        this.qData.push(result.q)
        this.dataMonitorDate.push(result.monitorDate);
        if (this.temperatureData.length > 150) 
        {
          this.temperatureData.shift();
          this.codData.shift();
          this.pHData.shift();
          this.TSSData.shift();
          this.amoniData.shift();
          this.codData.shift();
          this.colorData.shift();
          this.qData.shift();
          this.dataMonitorDate.shift();
        }
      }
    });
  }
 
  public addTransferFactoryDataListener = () => {
    var currentData: any = {};
    this.hubConnection.on('transferFactoryData', (data) => {
      if (JSON.stringify(currentData) != JSON.stringify(data)) {
        currentData = data;
        this.FactoryData = data;
        console.log(this.FactoryData);
      }
      // debugger
      //  if(this.FactoryData.length >4)
      //     this.FactoryData.shift();

    });

  }

  public broadcastChartData = () => {
    // this.hubConnection.invoke('broadcastchartdata', this.data)
    //   .catch(err => console.error(err));
  }

  public addBroadcastChartDataListener = () => {
    this.hubConnection.on('broadcastchartdata', (data) => {
      //this.bradcastedData = data;
    })
  }

  public getMonitorChart = () => this.http.get(`${ApiUrl}/Monitor/GetRealTimeChart`);
  public getLatestMonitorChart = () => this.http.get(`${ApiUrl}/Monitor/Chart`);
  public getChartByDate = (start, end) => this.http.get(`${ApiUrl}/Monitor/GetChartByDate?start=${start}&end=${end}`);
  public getChartByFactory = (factoryId, start, end) => this.http.get(`${ApiUrl}/Monitor/Chart?factoryId=${factoryId}&start=${start}&end=${end}`);
  public getTableFactory = () => this.http.get(`${ApiUrl}/Monitor/GetTableFactory`);
}