import { Component, OnInit } from '@angular/core';
import { EngineService } from 'src/app/services/engine.service';
import { NgForm, FormGroup } from '@angular/forms';
import { ToastrService } from 'node_modules/ngx-toastr';
@Component({
  selector: 'app-work-flow',
  templateUrl: './work-flow.component.html',
  styleUrls: ['./work-flow.component.css']
})
export class WorkFlowComponent implements OnInit {

  error: string;

  fileUpload = {status: '', message: '', filePath: ''};
  
  constructor(public api: EngineService, private toastr: ToastrService) { }
  operationResult: any;
  
  ngOnInit() {
    this.api.getWorkFlow();
    this.resetForm();
  }
  resetForm(form?: NgForm) {
    if (form != null)
      form.resetForm();
    this.api.entity = {
      id: null,
      name: '',
      deploymentTime: null,
      tenantId: '',
      file: null
    }
  }

  fnAdd = () => {
    this.resetForm();
    $('#myModal').show();
  }
  fnEdit = (item) => { this.api.entity = item; $('#myModal').show(); }
  fnCloseModal = () => { $('#myModal').hide(); }
  fnUpload() {
    // this.addRecord();
    this.uploadFileToActivity();

  }
  fnDelete(id) {
    if (confirm("Do you want remove it?")) {
      this.api.deleteWorkFlow(id).subscribe((res) => {
        if (res == null || '')
          this.api.getWorkFlow();
        else
          this.toastr.error(res.toString(), 'Error');
      })
    }
  }
  updateRecord() {
    this.api.redeploymentWorkFlow('x').subscribe(res => {
      this.operationResult = res
      if (this.operationResult.Success) {
        this.toastr.success(this.operationResult.Message, this.operationResult.Caption);
        this.resetForm();
        this.api.getWorkFlow();
      }
      else
        this.toastr.error(this.operationResult.Message, this.operationResult.Caption);
    });
  }
  handleFileInput(files: FileList) {
    this.api.entity.file = files.item(0);
  }
  uploadFileToActivity() {
    const formData = new FormData();
    formData.append( 'deployment-name', this.api.entity.name);  
    formData.append('file', this.api.entity.file);  
    this.api.deploymentWorkFlow(formData).subscribe((res)=>{
        if(res.status ===200)
        {
          this.toastr.success('Upload file successed','Success')
          setTimeout(() => {
            $('#myModal').hide();
            this.api.getWorkFlow();
          }, 1000);
         
        }
    },err=> this.fileUpload = err)
  } 

}
