import { Factory } from './factory'
import { Item } from './item'
import { Stage } from './stage'
import { Unit } from './unit'


export class ProcessLog {
  ProcessLogId: number = 0
  FactoryId?: number = 0
  StageId?: number = 0
  ItemOutId?: number = 0
  ShiftId?: number = 0
  ProcessLogTime?: any
  ProcessLogDate?: any
  ItemOutIndicator?: any= 0
  ItemOutUnitId?: number= 0
  ItemOutQuantity?: any= 0
  ItemEletricIndicator?: any= 0
  ItemWaterIndicator?: any= 0
  CODIn?: any= 0
  CODOut?: any= 0
  pHIn?: any= 0
  pHOut?: any= 0
  TSSIn?: any= 0
  TSSOut?: any= 0
  QIn?: any= 0
  QOut?: any= 0
  ColorIn?: any= 0
  ColorOut?: any= 0
  AmoniIn?: any= 0
  AmoniOut?: any= 0
  TemperatureIn?: any= 0
  TemperatureOut?: any= 0
  CreateBy?: string
  CreateDate?: any
  ModifyBy?: string
  ModifyDate?: any
  Status?: number =1
  Description: string
  Factory: Factory = new Factory()
  ItemOutUnit: Item = new Item()
  ItemOut: Unit = new Unit()
  Shift: Shift = new Shift()
  Stage: Stage = new Stage()

  ProcessLogItem: ProcessLogItem[] = []
}



export class ProcessLogItem {
  ProcessLogItemId: number = 0
  ProcessLogId: number = 0
  ItemId: number = 0
  UnitId: number=0
  Quantity?: any=0
}

export class  SearchProcessLog{
  startDay:Date = new Date();
  endDay:Date = new Date();
  factoryId:number
}

export class Shift {
  ShiftId: number = 0
  ShiftName?: string
  ShiftTimeBegin?: Date
  ShiftTimeEnd?: Date
  ShiftDesc?: string
  CreateBy?: string
  CreateDate?: Date
  ModifyBy?: string
  ModifyDate?: Date
  Status?: number
}

export class ProcessPlanFactory {
  ProcessPlanFactoryId: number = 0
  FactoryId: number = 0
  ProcessPlanMonth: number = 0
  ProcessPlanYear: number = 0
  ProcessPlanDescription: string
  CreateBy: string
  CreateDate: any
  ModifyBy: string
  ModifyDate: any
  Status: number=1;
  ProcessPlanStage:Array<ProcessPlanStage>= new Array<ProcessPlanStage>();
}

export class ProcessPlanStage {
  ProcessPlanStageId: number
  ProcessPlanFactoryId: number
  StageId: number
  StageName: string
  ProcessPlanItem:Array<ProcessPlanItem> =new Array<ProcessPlanItem>();
}


export class ProcessPlanItem {
  ProcessPlanItemId: number
  ProcessPlanStageId: number
  ItemId: number
  UnitId: number
  Quantity: number
  Item: Item
  ProcessPlanStage: ProcessPlanStage
  Unit: Unit
}

export class FilterModel{
  StartDate: Date
  EndDate: Date
  FactoryId
}
