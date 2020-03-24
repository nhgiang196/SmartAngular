import { Component, OnInit } from '@angular/core';
import { FunctionService } from 'src/app/core/services';
import { Function } from 'src/app/core/models/function';
@Component({
  selector: 'app-function',
  templateUrl: './function.component.html',
  styleUrls: ['./function.component.css']
})
export class FunctionComponent implements OnInit {
  functions: Function[] = [];
  constructor(private functionService: FunctionService) { }

  ngOnInit() {
    this.loadData();
  }

  loadData(){
    this.functionService.getAllFuntion().subscribe(res=>{
      this.functions = res as any;
      console.log(this.functions);
    })
  }
}
