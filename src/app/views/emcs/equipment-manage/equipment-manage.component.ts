import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ApiEMCSService } from 'src/app/services/api-ecms.service';
import { AuthService } from 'src/app/services/auth.service';
import { Equipments, Method, Manual, Department } from 'src/app/models/EMCSModels';
import { NgForm } from '@angular/forms';
import { Observable, Subject } from 'rxjs';
import { OperationResult } from 'src/app/helpers/operationResult';
import { ToastrService } from 'ngx-toastr';
import $ from 'jquery';
import { MyHelperService } from 'src/app/services/my-helper.service';
import { DataTableDirective } from 'angular-datatables';

const TCode: string ='EMCS-01' // TCode for Add or Update Equipment

@Component({
  selector: 'app-equipment-manage',
  templateUrl: './equipment-manage.component.html',
  styleUrls: ['./equipment-manage.component.css']
})
export class EquipmentManageComponent implements OnInit {
  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;
  @ViewChild('myInputFile')// set for emtpy file after Close or Reload
  InputManual: ElementRef;
  @ViewChild('myInputFile2')// set for emtpy file after Close or Reload
  InputMehod: ElementRef;
  
  fileUpload = { status: '', message: '', filePath: '' };
  file: File;
  error: string;
  plansHeader: any[];
  selectedItem: Department;
  manual: Manual;
  equipment: Equipments
  method: Method;
  fileName: string;
  operationResult: OperationResult;
  lsEquipments: Equipments[];
  //Search Parameter
  pAssetID: string;
  pEQName: string;
  pDepartment: string;
  pProcessDepartment: string;
  pUserName: string;
  pGetall: boolean;
  loading = false;
  //End Search Parameter
  _checkAssetID: Boolean;//Use to check AssetID, = false when AssetID already exists.

  dtTrigger: Subject<any> = new Subject();

  lsDepartment: Observable<Department[]>;
  constructor(
    private api: ApiEMCSService,
    private authService: AuthService,
    private toastr: ToastrService,
    public helper: MyHelperService
  ) { }

  ngOnInit() {
    this.authService.nagClass.emcsViewToogle = true;   
    this.resetForm();
    this.loadDepartments();
    this.fnSearch();
  }

  loadDepartments() {
    this.api.getDepartment().subscribe((res) => {
      this.lsDepartment = res as Observable<Department[]>;
    });
  }
  /**
   * Reset All attributes with null
   * @param form
   */
  resetForm(form?: NgForm) {
    if (form != null)
      form.resetForm();
    this.equipment = {
      EQID: null,
      Name: '',
      AssetID: '',
      Brand: '',
      Model: '',
      UsedDate: null,
      Stamp: null,
      UserID: '',
      IsAdjust: true,
      State: '',
      Remark: '',
      Department: '',
      ProcessDepartment: '',
      Methods: [],
      Manuals: [],
      ProcessDeptName:'',
      DepartmentName:''
    };
    this.manual = {
      FileName: '',
      Name: '',
      Version: 0,
      EQID: '',
      Stamp: null,
      Remark: '',
      MethodID: 0
    };
    this.method = {
      FileName: '',
      Name: '',
      Version: 0,
      EQID: '',
      Stamp: null,
      Remark: '',
      MethodID: 0
    };
    this.pAssetID = '';
    this.pDepartment = '';
    this.pEQName = '';
    this.pProcessDepartment = '';
    this.pUserName = this.authService.currentUser.Username;
    this.pGetall = false;
    this.fileName = '';
    //reset empty File
    this.InputManual.nativeElement.click();
    this.InputMehod.nativeElement.click();
    this.fnSearch();
  }

  handleFileInput(files: FileList) {
    this.file = files.item(0);
  }

  refreshGridView() {
    this.loading = true;
    this.api.getAllEquipment(this.pAssetID, this.pEQName, this.pDepartment, this.pProcessDepartment, this.pUserName).subscribe(res => {
      this.lsEquipments = res as Equipments[];
      this.plansHeader = [];
      for (var key in this.lsEquipments[0]) {
        if (key.indexOf('$') < 0) {
          this.plansHeader.push({ title: key, data: key });
        }
      }
      // Calling the DT trigger to manually render the table
      //this.dtTrigger.next();
      this.loading = false;
      this.rerender();
    })
  }

  onUploadFile(type) {
    const formData = new FormData();
    let newFileName = this.helper.getFileNameWithExtension(this.file);
    formData.append('fileName', newFileName);
    formData.append('file', this.file);
    this.api.uploadFile(formData).subscribe(res => {
      this.fileUpload = res;
    }, err => this.error = err);
    //1 for Manual
    if (type === 1) {
      this.manual = {
        FileName: '',
        Name: '',
        Version: 0,
        EQID: '',
        Stamp: null,
        Remark: '',
        MethodID: 0
      }
      this.manual.Name = this.file.name;
      this.manual.FileName = newFileName;
      this.manual.Version = 1;
      this.equipment.Manuals.push(this.manual);
      this.fileName = '';
    }
    //2 for Method
    else if (type === 2) {
      this.method = {
        FileName: '',
        Name: '',
        Version: 0,
        EQID: '',
        Stamp: null,
        Remark: '',
        MethodID: 0
      }
      this.method.Name = this.file.name;
      this.method.FileName = newFileName;
      this.method.Version = 1;
      this.equipment.Methods.push(this.method);
    }
    this.file = null;

  }
  /**
   * Asset ID is unique
   * @param AssetID
   */
  isExistAssetID(AssetID) {
    this._checkAssetID == true;
    this.api.checkAssetID(AssetID).subscribe(res => {
      this._checkAssetID = res > 0 ? false : true;
    })
  }

  onDeleteFile(fileName) {
    this.api.deleteFile(fileName).subscribe(res => console.log(res))
  }
  //Download File without RestAPI
  onGetFile(FileName) {
    let url: string = 'http://10.20.46.41:4300/api/file';
    url += '/' + FileName;
    window.open(url, '_blank');
  }

  //Internal Form

  fnSearch() {
    this.pUserName = (this.pGetall == false? "": this.authService.currentUser.Username);
    this.refreshGridView();
  }
  rerender(): void {
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      // Destroy the table first
      dtInstance.destroy();
      // Call the dtTrigger to rerender again
      this.dtTrigger.next();
    });
  }
  ngAfterViewInit(): void {
    this.dtTrigger.next();
  }

  ngOnDestroy(): void {
    // Do not forget to unsubscribe the event
    this.dtTrigger.unsubscribe();
  }


  fnEdit(item: Equipments) {
    this._checkAssetID = true;
    this.api.getDepartment().subscribe((res) => {
      this.lsDepartment = res as Observable<Department[]>;
    });

    this.api.getDetailEquipment(item.EQID).toPromise().then((res) => {
      this.equipment = res.Header[0];
      this.equipment.Manuals = res.Manuals;
      this.equipment.Methods = res.Methods;
    })
  }
  fnDelete(item: Equipments) {
    this.api.deleteEquipment(item).subscribe((res) => this.messageRespone(res));
  }
  //Open Modal
  fnAdd() {
    this.resetForm();
  }

  fnClose() {
    // this.equipment.Manuals.forEach(element => {
    //   this.onDeleteFile(element.FileName);
    // });
    // this.equipment.Methods.forEach(element => {
    //   this.onDeleteFile(element.FileName);
    // });
    this.resetForm();
  }

  //Save Equiment
  saveEquiment() {
    if (this.equipment.EQID == null) {
      this.equipment.UserID = this.authService.currentUser.Username;
      this.api.addEquipment(this.equipment).subscribe(res => this.messageRespone(res))
    } else {
      this.api.updateEquipment(this.equipment).subscribe(res => this.messageRespone(res))
    }

  }
  //Respone Message after execute
  messageRespone(res: any) {
    this.operationResult = res as OperationResult;
    if (this.operationResult.Success) {
      this.toastr.success(this.operationResult.Message, this.operationResult.Caption);
      this.resetForm();
      this.fnSearch();
      $('#btnClose').click();
    } else
      this.toastr.error(this.operationResult.Message, this.operationResult.Caption);
  }

  //Delete Manual Item
  onDeleteManualFile(item) {
    this.equipment.Manuals.splice(this.equipment.Manuals.indexOf(item), 1);
  }
  //Delete Method Item
  onDeleteMethodFile(item) {
    this.equipment.Methods.splice(this.equipment.Methods.indexOf(item), 1);
  }

}
