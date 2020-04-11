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
  ProcessLogTime?: Date
  ProcessLogDate?: Date
  ItemOutIndicator?: any
  ItemOutUnitId?: number
  ItemOutQuantity?: any
  ItemEletricIndicator?: any
  ItemWaterIndicator?: any
  CODIn?: any
  CODOut?: any
  pHIn?: any
  pHOut?: any
  TSSIn?: any
  TSSOut?: any
  QIn?: any
  QOut?: any
  ColorIn?: any
  ColorOut?: any
  AmoniIn?: any
  AmoniOut?: any
  TemperatureIn?: any
  TemperatureOut?: any
  CreateBy?: string
  CreateDate?: Date
  ModifyBy?: string
  ModifyDate?: Date
  Status?: number

  Factory: Factory = new Factory()
  ItemOutUnit: Item = new Item()
  ItemOut: Unit = new Unit()
  Shift: Shift = new Shift()
  Stage: Stage = new Stage()

  ProcessLogItem: ProcessLogItem[] = []
}



export class ProcessLogItem {
  ProcessPlanItemId: number = 0
  ProcessPlanStageId: number = 0
  ItemId: number = 0
  UnitId: number
  Quantity?: any
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
