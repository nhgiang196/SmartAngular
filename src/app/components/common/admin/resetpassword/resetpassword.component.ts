import { Component, OnInit } from '@angular/core';
import { AdminService } from 'src/app/services/admin.service';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';
import { OperationResult } from 'src/app/helpers/operationResult';

@Component({
  selector: 'app-resetpassword',
  templateUrl: './resetpassword.component.html',
  styleUrls: ['./resetpassword.component.css']
})
export class ResetpasswordComponent implements OnInit {
  loading = false;
  Users: [];
  Account: {
    Username?: '',
    Password?: ''
  }
  constructor(
    private adminService: AdminService,
    private toastr: ToastrService,
    private trans: TranslateService
  ) { }


  ngOnInit() {
    this.getUsers();
    this.Account = {
      Username: '',
      Password: ''
    }
  }
  getUsers = () => this.adminService.getUsers().subscribe(res => this.Users = res)
  ChangePassword() {
    this.adminService.resetPasswordAsync(this.Account).toPromise().then(res => {
      let operationResult = res as OperationResult;
      this.toastr.success(operationResult.Message, operationResult.Caption);
      this.loading = false;
    }).catch(err => {
      this.toastr.error(err.message, err.statusText + ': ' + err.status);
    });
  }

}
