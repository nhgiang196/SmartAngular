import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FileService } from './file.service';
import { Requisition, Profile, Equipments, Manual, Method } from '../models/EMCSModels';
import { OperationResult } from '../helpers/operationResult';

const ApiUrl = "api/EMCS";
const CheckerUrl = "/api/Gate/Checker";
@Injectable({
  providedIn: 'root'
})
export class ApiEMCSService {
  // CustomResult: {Header?: Requisition[], Detail?:Profile[], Equipment: Equipments, Manual: Manual, Method: Method};
  isCheck:boolean;
  constructor(private http: HttpClient,
              private fileService: FileService) { }
  /**
   * Api for Equipment
   */
  addEquipment(entity) {
    return this.http.post(`${ApiUrl}/EQ/AddEquipment`, entity);
  }
  updateEquipment(entity) {
    return this.http.put(`${ApiUrl}/EQ/UpdateEquipment`, entity);
  }
  deleteEquipment(entity) {
    return this.http.put(`${ApiUrl}/EQ/DeleteEquipment`, entity);
  }
  getAllEquipment(AssetID: string, EQName: string, Department: string, ProcessDepartment: string, UserID: string) {
    return this.http.get(`${ApiUrl}/EQ/GetEquipment?AssetID=${AssetID}&EQName=${EQName}&Department=${Department}&ProcessDepartment=${ProcessDepartment}&UserID=${UserID}`);
  }
  getBasic(table: string, lang: string) {
    return this.http.get<any>(`${ApiUrl}/EQ/GetBasic?table=${table}&lang=${lang}`);
  }
  uploadFile(data){
    return this.fileService.uploadFile(`engine-file/upload`,data);
  }
  deleteFile(fileName){
    return this.fileService.deleteFile(`engine-file`,fileName);
  }
  getFile(fileName){
    return this.fileService.getFile(`engine-file`,fileName);
  }
  getDepartment()
  {
    return this.http.get(`${ApiUrl}/EQ/GetDepartment?Table=Department&Lang=VN`);
  }
  getDetailEquipment(EQID: string) {
    return this.http.get<any>(`${ApiUrl}/EQ/GetDetailEquipment?EQID=${EQID}`);
  }

  checkAssetID(AssetID:string){
    return this.http.get<any>(`${ApiUrl}/EQ/CheckUnique?Table=Equipment&ColumnName=AssetID&Value=${AssetID}`);
  }
  /**
   * Api for PlanSchedule
   */
  getSchedulePlan(departid, type, year, lang) {  //search table
    return this.http.get(`${ApiUrl}/PlanSchedule/GetSchedulePlan?departid=${departid}&type=${type}&year=${year}&lang=${lang}`)
  }
  findSchedulePlan(eqid: string) {
    return this.http.get<any>(`${ApiUrl}/PlanSchedule/FindSchedulePlan?eqid=${eqid}`)
  }
  updateSchedulePlan(entity) {
    return this.http.post(`${ApiUrl}/PlanSchedule/UpdateSchedulePlan`, entity);
  }
  checkItem(eqid, month, year) {
    var parram = { eqid: eqid, month: month, year: year };
    return this.http.put(`${ApiUrl}/PlanSchedule/CheckItemDetail`, parram);
  }

  /**
   * Api for Voucher
   */

  getVouchers(departid, type, year, status) {  //search table
    return this.http.get(`${ApiUrl}/Voucher/GetVoucher?departid=${departid}&type=${type}&year=${year}&status=${status}`);
  }
  findVoucher(voucherid: string) {
    return this.http.get<any>(`${ApiUrl}/Voucher/FindVoucher?VoucherID=${voucherid}`)

  }
  addVoucher(entity) {
    return this.http.post(`${ApiUrl}/Voucher/AddVoucher`, entity);
  }
  updateVoucher(entity) {
    return this.http.post(`${ApiUrl}/Voucher/UpdateVoucher`,entity);
  }
  deleteVoucher(voucherid) {
    return this.http.delete(`${ApiUrl}/Voucher/DeleteVoucher?voucherid=${voucherid}`);
  }

  public GetChecker = (owner: string, FLowKey:string, Kinds: string, CheckDate:Date) =>
  {
    return this.http.get<any>(`${CheckerUrl}/GetCheckersByLevel?owner=${owner}&FLowKey=${FLowKey}&Kinds=${Kinds}&CheckDate=${CheckDate}`);
  }

  updateVoucherState(voucherid :string ,state: string) {
    var parram = { VoucherID: voucherid, State: state};
    return this.http.get<OperationResult>(`${ApiUrl}/Voucher/UpdateVoucherState?VoucherID=${voucherid}&State=${state}`);

  }


}
