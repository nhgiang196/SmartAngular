import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Customer, CustomerFile, Factory } from 'src/app/models/SmartInModels';
import { ToastrService } from 'ngx-toastr';
import swal from 'sweetalert2';
import { MyHelperService } from 'src/app/services/my-helper.service';
import { TranslateService } from '@ngx-translate/core';
import { WaterTreatmentService } from 'src/app/services/api-watertreatment.service';
import { trigger, animate, style, transition } from '@angular/animations';


@Component({
  selector: 'app-customer-detail',
  templateUrl: './customer-detail.component.html',
  styleUrls: ['./customer-detail.component.css'],
  animations: [
    // the fade-in/fade-out animation.
    trigger('simpleFadeAnimation', [
      transition(':leave',
        animate(300, style({ opacity: 0 })))
    ])
  ]
})

export class CustomerDetailComponent implements OnInit {

  constructor(
    private api: WaterTreatmentService,
    private router: Router,
    private route: ActivatedRoute,
    private toastr: ToastrService,
    private helper: MyHelperService,
    private trans: TranslateService,
  ) { }

  
  private  pathFile = "uploadFileCustomer";
  entity : Customer;
  files: File[] = [];
  addFiles: { FileList: File[], FileLocalNameList: string[] };
  invalid: any = {};
  uploadReportProgress: any = { progress: 0, message: null, isError: null };
  initCombobox = { Factories: [], FullFactories: [] };
  EditRowID = 0;


    /**INIT FUNCTIONS */
  ngOnInit() {
    this.resetEntity();
    this.loadInit();
  }
  fnTest(){
    console.log(this.route);
    console.log(this.router);
  }

  async loadInit(){
    await this.loadFactoryList();
    
    /**Add Combobox Value: FACTORY */
    let dataResolver = this.route.snapshot.data["dataResolver"];
    let _factoryAddTag = await this.initCombobox.FullFactories.find(x=>x.FactoryID== dataResolver.FactoryId );
    if (_factoryAddTag && await !this.initCombobox.Factories.find(x=> x.FactoryID== dataResolver.FactoryId) )  
      this.initCombobox.Factories = this.initCombobox.Factories.concat([_factoryAddTag]);
    this.entity = dataResolver;
    this.entity.Contract = [];
    debugger;
    await this.loadContractByCustomer();
    console.log(this.entity);

  }

  
  
  /**PRIVATE FUNCTIONS  */

  private async loadFactoryList() {
    let res = await this.api.getBasicFactory().toPromise().then().catch(err => this.toastr.warning('Get factories Failed, check network')) as any;
    this.initCombobox.Factories = ( res as any).result.filter(x=>x.Status ==1) as Factory[];
    this.initCombobox.FullFactories = ( res as any).result as Factory[];
    console.log(this.initCombobox);
  }

  private async loadContractByCustomer(){
      this.api.getContractByCustomer( this.route.snapshot.params.id).subscribe(res=>{
      this.entity.Contract = res.result as any ;
    })
  }
  


  private async resetEntity() { //reset entity values
    this.entity = new Customer();
    this.files = [];
    this.addFiles = { FileList: [], FileLocalNameList: [] }
    this.invalid = {};
    this.uploadReportProgress =  { progress : 0, message: null , isError: null };
    this.EditRowID=0;
  }

 



  /**EVENT TRIGGER */

  async onSelect(event) { //drag file(s) or choose file(s) in ngFileZone
    var askBeforeUpload = false;
    if (event.rejectedFiles.length > 0) this.toastr.warning(this.trans.instant('messg.maximumFileSize5000'));
    var _addFiles = event.addedFiles;
    for (var index in _addFiles) {
      
      let item = event.addedFiles[index];
      let convertName = this.helper.getFileNameWithExtension(item);
      let currentFile = this.entity.CustomerFile;
      let findElement = currentFile.filter(x => x.File.FileOriginalName == item.name)[0];
      //ASK THEN GET RESULT
      if (findElement != null) {
        if (!askBeforeUpload) {
          askBeforeUpload = true;
          var allowUpload = true;
          await swal.fire({
            title: 'File trùng',
            titleText: 'Một số file bị trùng, bạn có muốn đè các file này lên bản gốc?',
            type: 'warning',
            showCancelButton: true,
            reverseButtons: true
          }).then((result) => {
            if (result.dismiss === swal.DismissReason.cancel) allowUpload = false;
          })
        }
        if (!allowUpload) return;
        let _FileElement = this.files.filter(x=>x.name == findElement.File.FileOriginalName)[0];
        let _indexFileElement = this.files.indexOf(_FileElement,0);
        this.files.splice(_indexFileElement, 1);
        this.addFiles.FileList.splice(_indexFileElement, 1);
      }
      else {
        let _warehouseFile = new CustomerFile();
        _warehouseFile.File.FileOriginalName = item.name;
        _warehouseFile.File.FileLocalName = convertName;
        _warehouseFile.File.Path = this.pathFile + '/' + convertName;
        _warehouseFile.File.FileType = item.type;
        this.entity.CustomerFile.push(_warehouseFile);
        this.addFiles.FileLocalNameList.push(convertName);
      }

    }
    this.files.push(...event.addedFiles); //refresh showing in Directive
    this.addFiles.FileList.push(...event.addedFiles);

  }

  fnDownloadFile(filename) { //press FILES preview
    this.api.downloadFile(this.pathFile + '/' + filename);
  }


  


  

}
