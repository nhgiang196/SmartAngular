import { Injectable, ViewChild } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})

export class MyHelperService {
  constructor(){}
  /**
  * Get FileName with structure yyy-mm-dd...
  */
  removeFileNameWithExtension(fileName) {
    //'2020022713380245'.length == 16
    var Extension = fileName.slice(fileName.lastIndexOf(".") + 1);
    var FileName =fileName.substring(fileName.lastIndexOf(".")-16, 0);
    return FileName + Extension;
  }
  getFileNameWithExtension(file: File) {
    var Extension = file.name.slice(file.name.lastIndexOf(".") + 1);
    var FileName = file.name.substring(file.name.lastIndexOf("."), 0);
    return FileName + '-' + this.getDate() + '.' + Extension;
  }

  getFileExtension(file: File){
    var Extension = file.name.slice(file.name.lastIndexOf(".") + 1);
    return  Extension;

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

  getCurrentDate() {
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = today.getFullYear();
    var HH = today.getHours();
    var MM = today.getMinutes();
    var ss = today.getSeconds();
    return yyyy + '-' + mm + '-' + dd + ' ' + HH + ':' + MM + ':' + ss;
  }
///
/// Set new Time with GMT + 7
///
  dateTimeConvert(str) {
    var date = new Date(str)
    var dd = String(date.getDate()).padStart(2, '0');
    var mm = String(date.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = date.getFullYear();
    var HH = date.getHours() + 7; // set for GTM +7
    var MM = date.getMinutes();
    var ss = date.getSeconds();
    return new Date(yyyy + '-' + mm + '-' + dd + ' ' + HH  + ':' + MM + ':' + ss);
  }
  dateConvertToString(date?: Date){
    if (date==null) return null;
    date = new Date(date);
    var dd = String(date.getDate()).padStart(2, '0');
    var mm = String(date.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = date.getFullYear();
    return yyyy + '-' + mm + '-' + dd + 'T00:00:00';
    // 2012-02-20T17:00:00

  }
  dateConvert(date?: Date){
    if (date==null) return null;
    date = new Date(date);
    var dd = String(date.getDate()).padStart(2, '0');
    var mm = String(date.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = date.getFullYear();
    return yyyy + '-' + mm + '-' + dd;
    // 2012-02-20T17:00:00

  }
  yearConvertToString(date: Date){
    if (date==null) return null;
    var dd = String(date.getDate()).padStart(2, '0');
    var mm = String(date.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = date.getFullYear();
    return yyyy ;

  }
  monthConvertToString(date: Date){
    if (date==null) return null;
    var dd = String(date.getDate()).padStart(2, '0');
    var mm = String(date.getMonth() + 1).padStart(2, '0'); //January is 0!
    var MM = date.getMonth();
    return MM+1 ;

  }

}


/*
** dx-form/simpleItem
 editorType: Type: String
Accepted Values: 'dxAutocomplete' | 'dxCalendar' | 'dxCheckBox' | 'dxColorBox' | 'dxDateBox' | 'dxDropDownBox' | 'dxHtmlEditor'
| 'dxLookup' | 'dxNumberBox' | 'dxRadioGroup' | 'dxRangeSlider' | 'dxSelectBox' | 'dxSlider' | 'dxSwitch' | 'dxTagBox'
 | 'dxTextArea' | 'dxTextBox'

** dx-grid/ column
dataType: 'string' | 'number' | 'date' | 'boolean' | 'object' | 'datetime'

** validate type
type:  'required' | 'numeric' | 'range' | 'stringLength' | 'custom' | 'compare' | 'pattern' | 'email' | 'async'


 */
