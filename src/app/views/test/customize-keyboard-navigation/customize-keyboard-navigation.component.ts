import { NgModule, Component, enableProdMode } from '@angular/core';
import { TestService, State, Employee } from '../test.service';

if(!/localhost/.test(document.location.host)) {
    enableProdMode();
}


@Component({
  selector: 'app-customize-keyboard-navigation',
  templateUrl: './customize-keyboard-navigation.component.html',
  styleUrls: ['./customize-keyboard-navigation.component.css'],
  providers: [TestService]
})
export class CustomizeKeyboardNavigationComponent  {

  states: State[];
    employees: Employee[];
    enterKeyActions: Array<string>;
    enterKeyDirections: Array<string>;
    editOnkeyPress: boolean;
    enterKeyAction: String;
    enterKeyDirection: String;

    constructor(service: TestService) {
        this.employees = service.getEmployees();
        this.states = service.getStates();
        this.enterKeyActions = service.getEnterKeyActions();
        this.enterKeyDirections = service.getEnterKeyDirections();
        this.editOnkeyPress = true;
        this.enterKeyAction = "moveFocus";
        this.enterKeyDirection = "column";
    }

    onFocusedCellChanging(e) {
        e.isHighlighted = true;
    }
}
