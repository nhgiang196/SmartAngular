
import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { SmartSelectComponent } from 'src/app/views/smartin/ui-sample/smart-select/smart-select.component';
import 'devextreme/data/odata/store';


@Component({
  selector: 'app-display-profile',
  templateUrl: './display-profile.component.html',
  styleUrls: ['./display-profile.component.css']
})
export class DisplayProfileComponent  {
  profile: any = {};
  priority: any[];
  dataSource: any;
  constructor(private router: ActivatedRoute, private authService: AuthService) {
    this.dataSource = {
      store: {
        type: 'odata',
        key: 'Task_ID',
        url: 'https://js.devexpress.com/Demos/DevAV/odata/Tasks'
      },
      expand: 'ResponsibleEmployee',
      select: [
        'Task_ID',
        'Task_Subject',
        'Task_Start_Date',
        'Task_Due_Date',
        'Task_Status',
        'Task_Priority',
        'Task_Completion',
        'ResponsibleEmployee/Employee_Full_Name'
      ]
    };
    this.priority = [
      { name: 'High', value: 4 },
      { name: 'Urgent', value: 3 },
      { name: 'Normal', value: 2 },
      { name: 'Low', value: 1 }
    ];


   }
  T : any;
  myselect: any;
  myspecialID: any;
  ngOnInit() {
    this.router.params.subscribe(params => {
      console.log(params);
    });
    this.loadInfo();
    $('body').addClass('top-navigation');
  }

  ngAfterViewInit() {
    $('#lefNav').hide();
    $('#homeMenuButton').hide();

  }

  ngOnDestroy() {
    $('body').removeClass('top-navigation');
    $('#lefNav').show();
    $('#homeMenuButton').show();

  }
  loadInfo() {
    this.authService.profile().subscribe(res => {
      if (res[0] != null)
        this.profile = res[0] as any;
      else
        this.profile = {}
    });
  }
}


