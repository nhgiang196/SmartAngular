import { NgModule, Component, enableProdMode,OnInit } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { DxDataGridModule, DxListModule, DxDropDownBoxModule, DxTagBoxModule } from 'devextreme-angular';
import { createStore } from "devextreme-aspnet-data-nojquery";

// if(!/localhost/.test(document.location.host)) {
//     enableProdMode();
// }

export class Status {
  id: number;
  name: string;
}

@Component({
  selector: 'app-customer-editor',
  templateUrl: './customer-editor.component.html',
  styleUrls: ['./customer-editor.component.css']
})
export class CustomerEditorComponent  {
  employees: object;
  tasks: object;
  statuses: Status[];
  dropDownOptions: object;
  editorOptions: object;
  url: string;

  constructor() {
    this.dropDownOptions = { width: 500 };
    this.editorOptions = {
      itemTemplate: "statusTemplate"
    }
    this.url = "https://js.devexpress.com/Demos/Mvc/api/CustomEditors";
    this.statuses = [{
      "id": 1, "name": "Not Started"
    }, {
      "id": 2, "name": "In Progress"
    }, {
      "id": 3, "name": "Deferred"
    }, {
      "id": 4, "name": "Need Assistance"
    }, {
      "id": 5, "name": "Completed"
    }
    ];
    this.tasks = createStore({
      key: "ID",
      loadUrl: this.url + "/Tasks",
      updateUrl: this.url + "/UpdateTask",
      insertUrl: this.url + "/InsertTask",
      onBeforeSend: function (method, ajaxOptions) {
        ajaxOptions.xhrFields = { withCredentials: true };
      }
    });
    this.employees = createStore({
      key: "ID",
      loadUrl: this.url + "/Employees",
      onBeforeSend: function (method, ajaxOptions) {
        ajaxOptions.xhrFields = { withCredentials: true };
      }
    });
  }

  onSelectionChanged(selectedRowKeys, cellInfo, dropDownBoxComponent) {
    cellInfo.setValue(selectedRowKeys[0]);
    if (selectedRowKeys.length > 0) {
      dropDownBoxComponent.close();
    }
  }

  calculateFilterExpression(filterValue, selectedFilterOperation, target) {
    if (target === "search" && typeof (filterValue) === "string") {
      return [(this as any).dataField, "contains", filterValue];
    }
    return function (data) {
      return (data.AssignedEmployee || []).indexOf(filterValue) !== -1
    }
  }

  cellTemplate(container, options) {
    var noBreakSpace = "\u00A0",
      text = (options.value || []).map(element => {
        return options.column.lookup.calculateCellValue(element);
      }).join(", ");
    container.textContent = text || noBreakSpace;
    container.title = text;
  }

}
