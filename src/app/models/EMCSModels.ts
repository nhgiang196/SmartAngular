import { Time } from '@angular/common';

export class Equipments {
  EQID: string
  AssetID?: string
  Name: string
  Brand?: string
  Model?: string
  UsedDate?: Date
  Stamp?: Date
  UserID?: string
  IsAdjust?: boolean
  State?: string
  Remark?: string
  Department?: string
  ProcessDepartment?: string
  Manuals?: Manual[]
  Methods?: Method[]
  ProcessDeptName?:string
  DepartmentName?:string
}

export class Manual {
  MethodID: number
  EQID: string
  Name?: string
  FileName?: string
  Version: number
  Stamp?: Date
  Remark?: string
}
export class Method {
  MethodID: number
  EQID: string
  Name?: string
  FileName?: string
  Version: number
  Stamp?: Date
  Remark?: string
}

export class Plans {
  VoucherID: string
  EQID: string
  State?: string
  Stamp?: Date
  PlanedBy?: string
  Profile?: Profile[];
}

export class PlanTimeJob {
  EQID?: string
  StartTime?: any
  CreateInDay?: number
  ArrivalNoticeDay?: number
  NoiticeEnable?: boolean
  MakeVoucherEnable?: boolean
  UserID?: string
  PlanTimeJob_Items?: PlanTimeJob_Items[]
}

export class Profile {
  VoucherID: string
  FileResult: string
  Name: string
  EQID: string
  Temparature?: string
  Humidity?: string
  Passed?: boolean
  UploadBy?: string
  Stamp?: Date
  Remark?: string
  State?: string

}

export class Requisition {
  VoucherID: string
  EQID: string
  State: string
  UserID: string
  Remark: string
  Profiles?: Profile[]
  Department?: string
  MonthAdjust: number
  YearAdjust: number
  CreateTime?: string
}
export class Department {
  CostCenter: string
  Specification?: string
}
export interface PlanTimeJob_Items {
  EQID: string
  Month: number
  Year: number
  IsCreated?: boolean
}
