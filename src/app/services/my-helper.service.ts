import { Injectable, ViewChild } from '@angular/core';
import { Subject } from 'rxjs';
import { DataTableDirective } from 'angular-datatables';

@Injectable({
  providedIn: 'root'
})

export class MyHelperService {
  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;
  // Must be declared as "any", not as "DataTables.Settings"
  dtOptions: any = {
    /** Declare the use of the extension in the dom parameter*/
    dom: '<"html5buttons"B>lTfgitp',
    /** Configure the buttons */
    buttons: [
      { extend: 'colvis' },
      { extend: 'copy' },
      { extend: 'excel', title: 'ExampleFile' },
      { extend: 'pdf', title: 'MyFile' },
      {
        extend: 'print',
        customize: function (win) {
          $(win.document.body).addClass('white-bg');
          $(win.document.body).css('font-size', '10px');

          $(win.document.body).find('table')
            .addClass('compact')
            .css('font-size', 'inherit');
        }
      }
    ],
    pagingType: 'full_numbers',
    pageLength: 10,
    deferRender: true,
    lengthMenu: [[10, 25, 50, -1], [10, 25, 50, 'All']],
    retrieve: true,
    bFilter: true,
    bLengthChange: true
  };
  // We use this trigger because fetching the list of persons can be quite long,
  // thus we ensure the data is fetched before rendering
  dtTrigger: Subject<any> = new Subject();
  constructor() {


   }
  /**
  * Get FileName with structure yyy-mm-dd...
  */
  getFileNameWithExtension(file: File) {
    var Extension = file.name.slice(file.name.lastIndexOf(".") + 1);
    var FileName = file.name.substring(file.name.lastIndexOf("."), 0);
    return FileName + '-' + this.getDate() + '.' + Extension;
  }
  /**
   * Get File
   * @param files file Input
   */
  handleFileInput(files: FileList): File {
    return files.item(0);
  }
  /**
  * getFileName with YYYY-MM-DD-hh-mm
  */
  getDate() {
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = today.getFullYear();
    var HH = today.getHours();
    var MM = today.getMinutes();
    var ss = today.getSeconds();
    var iii = today.getMilliseconds();
    return yyyy + mm + dd + HH + MM + ss + iii;
  }

  getCurrentDate(){
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = today.getFullYear();
    var HH = today.getHours();
    var MM = today.getMinutes();
    var ss = today.getSeconds();
    return yyyy +'-'+ mm +'-'+ dd +' '+ HH +':'+ MM +':'+ ss;
  }
  

}
