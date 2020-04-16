import { Item } from './item'
import { Unit } from './unit'
import { Stage } from './stage'
import { Factory } from './factory'

export class BomFactory {
	BomFactoryId: number = 0
  FactoryId: number=0
  FactoryName: number
	BomFactoryValidateDate?: any=''
  BomFactoryDescription?: string
  CreateBy: string
  CreateDate?: any
  ModifyBy: string
  ModifyDate?: any
  Status?: number = 1
  Factory? : Factory = new Factory();
  BomStage?: BomStage [] = []
}

export class BomItemOut {
	BomItemOutId: number = 0
	BomStageId: number = 0
  ItemId?: number = 0
  ItemName:string
  UnitId?: number = 0
  UnitName: string
  Quantity?: number
  Item?: Item = new Item();
  Unit?: Unit = new Unit();
  Status?:boolean
  IsNew?:boolean
  BomItemIn?: BomItemIn [] = []
}

export class BomItemIn {
	BomItemInId: number = 0
	BomStageId: number = 0
  ItemId?: number = 0
  ItemName:string
  UnitId?: number = 0
  UnitName: string
  Quantity?: number
  Status?:boolean
  IsNew?:boolean
  Item?: Item = new Item();
  Unit?: Unit = new Unit();
}

export class BomStage {
	BomStageId: number = 0
  BomFactoryId: number = 0
  StageId?: number = 0
  StageName: string
	OrderNumber?: number =0;
	IsSequence?: boolean = false
  BomStageDescription?: string
  BomItemOut?: BomItemOut[] =[]
  Stage?: Stage = new Stage();
}
