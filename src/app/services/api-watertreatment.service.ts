import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import {  DataTablesResponse, DataTablePaginationParams, MonitorStandard } from '../models/SmartInModels';

const ApiUrl = "api/v1";


@Injectable({ providedIn: 'root' })
export class WaterTreatmentService {
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
    let pr = new DataTablePaginationParams();
    pr.selectFields = "FactoryID, FactoryName, Status "
    pr.pageSize = 9999;
    return this.http.post(`${ApiUrl}/Factory/GetFactoryPagination`, pr);
  }

  getFactoryPagination(keyvalue) {
    let pr = new DataTablePaginationParams();
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
  getWarehousePagination =(keyvalue) => { // Note: BA yêu cầu gửi Parram như thế này
    let pr = new DataTablePaginationParams();
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
  getUnitPagination =(keySearch) =>{
    let model : DataTablePaginationParams = {
      key: keySearch,
      entity: "Unit",
      keyFields: "",
      selectFields: "UnitName,UnitId",
      page: 1,
      pageSize: 9999,
      orderDir: "asc",
      orderBy: "UnitName"
    };
   return this.http.post<any>(`${ApiUrl}/Unit/GetUnitPagination`,model,{} )
  }
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
   getStagePagination =(keySearch) => {
    let model = new DataTablePaginationParams();
    model= {
      key: keySearch,
      entity: "Stage",
      keyFields: "",
      selectFields: "StageId,StageCode,StageName",
      page: 1,
      pageSize: 9999,
      orderDir: "asc",
      orderBy: "StageName"
    };
    return this.http.post<any>(`${ApiUrl}/Stage/GetStagePagination`,model,{} )
   }
   getStage =() => this.http.get(`${ApiUrl}/Stage/GetStage` );
   findStageById =(id) => this.http.get<any>(`${ApiUrl}/Stage/FindStageById?id=${id}` );
   validateStage =(entity) =>this.http.post(`${ApiUrl}/Stage/ValidateStage`,entity);

   //bomFactory
   addBomFactory =(entity) => this.http.post(`${ApiUrl}/BomFactory/AddBomFactory`,entity);
   updateBomFactory =(entity) => this.http.put(`${ApiUrl}/BomFactory/UpdateBomFactory`,entity);
   getDataTableBomFactoryPagination =(entity) => this.http.post<DataTablesResponse>(`${ApiUrl}/BomFactory/DataTableBomFactoryPagination`,entity);
   deleteBomFactory =(id) => this.http.delete(`${ApiUrl}/BomFactory/DeleteBomFactory`,{ params: { id: id } });
   getBomFactoryPagination =(entity) => this.http.post<any>(`${ApiUrl}/BomFactory/GetBomFactoryPagination`,entity,{} );
   getBomFactory =() => this.http.get(`${ApiUrl}/BomFactory/GetBomFactory` );
   findBomFactoryById =(id) => this.http.get<any>(`${ApiUrl}/BomFactory/FindBomFactoryById?id=${id}` );
   validateBomFactory =(entity) =>this.http.post(`${ApiUrl}/BomFactory/ValidateBomFactory`,entity);


  //Item Services
  addItem =(entity) => this.http.post(`${ApiUrl}/Item/AddItem`,entity);
  updateItem =(entity) => this.http.put(`${ApiUrl}/Item/UpdateItem`,entity);
  deleteItem =(id) => this.http.delete(`${ApiUrl}/Item/DeleteItem`,{ params: { id: id } });
  getItemPagination =(keySearch) =>{
    const model: DataTablePaginationParams = {
      key: keySearch,
      entity: "Item",
      keyFields: "ItemName",
      selectFields: "ItemId,ItemNo  +' '+ ItemName as ItemName",
      page: 1,
      pageSize: 9999,
      orderDir: "asc",
      orderBy: "ItemName"
    };

    return this.http.post<any>(`${ApiUrl}/Item/GetItemPagination`,model );
  }
  getItemPagination_Grid=()=>{
    let pr = new DataTablePaginationParams();
    pr.pageSize=50;
    pr.page= 1;
    pr.selectFields = ` q.*, ItemTypeName, [FirstImagePath] = ISNULL((SELECT TOP 1 f.[Path] FROM ItemFile i JOIN [File] f ON f.FileID = i.FileID WHERE i.ItemID= q.ItemID AND I.IsImage=1),'assets/img/empty.jpg')`;
    pr.entity = ` Item q LEFT join ItemType t ON t.ItemTypeID=q.ItemTypeID `;
    pr.specialCondition = ` EXISTS( SELECT * FROM ItemFile jk WHERE jk.IsImage=1 AND jk.ItemID= q.ItemID) `;
    return this.http.post<any>(`${ApiUrl}/Item/GetItemPagination`,pr );
  }
  getSelect2ItemPagination =(params) =>{
    return this.http.get<any>(`${ApiUrl}/Item/GetSelect2ItemPagination`,{ params: params } );
  }
  getItemSelect2Pagination(entity){
    return this.http.post<any>(`${ApiUrl}/Item/GetItemPagination`,entity);
  }
  getDataTableItemPagination =(entity) => this.http.post<DataTablesResponse>(`${ApiUrl}/Item/DataTableItemPagination`,entity);
  getItem =() => this.http.get(`${ApiUrl}/Item/GetItem` );
  getItemByItemType =(entity,itemTypeId) => this.http.post<DataTablesResponse>(`${ApiUrl}/Item/GetItemByItemType/${itemTypeId}`,entity)//{ params: { itemTypeId: itemTypeId } } );
  // getItemByItemType =(itemTypeId) => this.http.get(`${ApiUrl}/Item/GetItemByItemType/`,{ params: { itemTypeId: itemTypeId } } );
  findItemById =(id) => this.http.get<any>(`${ApiUrl}/Item/FindItemById?id=${id}` );
  checkItemNameExist =(itemName) => this.http.get<any>(`${ApiUrl}/Item/CheckItemNameExist?ItemName=${itemName}` );


  /**Customer */
  addCustomer =(entity) => this.http.post(`${ApiUrl}/Customer/AddCustomer`,entity);
  updateCustomer =(entity) => this.http.put(`${ApiUrl}/Customer/UpdateCustomer`,entity);
  deleteCustomer =(id) => this.http.delete(`${ApiUrl}/Customer/DeleteCustomer`,{ params: { id: id } });
  getCustomerPagination =(entity) => this.http.post<any>(`${ApiUrl}/IteCustomerm/GetCustomerPagination`,entity,{} );
  getDataTableCustomerPagination =(entity) => { // Note: BA yêu cầu gửi Parram như thế này
    entity.KeyFields = `c.CustomerID, c.CustomerName, c.FactoryID	,c.CustomerAddress, c.ContactName, c.ContactEmail, c.ContactPhone, c.Description, c.CreateBy	, c.CreateDate, c.ModifyBy	, c.ModifyDate, c.Status	, c.IsIntergration`;
    entity.SelectFields = ` c.*, FactoryName , [CustomerStatus] = dbo.GetDefine('CustomerStatus',c.Status) `;
    entity.Entity = `  Customer c LEFT JOIN Factory f ON f.FactoryID = c.FactoryID`;
    entity.SpecialCondition = `1=1`;
    return this.http.post<DataTablesResponse>(`${ApiUrl}/Customer/DataTableCustomerPagination`,entity);}
  getCustomer =() => this.http.get(`${ApiUrl}/Customer/GetCustomer` );
  findCustomerById =(id) => this.http.get<any>(`${ApiUrl}/Customer/FindCustomerById?id=${id}` );
  validateCustomer =(entity) =>{ return this.http.post(`${ApiUrl}/Customer/ValidateCustomer`,entity);}

  /**Contract */
  getContract =() => this.http.get(`${ApiUrl}/Contract/GetContract` );
  getContractByCustomer =(keyValue) =>  {
    let e = new DataTablePaginationParams();
    e.selectFields= ` * , [ContractTypeName] = dbo.GetDefine('ContractType',ContractType) `
    e.specialCondition = `CustomerID= ${keyValue}`;
    console.log('parrams send',e);
    return this.http.post<any>(`${ApiUrl}/Contract/GetContractPagination` ,e);
  }
  getContractPagination =(entity) => this.http.post<any>(`${ApiUrl}/Contract/GetContractPagination`,entity,{} );
  getDataTableContractPagination =(entity) => this.http.post<DataTablesResponse>(`${ApiUrl}/Item/DataTableContractPagination`,entity);
  findContractById =(id) => this.http.get<any>(`${ApiUrl}/Contract/FindContractById?id=${id}` );
  addContract =(entity) => this.http.post(`${ApiUrl}/Contract/AddContract`,entity);
  updateContract =(entity) => this.http.put(`${ApiUrl}/Contract/UpdateContract`,entity);
  deleteContract =(id) => this.http.delete(`${ApiUrl}/Contract/DeleteContract?id=${id}`);
  validateContract =(entity) => this.http.post(`${ApiUrl}/Contract/ValidateContract?`,entity);


  //Moninor
  getAllMonitorStandard= () => this.http.get<MonitorStandard[]>(`${ApiUrl}/MonitorStandard/GetMonitorStandard`);

   //Monitor Services
   addMonitor =(entity) => this.http.post(`${ApiUrl}/Monitor/AddMonitor`,entity);
   getMonitorChart =() => this.http.get(`${ApiUrl}/Monitor/GetChart`);
   updateMonitor =(entity) => this.http.put(`${ApiUrl}/Monitor/UpdateMonitor`,entity);
   getDataTableMonitorPagination =(entity) => this.http.post<DataTablesResponse>(`${ApiUrl}/Monitor/DataTableMonitorPagination`,entity);
   deleteMonitor =(id) => this.http.delete(`${ApiUrl}/Monitor/DeleteMonitor`,{ params: { id: id } });
   getMonitorPagination =(keySearch) => {
    let model = new DataTablePaginationParams();
    model= {
      key: keySearch,
      entity: "Monitor",
      keyFields: "",
      selectFields: "MonitorId,MonitorCode,MonitorName",
      page: 1,
      pageSize: 9999,
      orderDir: "asc",
      orderBy: "MonitorName"
    };
    return this.http.post<any>(`${ApiUrl}/Monitor/GetMonitorPagination`,model,{} )
   }
   getMonitor =() => this.http.get(`${ApiUrl}/Monitor/GetMonitor` );
   findMonitorById =(id) => this.http.get<any>(`${ApiUrl}/Monitor/FindMonitorById?id=${id}` );
   validateMonitor =(entity) =>this.http.post(`${ApiUrl}/Monitor/ValidateStage`,entity);

}
