import { Component, OnInit } from '@angular/core';
import { EngineService } from 'src/app/services/engine.service';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { ApiEMCSService } from 'src/app/services/api-ecms.service';

@Component({
  selector: 'app-check-list',
  templateUrl: './check-list.component.html',
  styleUrls: ['./check-list.component.css']
})
export class CheckListComponent implements OnInit {

  constructor(
    private engineApi: EngineService,
    private AuthService: AuthService,
    private apiService:ApiEMCSService
  ) { }

  lsChecker: Observable<any[]>; //Used to send to Next Checker
  lsCheckerWithName: Observable<any[]>; //Used to show UserName of Next Checker

  ngOnInit() {
    this.lsChecker=null;
    this.lsCheckerWithName=null;
    this.getChecker(this.AuthService.currentUser.Username, "EMCSOverFlow");
  }

  getChecker(owner:string, flowkey: string){    
    this.apiService.GetChecker(owner, flowkey, "", null).subscribe((res)=>{
      let xx =res.Person as any[];
      let tmp:any[]=[]
      xx.forEach(i=>{
        tmp.push(i.Person)
      })
      this.engineApi.lsCheckers=tmp;
      this.lsCheckerWithName = res.UserName as Observable<any[]>;
    }); 
  }

}
