import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { ItemType, ItemProperty, ItemTypeProperty } from 'src/app/models/SmartInModels';
import { WaterTreatmentService } from 'src/app/services/api-watertreatment.service';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';
import { Subject } from 'rxjs';
import { DataTableDirective } from 'angular-datatables';
import { trigger, transition, animate, style } from '@angular/animations';
import { getDate } from 'ngx-bootstrap/chronos/utils/date-getters';
import { AuthService } from 'src/app/services/auth.service';
import swal from 'sweetalert2';
declare let $: any;
@Component({
  selector: 'app-item-type',
  templateUrl: './item-type.component.html',
  styleUrls: ['./item-type.component.css'],
  animations: [
    // the fade-in/fade-out animation.
    trigger('simpleFadeAnimation', [
      transition(':leave',
        animate(300, style({ opacity: 0 })))
    ])
  ]
})
export class ItemTypeComponent implements OnDestroy, OnInit {
  itemTypes: ItemType[]
  entity: ItemType;
  itemTypeProperty: ItemTypeProperty
  newItemTypeProperty: ItemTypeProperty;
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject();
  ACTION_STATUS: string;
  laddaSubmitLoading = false;
  iboxloading = false;
  existName = false;
  EditRowID: number =0;
  constructor(
    private api: WaterTreatmentService,
    private toastr: ToastrService,
    private trans: TranslateService,
    private auth: AuthService
  ) { }

  ngOnInit(): void {
    this.loadInit()
    this.resetEntity();
    //  this.serverSide();
  }
  private resetEntity() {
    this.entity = new ItemType();
    this.itemTypeProperty = new ItemTypeProperty();
    this.newItemTypeProperty =  new ItemTypeProperty();
  }

  loadInit = () => {
    this.dtOptions = {
      autoWidth: true,
      responsive: true,
      pagingType: 'full_numbers',
      pageLength: 10,
      language:
      {
        searchPlaceholder: this.trans.instant('DefaultTable.searchPlaceholder'),
        emptyTable: this.trans.instant('DefaultTable.emptyTable'),
        info: this.trans.instant('DefaultTable.info'),
        infoEmpty: this.trans.instant('DefaultTable.infoEmpty'),
        infoFiltered: this.trans.instant('DefaultTable.infoFiltered'),
        infoPostFix: this.trans.instant('DefaultTable.infoPostFix'),
        thousands: this.trans.instant('DefaultTable.thousands'),
        lengthMenu: this.trans.instant('DefaultTable.lengthMenu'),
        loadingRecords: this.trans.instant('DefaultTable.loadingRecords'),
        processing: this.trans.instant('DefaultTable.processing'),
        search: this.trans.instant('DefaultTable.search'),
        zeroRecords: this.trans.instant('DefaultTable.zeroRecords'),
        //url: this.trans.instant('DefaultTable.url'),
        paginate: {
          first: '<<',
          last: ">>",
          next: ">",
          previous: "<"
        }
      }
    };
    this.loadItemType();    
    this.EditRowID =0;
  }

  loadItemType = () => {
    $('#myTable').DataTable().clear().destroy();
    this.api.getItemType().subscribe(res => {
      console.log(res);
      this.itemTypes = res as any
      this.dtTrigger.next();
    });
  }
  ngOnDestroy(): void {
    // Do not forget to unsubscribe the event
    this.dtTrigger.unsubscribe();
  }
  fnUpdate(current)
  {
    this.ACTION_STATUS = 'update'
    this.entity = current;
    this.existName = false;
  }
  fnDelete(id) {
    swal.fire({
      title: this.trans.instant('Factory.DeleteAsk_Title'),
      titleText: this.trans.instant('Factory.DeleteAsk_Text'),
      type: 'warning',
      showCancelButton: true,
      reverseButtons: true
    }).then((result) => {
        if (result.value) {
          this.api.deleteItemType(id).subscribe(res => {
            var operationResult: any = res
            if (operationResult.Success) {
              swal.fire(
                'Deleted!', this.trans.instant('messg.delete.success'), 'success'
              );
             this.loadInit();
              $("#myModal4").modal('hide');
            }
            else this.toastr.warning(operationResult.Message);
          }, err => { this.toastr.error(err.statusText) })
        }
      })
  }
  fnAdd() {
    this.ACTION_STATUS = 'add';
    this.existName = false;
    this.resetEntity();
  }
  
  fnEditItem(index){ //press edit item (in modal)
    this.EditRowID = index +1;
    this.itemTypeProperty = this.entity.ItemTypeProperty[index];
  }
  fnSaveItem(){
    this.EditRowID = 0;
  }

  fnAddItem() {
    if (this.newItemTypeProperty.ItemTypePropertyName == null) {
      this.toastr.warning("Validate", this.trans.instant('Factory.data.TechnologyName') + this.trans.instant('messg.isnull'))
      return;
    }
    this.entity.ItemTypeProperty.push(this.newItemTypeProperty);
    this.newItemTypeProperty = new ItemTypeProperty();
  }
  fnDeleteItem(index) {
    this.entity.ItemTypeProperty.splice(index, 1);
  }


 async fnSave() {
    this.laddaSubmitLoading = true;
    var e = this.entity;
    // e.ModifyBy
    // if (this.ACTION_STATUS == 'add') {
    //   e.CreateDate = new Date();
    //   e.CreateBy = this.auth.currentUser.Username
    // }
    // else {
    //   e.ModifyDate = new Date();
    //   e.ModifyBy = this.auth.currentUser.Username
    // }

    if ( await this.fnValidate(e)) {
      console.log('send entity: ', e);
      if (this.ACTION_STATUS == 'add') {
        e.CreateBy = this.auth.currentUser.Username;
        this.api.addItemType(e).subscribe(res => {
          var operationResult: any = res
          if (operationResult.Success) {
            this.toastr.success(this.trans.instant("messg.add.success"));
          }
          else this.toastr.warning(operationResult.Message);
          this.laddaSubmitLoading = false;
        }, err => { this.toastr.error(err.statusText); this.laddaSubmitLoading = false; })
      }
      if (this.ACTION_STATUS == 'update') {   
        e.ModifyBy = this.auth.currentUser.Username;
        this.api.updateItemType(e).subscribe(res => {
          var operationResult: any = res
          if (operationResult.Success) {
            this.toastr.success(this.trans.instant("messg.update.success"));
          }
          else this.toastr.warning(operationResult.Message);
          this.laddaSubmitLoading = false;
        }, err => { this.toastr.error(err.statusText); this.laddaSubmitLoading = false; })
      }
      this.loadInit();
    }
  }
  private async fnValidate(e) {
    let result =  await this.api.validateItemType(this.entity).toPromise().then() as any;
    if (result.Success) return true;
    else {
      this.laddaSubmitLoading = false;
      this.existName = true;
      return false;
    }
}

}

