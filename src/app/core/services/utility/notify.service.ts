import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';
import swal from "sweetalert2";
import { LanguageService } from '../language.service';
@Injectable({
  providedIn: 'root'
})
export class NotifyService {

constructor(private toastr: ToastrService,private trans: TranslateService,private langService:LanguageService) {

 }

  success(message: string) {
    this.toastr.success(message);
  }

  error(message: string) {
    this.toastr.error(message);
  }

  warning(message: string) {
    this.toastr.warning(message);
  }

  confirmDelete(callBack){
    //this.trans.use(this.langService.getLanguage());
    swal.fire({
      titleText: this.trans.instant('messg.update.confirmDelete'),
      confirmButtonText: this.trans.instant('Button.OK'),
      cancelButtonText: this.trans.instant('Button.Cancel'),
      type: 'warning',
      showCancelButton: true,
      reverseButtons: true
    }).then((result) => {
      if (result.value) {
        callBack();
      }
    })
  }

  confirmDeleteSuccess(){
    swal.fire(
      {
        title: 'Deleted!',
        titleText: this.trans.instant('messg.delete.success'),
        confirmButtonText: this.trans.instant('Button.OK'),
        type: 'success',
      }
    );
  }

}


