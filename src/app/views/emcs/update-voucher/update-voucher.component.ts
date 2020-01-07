import { Component, OnInit, Input } from '@angular/core';
import { Requisition, Profile } from 'src/app/models/EMCSModels';
import { EngineService } from 'src/app/services/engine.service';
import { ToastrService } from 'ngx-toastr';
import { ApiEMCSService } from 'src/app/services/api-ecms.service';
import { AuthService } from 'src/app/services/auth.service';
import { MyHelperService } from 'src/app/services/my-helper.service';
import { Router, ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

const NodeApiUrl = "/engine-file/";
@Component({
  selector: 'app-update-voucher',
  templateUrl: './update-voucher.component.html',
  styleUrls: ['./update-voucher.component.css']
})
export class UpdateVoucherComponent implements OnInit {


  @Input() voucherid: any;

  constructor(
    public engineApi: EngineService,
    private toastr: ToastrService,
    private api: ApiEMCSService,
    private auth: AuthService,
    public helper: MyHelperService,
    private route: ActivatedRoute,
    private trans: TranslateService
  ) { }

  /**init */
  operationResult: any;
  Profile: Profile;
  actionstatus: string
  //Upload File
  file: File;
  choosenEntity: any; // choose parrams on edit modal page
  plansHeader: any[] = []; // header columns
  alertoptions: any = {};
  disableButton: boolean;

  lang: string = this.trans.currentLang.toString()


  /************************************Init ****************************************************/
  ngOnInit() {

    this.auth.nagClass.emcsViewToogle = true; //nag-toogle
    this.choosenEntity = {
      VoucherID: null, EQID: null, State: null, Remark: '', YearAdjust: null, MonthAdjust: null, Profiles: [],
      UserID: this.auth.currentUser.Username,
      CreateTime: ''
    } // choosed params on edit modal page

    this.Profile = {
      FileResult: '', Name: '', EQID: '', Temparature: '', Humidity: '', Passed: false, UploadBy: '', Stamp: null, Remark: '', State: '',
    }
    $('#fileupload').val('');
    this.getData();
  }

  getData() {
    this.route.params.subscribe(params => {
      let _voucherid = this.Profile.VoucherID = this.voucherid || params['businessKey']; //is Input VoucherID or ParramVoucherID
      this.api.findVoucher(_voucherid).subscribe((res) => {
        this.choosenEntity = res.Header[0];
        this.choosenEntity.Profiles = res.Detail;
      })
    });
  }
  /*********************************** Button Functions ***********************************/

  fnaddDetail() {
    var fileName = this.Profile.FileResult = this.helper.getFileNameWithExtension(this.file);
    this.Profile.Name = this.file.name;
    this.choosenEntity.Profiles.push(this.Profile);
    const formData = new FormData();
    formData.append('fileName', fileName);
    formData.append('file', this.file);
    this.api.uploadFile(formData).subscribe(res => true, err => false);

    this.Profile = {
      FileResult: '', Name: '', EQID: '', Temparature: '', Humidity: '', Passed: false, UploadBy: '', Stamp: null, Remark: '', State: '',
    }
    /**Upload file */
    $('#fileupload').val('');
    this.file = null;
  }

  fnSave() {
    debugger;
    this.api.updateVoucher(this.choosenEntity).subscribe((res) => {
      this.operationResult = res
      if (this.operationResult.Success) {
        this.toastr.success(this.operationResult.Message, this.operationResult.Caption);
      }
      else
        this.toastr.error(this.operationResult.Message, this.operationResult.Caption);
    })
  }
  fnDeleteProfile(item) {
    this.choosenEntity.Profiles.splice(this.choosenEntity.Profiles.indexOf(item), 1);
  }

  /**Events */
  handleFileInput(files: FileList) {
    this.file = files.item(0);
  }
  onGetFile(FileName) {
    let url: string = NodeApiUrl;
    url += '/' + FileName;
    window.open(url, '_blank');
  }


}
