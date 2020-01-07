import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { EngineService } from 'src/app/services/engine.service';
import { CamundaProcess } from 'src/app/models/camunda';
import { Profile, Requisition } from 'src/app/models/EMCSModels';
import { ToastrService } from 'ngx-toastr';
import { ApiEMCSService } from 'src/app/services/api-ecms.service';
import { AuthService } from 'src/app/services/auth.service';
import { MyHelperService } from 'src/app/services/my-helper.service';
import { Subject } from 'rxjs';
import swal from 'sweetalert2';
import { Router } from '@angular/router';
import { DataTableDirective } from 'angular-datatables';
import { TranslateService } from '@ngx-translate/core';
const NodeApiUrl = "http://10.20.46.41:4300/api/file";
@Component({
  selector: 'app-voucher-requisition',
  templateUrl: './voucher-requisition.component.html',
  styleUrls: ['./voucher-requisition.component.css']
})
export class VoucherRequisitionComponent implements OnInit, OnDestroy {

  constructor(
    private engineApi: EngineService,
    private toastr: ToastrService,
    private api: ApiEMCSService,
    private auth: AuthService,
    public helper: MyHelperService,
    private router: Router,
    private trans: TranslateService
  ) { }


  /**DECLARATION */
  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;
  dtTrigger: Subject<any> = new Subject();

  list: { Departments: any, Equipments: any, Data?: any }; //lists return after Get Data
  /**init */
  operationResult: any;
  Profile: Profile; // Use to add to Requisition.Profiles
  actionstatus:string
  //Upload File
  fileName: string;
  file: File;
  fileUpload = { status: '', message: '', filePath: '' };
  error: string;
  //End uploadfile
  choosenEntity: Requisition; // choose parrams on edit modal page
  plansHeader: any[] = []; // header columns
  alertoptions: any = {};
  loading = false;
  Status = ''; //N: New, M: Modify, X: Delete
  searchParams: { Department: string, Type: string, Year: string, Status: string }; //search params
  CheckMonth: string;
  CheckDate: number;
  isValid: boolean = true;
  lsVoucher: Requisition[];
  userChecklist: any;
  flowKey: string;
  disableButton: boolean;
  lang: string = this.trans.currentLang.toString()

  /************************************Init ****************************************************/
  ngOnInit() {
    this.auth.nagClass.emcsViewToogle = true; //nag-toogle
    this.loading = false;
    this.choosenEntity = {
      VoucherID: null, EQID: null, State: null, Remark: '', YearAdjust: null, MonthAdjust: null, Profiles: [],
      UserID: this.auth.currentUser.Username,
      CreateTime:''
    } // choosed params on edit modal page
    this.Profile = {
      VoucherID: '', FileResult: '', Name: '', EQID: '', Temparature: '', Humidity: '', Passed: false, UploadBy: '', Stamp: null, Remark: '', State: '',
    } //??
    this.fileName = '';
    this.searchParams = { Department: '', Type: '', Year: '', Status: '' }; //search params
    this.lsVoucher = null
    this.list = { Departments: [], Equipments: [] };//lists return after Get Data
    this.getBasic();
    $('#fileupload').val('');
    this.flowKey = "EMCSWorkFlow";
    this.userChecklist = "LeaderCheckList";
    this.disableButton = true;
    this.fnSearch();

          }
  /**Exit page */
  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }

  private getBasic() {
    this.api.getBasic("Department", this.lang).subscribe((res) => {
      if (res.length > 0) {
        this.list.Departments = res;
      }
      else this.toastr.error("Failed load Department", "Error");
    })
    this.api.getBasic("Equipment", '').subscribe((res) => {
      if (res.length > 0) {
        this.list.Equipments = res;
        console.log(res);
      }
      else {
        this.toastr.error("Failed load Equipments", "Error");

      }
    })
    if (this.list.Departments == null || this.list.Equipments == null)
      this.loading = false;
  }

  /***********************************Functions ***********************************/
  handleFileInput(files: FileList) {
    this.file = files.item(0);
  }
  checkVoucherNeedSubmit(DateAdjust) {
    var today = new Date();
    this.CheckMonth = String(today.getMonth() + 1) + "/" + today.getFullYear(); //January is 0!
    this.CheckDate = (Number)(String(today.getDate()));
    return (DateAdjust == this.CheckMonth && this.CheckDate > 5) ? true : false
  }


  addDetail() {
    const formData = new FormData();
    this.fileName = this.helper.getFileNameWithExtension(this.file);
    formData.append('fileName', this.fileName);
    formData.append('file', this.file);
    this.api.uploadFile(formData).subscribe
      (res => this.fileUpload = res, err => this.error = err);
    this.Profile.Name = this.file.name;
    this.Profile.FileResult = this.fileName;

    this.choosenEntity.Profiles.push(this.Profile);
    this.fileName = '';
    this.Profile = {
      VoucherID: '',
      FileResult: '',
      Name: '',
      EQID: '',
      Temparature: '',
      Humidity: '',
      Passed: null,
      UploadBy: '',
      Stamp: null,
      Remark: '',
      State: '',
    }
    $('#fileupload').val('');
    this.file = null;

  }
  onDeleteProfiles(item) {
    this.choosenEntity.Profiles.splice(this.choosenEntity.Profiles.indexOf(item), 1);
  }
  //Download File
  onGetFile(FileName) {
    let url: string = NodeApiUrl;
    url += '/' + FileName;
    window.open(url, '_blank');
  }

  fnDelete(item) {
    this.Status = 'X';
    this.api.deleteVoucher(item.VoucherID).subscribe((res) => {
      var operationResult: any = res
      if (operationResult.Success) {
        swal.fire(operationResult.Caption, operationResult.Message, 'success')
        this.fnSearch();
      }
      else
        this.toastr.error(operationResult.Message, operationResult.Caption);
    })
  }
  fnSave() {
    switch (this.Status) {
      case 'N': //VOUCHER REQUISTION
        this.choosenEntity.State = 'N';
        this.api.addVoucher(this.choosenEntity).subscribe((res) => {
          this.operationResult = res
          if (this.operationResult.Success) {
            this.toastr.success(this.operationResult.Message, this.operationResult.Caption);
            $('#btnClose').click();
            this.fnSearch();
          }
          else
            this.toastr.error(this.operationResult.Message, this.operationResult.Caption);
        })
        break;

      case 'M': // UPDATE VOUCHER REQUISTION
        this.choosenEntity.State = 'M';
        this.api.updateVoucher(this.choosenEntity).subscribe((res) => {
          this.operationResult = res
          if (this.operationResult.Success) {
            this.toastr.success(this.operationResult.Message, this.operationResult.Caption);
            // this line: modal down
            this.fnSearch();
          }
          else
            this.toastr.error(this.operationResult.Message, this.operationResult.Caption);
        })
        break;

      case 'X':
        /**Delete */
        break;
    }

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
  fnSubmit() {
    let camundaForm = {
      "variables":
        { "LeaderCheckList": { "value": this.engineApi.lsCheckers } },
      "businessKey": this.choosenEntity.VoucherID
    }
    switch (this.Status) {
      case 'N': //VOUCHER REQUISTION
        this.choosenEntity.State = 'S';
        this.api.addVoucher(this.choosenEntity).subscribe((res) => {
          this.operationResult = res
          if (this.operationResult.Success) {
            this.engineApi.processDefinitionStart(this.flowKey, camundaForm).subscribe(res => {
              if (res != null) {
                this.toastr.success('Submit Sucess!', 'Your voucher already submitted\n Thank you!');
              }
              else {
                this.toastr.error('Error!', 'Your task did not submit\n Please try again!');
              }
            })
            this.toastr.success(this.operationResult.Message, this.operationResult.Caption);
            $('#btnClose').click();
            this.fnSearch();
          }
          else
            this.toastr.error(this.operationResult.Message, this.operationResult.Caption);
        })
        break;

      case 'M': // UPDATE VOUCHER REQUISTION
        this.choosenEntity.State = 'S';
        this.api.updateVoucher(this.choosenEntity).subscribe((res) => {
          this.operationResult = res
          if (this.operationResult.Success) {
            this.toastr.success(this.operationResult.Message, this.operationResult.Caption);
            // this line: modal down
            this.engineApi.processDefinitionStart(this.flowKey, camundaForm).subscribe(res => {
              if (res != null) {
                this.toastr.success('Submit Sucess!', 'Your voucher already submitted\n Thank you!');
              }
              else {
                this.toastr.error('Error!', 'Your task did not submit\n Please try again!');
              }
            })
            this.fnSearch();
          }
          else
            this.toastr.error(this.operationResult.Message, this.operationResult.Caption);
        })
        break;
    }
  }
  /**Fuctions */
  fnSearch() {
    this.loading = true;
    this.api.getVouchers(this.searchParams.Department || '', this.searchParams.Type, this.searchParams.Year, this.searchParams.Status).subscribe(res => {
      this.lsVoucher = res as Requisition[];
      this.plansHeader = [];
      for (var key in this.lsVoucher[0]) {
        if (key.indexOf('$') < 0) {
          this.plansHeader.push({ title: key });
        }
      }
      this.loading = false;
      this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
        dtInstance.destroy();
        this.dtTrigger.next();
      });


      // })
    })
  }


  fnShowEdit(item) { //open modal
    this.Status = 'M';
    console.log(this.choosenEntity);
    this.api.findVoucher(item.VoucherID).subscribe((res) => {
      this.choosenEntity = res.Header[0];
      this.choosenEntity.Profiles = res.Detail;
      console.log(this.choosenEntity);
    })
    this.DisableButton();
  }
  fnAdd() {
    this.Status = 'N',
      this.choosenEntity.EQID = '';
    this.choosenEntity.VoucherID = '';
    this.choosenEntity.Remark = '';
    this.choosenEntity.Profiles = [];
    $('.modal-title').text('Add Voucher');
  }

  DisableButton() {
    if ((this.choosenEntity.State == 'P' || this.choosenEntity.State == 'S') && this.Status != 'N') {
      this.disableButton = true;
    } else {
      this.disableButton = false;
    }
  }


}
