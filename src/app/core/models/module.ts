export class Module {
  Id: number;
  NameVi: string;
  NameEn: string;
  Icon: string;
  Link: string;
  Status: number;
  CreateBy: string;
  CreateDate: Date;
  ModifyBy: string;
  ModifyDate: Date;

  Functions: Function = new Function();
}
