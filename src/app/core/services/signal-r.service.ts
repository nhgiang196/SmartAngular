import { Injectable } from '@angular/core';
import * as signalR from "@aspnet/signalr";
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
const SIGNAL_R_URL = environment.signalR;
@Injectable({
  providedIn: 'root'
})
export class SignalRService {
  private hubConnection: signalR.HubConnection
  private monitorHubConnection: signalR.HubConnection
  public FactoryData: any[] = [];
  constructor(private http: HttpClient) { }
  public startConnection = () => {
    Object.defineProperty(WebSocket, 'OPEN', { value: 1, });
    this.hubConnection = new signalR.HubConnectionBuilder()
      .configureLogging(signalR.LogLevel.Debug)
      // .withUrl(`${SIGNAL_R_URL}/chart`,{
      //   skipNegotiation: true,
      //   transport: signalR.HttpTransportType.WebSockets
      // }) //${SIGNAL_R_URL}/chart , http://localhost:7777/chart
      .withUrl(`${SIGNAL_R_URL}/chart`)
      .build();
    this.hubConnection.onclose(() => {
      console.log('Reconnection after 500')
      this.start();
    });
    this.start();
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
  public getTableFactory = () => this.http.get(`${SIGNAL_R_URL}/api/v1/Monitor/GetTableFactory`);
}
