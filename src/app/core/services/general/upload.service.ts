import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
const ApiUrl = environment.apiUrl;
@Injectable({ providedIn: 'root' })
export class UploadService {
    constructor(private http: HttpClient) {

    }

    getContract = () => this.http.get(`${ApiUrl}/Contract/GetContract`);
    findContractById = (id) => this.http.get<any>(`${ApiUrl}/Contract/FindContractById?id=${id}`);
    addContract = (entity) => this.http.post(`${ApiUrl}/Contract/AddContract`, entity);
    updateContract = (entity) => this.http.put(`${ApiUrl}/Contract/UpdateContract`, entity);
    deleteContract = (id) => this.http.delete(`${ApiUrl}/Contract/DeleteContract?id=${id}`);
    validateContract = (entity) => this.http.post(`${ApiUrl}/Contract/ValidateContract?`, entity);

    /**FILES */
    uploadFile(formData, pathFile) {
        return this.http.post(`${ApiUrl}/File/UploadFiles/${pathFile}`, formData, { reportProgress: true, observe: 'events' });
    }
    deleteFile(fileName) {
        return this.http.delete(`${ApiUrl}/File/DeleteFiles`, { params: { fileName: fileName } });
    }
    downloadFile(fileName) {
        let url: string = `${ApiUrl}File/DownloadFile?fileName=` + fileName;
        window.open(url);
    }
    openFile(fileName) {
        window.open(`http://localhost:3333/${fileName}`);
    }
}
