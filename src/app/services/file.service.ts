import { Injectable } from '@angular/core';
import { HttpClient, HttpEventType, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class FileService {
  constructor(private httpClient : HttpClient) { }
 
  uploadFile(apiUrl:string,formData) {
    return this.httpClient.post<any>(apiUrl, formData, {
      reportProgress: true,
      observe: 'events'
    }).pipe(
      map(event => this.getEventMessage(event))
    );
  }
  getFile(apiUrl:string,fileName) {
    return this.httpClient.get(`${apiUrl}/${fileName}`);
  }

  deleteFile(apiUrl:string,FileName) {
    return this.httpClient.delete(`${apiUrl}/${FileName}`);
  }

  private getEventMessage(event: HttpEvent<any>) {

    switch (event.type) {

      case HttpEventType.UploadProgress:
        return this.fileUploadProgress(event);

      case HttpEventType.Response:
        return this.apiResponse(event);

      default:
        return `This file is surprising upload event: ${event.type}.`;
    }
  }

  private fileUploadProgress(event) {
    const percentDone = Math.round(100 * event.loaded / event.total);
    return { status: 'progress', message: percentDone };
  }

  private apiResponse(event) {
    return event;
  }
}
