import { NgModule, Component, enableProdMode } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { DxDataGridModule } from 'devextreme-angular';
import { TestService, Employee, State } from '../test.service';



if(!/localhost/.test(document.location.host)) {
  enableProdMode();
}

@Component({
  selector: 'app-form-edit',
  templateUrl: './form-edit.component.html',
  styleUrls: ['./form-edit.component.css'],
  providers: [TestService]
})
export class FormEditComponent  {
  dataSource: Employee[];
  states: State[];

  constructor(service: TestService) {
      this.dataSource = service.getEmployees();
      this.states = service.getStates();
  }

}
