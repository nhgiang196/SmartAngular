import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpParams } from '@angular/common/http';
import { DataTablePaginationParams, DataTablesResponse } from '../models/datatable';
import { environment } from 'src/environments/environment';
import * as AspNetData from "devextreme-aspnet-data-nojquery";
import DataSource from 'devextreme/data/data_source';
const ApiUrl = environment.apiUrl;;
@Injectable({ providedIn: 'root' })
export class ItemService {
  constructor(private http: HttpClient) {

  }

  addItem = (entity) => this.http.post(`${ApiUrl}/Item/AddItem`, entity);
  updateItem = (entity) => this.http.put(`${ApiUrl}/Item/UpdateItem`, entity);
  deleteItem = (id) => this.http.delete(`${ApiUrl}/Item/DeleteItem`, { params: { id: id } });
  getItemPagination = (keySearch) => {
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

    return this.http.post<any>(`${ApiUrl}/Item/GetItemPagination`, model);
  }
  getItemPagination_Grid = () => {
    let pr = new DataTablePaginationParams();
    pr.pageSize = 50;
    pr.page = 1;
    pr.selectFields = ` q.*, ItemTypeName, [FirstImagePath] = ISNULL((SELECT TOP 1 f.[Path] FROM ItemFile i JOIN [File] f ON f.FileId = i.FileId WHERE i.ItemId= q.ItemId AND I.IsImage=1),'assets/img/empty.jpg')`;
    pr.entity = ` Item q LEFT join ItemType t ON t.ItemTypeId=q.ItemTypeId `;
    pr.specialCondition = ` EXISTS( SELECT * FROM ItemFile jk WHERE jk.IsImage=1 AND jk.ItemId= q.ItemId) `;
    return this.http.post<any>(`${ApiUrl}/Item/GetItemPagination`, pr);
  }

  getSelect2ItemPagination = (params) => {
    return this.http.get<any>(`${ApiUrl}/Item/GetSelect2ItemPagination`, { params: params });
  }
  getItemSelect2Pagination(entity) {
    return this.http.post<any>(`${ApiUrl}/Item/GetItemPagination`, entity);
  }
  getDataTableItemPagination = (entity) => this.http.post<DataTablesResponse>(`${ApiUrl}/Item/DataTableItemPagination`, entity);
  getItem = () => this.http.get(`${ApiUrl}/Item/GetItem`);
  getItemByItemType = (entity, itemTypeId) => this.http.post<DataTablesResponse>(`${ApiUrl}/Item/GetItemByItemType/${itemTypeId}`, entity)//{ params: { itemTypeId: itemTypeId } } );
  // getItemByItemType =(itemTypeId) => this.http.get(`${ApiUrl}/Item/GetItemByItemType/`,{ params: { itemTypeId: itemTypeId } } );
  findItemById = (id) => this.http.get<any>(`${ApiUrl}/Item/FindItemById?id=${id}`);
  checkItemNameExist = (itemName) => this.http.get<any>(`${ApiUrl}/Item/CheckItemNameExist?ItemName=${itemName}`);
  // getDataGridItem(dataSource, key, filter = []) {

  //   dataSource = AspNetData.createStore({
  //     key: key,
  //     loadUrl: `${ApiUrl}/Item/GetItemDataGridPagination`,
  //     deleteUrl:`${ApiUrl}/Item/DeleteItem`,
  //     onBeforeSend: function (method, ajaxOptions) {
  //       ajaxOptions.data.keyId = key;

  //       let filterAll = '';
  //       if (filter.length > 0) {
  //         if (ajaxOptions.data.filter != null) {
  //           let dataParse = JSON.parse(ajaxOptions.data.filter);
  //           if (dataParse.length == 3)
  //             dataParse =JSON.parse(JSON.stringify([dataParse]));
  //           dataParse.push('and');
  //           dataParse.push(filter);
  //           filterAll = JSON.stringify(dataParse);
  //         }
  //         else {
  //           filterAll = JSON.stringify(filter);
  //         }
  //       }
  //       else {
  //         filterAll = ajaxOptions.data.filter;
  //       }
  //       if (filterAll != '')
  //         ajaxOptions.data.filter = filterAll;
  //       ajaxOptions.xhrFields = { withCredentials: true };
  //     },
  //     onRemoved(res){
  //       console.log("affter remove");
  //       console.log(res);
  //     }
  //   });
  //   return dataSource;
  // }

  getDataGridItem(dataSource, key) {
    dataSource  = new DataSource({
      store:AspNetData.createStore({
        key: key,
        loadUrl: `${ApiUrl}/Item/GetItemDataGridPagination`,
        deleteUrl:`${ApiUrl}/Item/DeleteItem`,
        onBeforeSend: function (method, ajaxOptions) {
          ajaxOptions.data.keyId = key;
       }
      })
    });
    return dataSource;
  }


}
