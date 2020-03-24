import { Module } from './module';
export class Function {
  Id: number;
  ModuleId: number;
  ParentId: number;
  NameVi: string;
  NameEn: string;
  Icon: string;
  Link: string;
  Status: number;
  CreateBy: string;
  CreateDate: Date;
  ModifyBy: string;
  ModifyDate: Date;
  Module: Module = new Module();
}
