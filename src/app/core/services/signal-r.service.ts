import { Injectable } from '@angular/core';
import * as signalR from "@aspnet/signalr";
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
const SIGNAL_R_URL = environment.signalR;
const hubChart = environment.hubChart;
@Injectable({
  providedIn: 'root'
})
export class SignalRService {
  private hubConnection: signalR.HubConnection
  public FactoryData: any[] = [];
  constructor(private http: HttpClient) { }
  public startConnection = () => {
    Object.defineProperty(WebSocket, 'OPEN', { value: 1, });
    this.hubConnection = new signalR.HubConnectionBuilder()
      .configureLogging(signalR.LogLevel.Debug)
      .withUrl(hubChart) // tam
      .build();

    this.hubConnection
      .start()
      .then(() => console.log('Connection started'))
      .catch(err => console.log('Error while starting connection: ' + err))
    // this.start();
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
      if (JSON.stringify(currentData) != JSON.stringify(data)) {//kiểm tra mảng cũ so sánh với mảng mới nếu khác nhau thì add vào
        currentData = data;
        this.FactoryData = data;
      }

    });

  }
  public getTableFactory = () => this.http.get(`${SIGNAL_R_URL}/api/v1/Monitor/GetTableFactory`);
}
