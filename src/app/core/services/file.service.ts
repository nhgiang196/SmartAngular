import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
const ApiUrl = environment.apiUrl;;
@Injectable({
  providedIn: 'root'
})
export class FileService {

constructor(private http: HttpClient) { }

/**FILES */
uploadFile(formData, pathFile) {
  return this.http.post(`${ApiUrl}/File/UploadFiles/${pathFile}`, formData, {reportProgress: true, observe: 'events'});
}
deleteFile(fileName) {
  return this.http.delete(`${ApiUrl}/File/DeleteFiles`, { params: { fileName: fileName } });
}
downloadFile(fileName) {
  let url: string = '/api/v1/File/DownloadFile?fileName='+fileName;
  window.open(url);
}
openFile(fileName){
  window.open(`http://localhost:3333/${fileName}`);
}

}
