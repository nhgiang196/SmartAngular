import { Injectable } from '@angular/core';
import { ChartModel } from '../models/SmartInModels';
import * as signalR from "@aspnet/signalr";
const ApiUrl = "api/v1";
@Injectable({
  providedIn: 'root'
})
export class SignalRService {
  public data: ChartModel[];
  public myData: number[] =[];
  public myLabel:string[]=[]
  public bradcastedData: ChartModel[];
  private hubConnection: signalR.HubConnection

  public startConnection = () => {
    Object.defineProperty(WebSocket, 'OPEN', { value: 1, });
    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl('http://localhost:3333/chart')
      .build();   
    this.hubConnection
      .start()
      .then(() => console.log('Connection started'))
      .catch(err => console.log('Error while starting connection: ' + err))
  }

  public addTransferChartDataListener = () => {
    this.hubConnection.on('transferchartdata', (data) => {
     this.data = data;
     let item = data[0].data[0];
      this.myData.push(item.x);
      this.myLabel.push(item.y);
    
     
      if(this.myData.length >20)
      {
        this.myData.shift();
         this.myLabel.shift();
      }
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
  last =  function(array, n) {
    if (array == null) 
      return void 0;
    if (n == null) 
       return array[array.length - 1];
    return array.slice(Math.max(array.length - n, 0));  
    };
}