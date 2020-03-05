import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { DataTablePaginationParram, DataTablesResponse } from '../models/SmartInModels';

const ApiUrl = "api/v1";


@Injectable({ providedIn: 'root' })
export class WaterTreatmentService {
  severSide={

  }
  constructor(
    private http: HttpClient, private router: Router
  ) { }

  getUser() {
    return this.http.get<any>(`${ApiUrl}/User/getUser`);
  }
  addUser(entity: any) {
    return this.http.post(`${ApiUrl}/User/AddUser`, entity);
  }
  updateUser(entity: any) {
    return this.http.put(`${ApiUrl}/User/UpdateUser`, entity);
  }

  /** FACTORY */ 
  getFactory() {
    return this.http.get<any>(`${ApiUrl}/Factory/GetFactory`);
  }
  getBasicFactory(){
    let pr = new DataTablePaginationParram(); 
    pr.selectFields = "FactoryID, FactoryName, Status "
    pr.pageSize = 9999;
    return this.http.post(`${ApiUrl}/Factory/GetFactoryPagination`, pr);
  }

  getFactoryPagination(keyvalue) {
    let pr = new DataTablePaginationParram(); 
    pr.keyFields="FactoryName,FactoryAddress,FactoryContact,ContactPhone"
    pr.key = keyvalue; 
    pr.pageSize = 9999;
    return this.http.post(`${ApiUrl}/Factory/GetFactoryPagination`, pr);
  }

  
  getAllFactoryPagination(model) {
    return this.http.post(`${ApiUrl}/Factory/GetFactoryPagination`, model);
  }

  getFactoryToSelect2 =(keyword) => this.http.get<any>(`${ApiUrl}/Factory/GetFactoryPaginationToSelect2?keyword=`+keyword );

  getFactoryById(id) {
    return this.http.get<any>(`${ApiUrl}/Factory/FindFactoryById`, { params: { id: id } });
  }

  addFactory(entity) {
    return this.http.post(`${ApiUrl}/Factory/AddFactory`, entity);
  }
  updateFactory(entity) {
    return this.http.put(`${ApiUrl}/Factory/UpdateFactory`, entity);
  }
  deleteFactory(id) {
    return this.http.delete(`${ApiUrl}/Factory/DeleteFactory`, { params: { id: id } });
  }
  validateFactory(e){
    return this.http.post(`${ApiUrl}/Factory/ValidateFactory`,e);
  }

  /** WAREHOUSE */
  getWarehousePagination =(keyvalue) => {
    let pr = new DataTablePaginationParram(); 
    pr.keyFields="WarehouseCode,WarehouseName,WarehouseAddress,WarehouseType,WarehouseUserName,Status";
    pr.selectFields = " WarehouseID, WarehouseCode, WarehouseName, f.FactoryName, WarehouseType, WarehouseAddress, WarehouseUserName, u.NormalizedUserName , w.Status ";
    pr.entity = `Warehouse w LEFT JOIN [BCM_Auth].dbo.AspNetUsers u ON u.UserName= w.WarehouseUserName
                      LEFT JOIN Factory f ON f.FactoryID = w.FactoryID`;
    pr.key = keyvalue; pr.pageSize = 9999;
    return this.http.post<any>(`${ApiUrl}/Warehouse/GetWarehousePagination`,pr);
  };
  getWarehouse =() => this.http.get(`${ApiUrl}/Warehouse/GetWarehouse` );
  findWarehouseById =(id) => this.http.get<any>(`${ApiUrl}/Warehouse/FindWarehouseById?id=${id}` );
  addWarehouse =(entity) => this.http.post(`${ApiUrl}/Warehouse/AddWarehouse`,entity);
  updateWarehouse =(entity) => this.http.put(`${ApiUrl}/Warehouse/UpdateWarehouse`,entity);
  deleteWarehouse =(id) => this.http.delete(`${ApiUrl}/Warehouse/DeleteWarehouse?id=${id}`);
  validateWarehouse =(entity) => this.http.post(`${ApiUrl}/Warehouse/ValidateWarehouse?`,entity);
  validateWarehouseLocation =(entity) => this.http.post(`${ApiUrl}/Warehouse/ValidateWarehouseLocation?`,entity);

  /** FACTORYFILE */

  AddFactoryFile(entity) {
    return this.http.post(`${ApiUrl}/PlanSchedule/AddFactoryFile`, entity);
  }
  UpdateFactory(entity) {
    return this.http.put(`${ApiUrl}/PlanSchedule/AddFactoryFDeleteFactoryFileile`, entity);//?? hàm gì đây??
  }
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
  // ItemType Services
  addItemType =(entity) => this.http.post(`${ApiUrl}/ItemType/AddItemType`,entity);
  updateItemType =(entity) => this.http.put(`${ApiUrl}/ItemType/UpdateItemType`,entity);
  deleteItemType =(id) => this.http.delete(`${ApiUrl}/ItemType/DeleteItemType`,{ params: { id: id } });
  getItemTypePagination =(entity) => this.http.post<any>(`${ApiUrl}/ItemType/GetItemTypePagination`,entity,{} );
  getItemTypeToSelect2 =(keyword,code) => this.http.get<any>(`${ApiUrl}/ItemType/GetItemTypePaginationByCodeToSelect2/${code}?keyword=`+keyword);
  getItemType =() => this.http.get(`${ApiUrl}/ItemType/GetItemType` );
  findItemTypeById =(id) => this.http.get(`${ApiUrl}/ItemType/FindItemTypeById?id=${id}` );
  getItemTypePaginationByCode =(entity,code) => this.http.post<any>(`${ApiUrl}/ItemType/GetItemTypePaginationByCode/${code}`,entity,{} );
  validateItemType=(entity) => this.http.post(`${ApiUrl}/ItemType/ValidateItemType`,entity);
  
  //ItemTypeProperty
  
  addItemTypeProperty =(entity) => this.http.post(`${ApiUrl}/ItemTypeProperty/AddItemTypeProperty`,entity);
  updateItemTypeProperty =(entity) => this.http.put(`${ApiUrl}/ItemTypeProperty/UpdateItemTypeProperty`,entity);
  getDataTableItemTypePagination =(entity) => this.http.post<DataTablesResponse>(`${ApiUrl}/ItemType/DataTableItemTypePagination`,entity);
  deleteItemTypeProperty =(id) => this.http.delete(`${ApiUrl}/ItemTypeProperty/DeleteItemTypeProperty`,{ params: { id: id } });
  getItemTypePropertyPagination =(entity) => this.http.post<any>(`${ApiUrl}/ItemTypeProperty/GetItemTypePropertyPagination`,entity,{} );  
  getItemTypeProperty =() => this.http.get(`${ApiUrl}/ItemTypeProperty/GetItemType` );
  findItemTypePropertyById =(id) => this.http.get<any>(`${ApiUrl}/ItemTypeProperty/FindItemTypePropertyById?id=${id}` );

  //Unit Services
  addUnit =(entity) => this.http.post(`${ApiUrl}/Unit/AddUnit`,entity);
  updateUnit =(entity) => this.http.put(`${ApiUrl}/Unit/UpdateUnit`,entity);
  deleteUnit =(id) => this.http.delete(`${ApiUrl}/Unit/DeleteUnit`,{ params: { id: id } });
  getUnitPagination =(entity) => this.http.post<any>(`${ApiUrl}/Unit/GetUnitPagination`,entity,{} );
  getDataTableUnitPagination =(entity) => this.http.post<DataTablesResponse>(`${ApiUrl}/Unit/DataTableUnitPagination`,entity);
  getUnitSelect2 =(keyword) => this.http.get<any>(`${ApiUrl}/Unit/GetUnitPaginationToSelect2?keyword=`+keyword );
  getUnit =() => this.http.get(`${ApiUrl}/Unit/GetUnit` );
  findUnitById =(id) => this.http.get<any>(`${ApiUrl}/Unit/FindUnitById?id=${id}` );
  validateUnit =(entity) =>{
    return this.http.post(`${ApiUrl}/Unit/ValidateUnit`,entity);
  } 

   //Stage Services
   addStage =(entity) => this.http.post(`${ApiUrl}/Stage/AddStage`,entity);
   updateStage =(entity) => this.http.put(`${ApiUrl}/Stage/UpdateStage`,entity);
   getDataTableStagePagination =(entity) => this.http.post<DataTablesResponse>(`${ApiUrl}/Stage/DataTableStagePagination`,entity);
   deleteStage =(id) => this.http.delete(`${ApiUrl}/Stage/DeleteStage`,{ params: { id: id } });
   getStagePagination =(entity) => this.http.post<any>(`${ApiUrl}/Stage/GetStagePagination`,entity,{} );
   getStage =() => this.http.get(`${ApiUrl}/Stage/GetStage` );
   findStageById =(id) => this.http.get<any>(`${ApiUrl}/Stage/FindStageById?id=${id}` );
   validateStage =(entity) =>this.http.post(`${ApiUrl}/Stage/ValidateStage`,entity);


  //Item Services
  addItem =(entity) => this.http.post(`${ApiUrl}/Item/AddItem`,entity);
  updateItem =(entity) => this.http.put(`${ApiUrl}/Item/UpdateItem`,entity);
  deleteItem =(id) => this.http.delete(`${ApiUrl}/Item/DeleteItem`,{ params: { id: id } });
  getItemPagination =(entity) => this.http.post<any>(`${ApiUrl}/Item/GetItemPagination`,entity,{} );
  getDataTableItemPagination =(entity) => this.http.post<DataTablesResponse>(`${ApiUrl}/Item/DataTableItemPagination`,entity);
  getItem =() => this.http.get(`${ApiUrl}/Item/GetItem` );
  getItemByItemType =(itemTypeId) => this.http.get(`${ApiUrl}/Item/GetItemByItemType`,{ params: { itemTypeId: itemTypeId } } );
  findItemById =(id) => this.http.get<any>(`${ApiUrl}/Item/FindItemById?id=${id}` );
  checkItemNameExist =(itemName) => this.http.get<any>(`${ApiUrl}/Item/CheckItemNameExist?ItemName=${itemName}` );
  



}