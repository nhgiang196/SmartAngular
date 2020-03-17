
export class Factory {
  FactoryId?: number = 0
  FactoryCode?: string = ''
  FactoryName?: string = ''
  FactoryAddress?: string = ''
  FactoryContact?: string = ''
  ContactPhone?: string = ''
  FactoryBuiltDate?: Date = new Date()
  FactoryStartDate?: Date = new Date()
  FactoryEndDate?:   Date = null
  CreateDate?: Date = null
  ModifyDate?: Date = null
  CreateBy?: string = ''
  ModifyBy?: string = ''
  FactoryType: number = 1 //type1
  Status: number = 1 //working
  FactoryFile?: FactoryFile[] = []
  FactoryTechnology?: FactoryTechnology[] = []
}

export class FactoryTechnology {
  FactoryTechnologyId?: number = 0
  FactoryId?: number = 0
  TechnologyFromDate: Date
  TechnologyToDate: Date
  TechnologyDescription: string
  TechnologyName: string
  IsCurrent: boolean = true
  isNew: boolean = true

}
export class FactoryFile {
  FactoryFileId: number = 0
  FactoryId: number = 0
  FileId: number = 0
  File: Files = new Files()
}



export class Files {
  FileId: number = 0
  FileOriginalName: string
  FileLocalName: string
  FileType: string
  Path: string
  CreateBy: string = ''
  CreateDate: Date = new Date()
  Status: number = 1 //current
}

export class File {
  FileId: number = 0
  FileOriginalName: string
  FileName: string
  Path: string
  CreateBy: string
  CreateDate: Date
  Status: number = 1 //current
}

export class DataTablePaginationParams {
  key?: string = ''
  keyFields?: string = ''
  page?: number = 0
  pageSize?: number = 0
  orderBy?: string = null
  orderDir?: string = 'asc'
  entity?: string = null
  selectFields?: string = null
  specialCondition?: string =null
}
export class Item {
  ItemId?: number = 0
  ItemTypeId?: number = null
  ItemNo?: string
  ItemName?: string
  ItemPrintName?: string
  ItemDescription?: string
  ItemUnitId?: number = null
  ItemModel?: string
  ItemSerial?: string
  ItemManufactureCountry?: string
  ItemManufactureYear?: number = null
  ItemLength?: number = 0
  ItemWidth?: number = 0
  ItemHeight?: number = 0
  ItemWeight?: number = 0
  CreateBy?: string
  CreateDate?: Date
  ModifyBy?: string
  ModifyDate?: Date
  Status?: number = 0

  ItemUnit?: Unit
  ItemPackage?: ItemPackage[] = []
  ItemProperty?: ItemProperty[] = []
  ItemFactory?: ItemFactory[] = []
  ItemFile?: ItemFile[] = []
}

export class ItemFile {
  ItemFileId: number = 0
  ItemId: number = 0
  FileId: number = 0
  IsImage: boolean = false
  File: Files = new Files()
}

export class ItemType {
  ItemTypeId?: number = 0
  ItemTypeName?: string
  ItemTypeCode?: string
  CreateBy?: string
  CreateDate?: Date
  ModifyBy?: string
  ModifyDate?: Date
  Status?: number = 1
  ItemTypeProperty: ItemTypeProperty[] = []
}

export class ItemFactory {
  ItemFactoryId: number = 0;
  ItemId: number = 0;
  FactoryId: number = null;
  FactoryName: string;
  IntergrationCode: string = "";
  Factory: Factory = new Factory();
}
export class ItemPackage {

  ItemPackageId: number = 0
  ItemId: number = 0
  ItemPackageUnitId?: number = null
  ItemPackageCoefficient?: number = 0
  ItemPackageLength?: number = 0
  ItemPackageWidth?: number = 0
  ItemPackageHeight?: number = 0
  ItemPackageWeight?: number = 0
  UnitName?: string
  ItemPackageUnit: ItemPackageUnit = new ItemPackageUnit()
}

export class ItemPackageUnit {

  UnitId?: number = 0
  UnitName: string
  CreateBy: string
  CreateDate?: Date
  ItemPackageLength?: number = 0
  ModifyBy: string
  ModifyDate: Date
  Status: boolean
}

export class ItemProperty {
  ItemPropertyId?: number = 0
  ItemId?: number = 0
  ItemTypePropertyId?: number = null
  ItemTypePropertyValue?: string
  ItemTypePropertyName?: string
  ItemTypeProperty:ItemTypeProperty = new ItemTypeProperty()
}

export class ItemTypeProperty {
  ItemTypePropertyId?: number = 0
  ItemTypeId?: number = 0
  ItemTypePropertyName?: string
  ItemProperty?: ItemProperty[] = []
}


export class ServerSide {
  Key: string
  KeyFields: string
  Page: number = 0
  PageSize: string
  OrderDir: string
  OrderBy: string
}

export class DataTablesResponse {
  data: any[];
  draw: number = 0;
  recordsFiltered: number = 0;
  recordsTotal: number = 0;
}

export class Unit {
  UnitId: number = 0
  UnitName: string
  CreateBy: string
  CreateDate: Date = new Date()
  ModifyBy: string
  ModifyDate: Date
  Status: number = 1
}

export class Stage {
  StageId: number = 0
  StageName: string
  Description: string
  StageCode?: string
  CreateBy?: string
  CreateDate?: Date = new Date()
  ModifyBy?: string
  ModifyDate?: Date
  Status: number = 1
  StageFile?: StageFile[] = []
}
export class StageFile {
  StageFileId: number = 0
  StageId: number = 0
  FileId: number = 0
  File: Files = new Files()
}

export class BomFactory {
	BomFactoryId: number = 0
  FactoryId: number
  FactoryName: number
	Validate?: Date= new Date()
  Descriptions?: string
  CreateBy: string
  CreateDate?: Date = new Date()
  ModifyBy: string
  ModifyDate?: Date = new Date()
  Status?: number = 1
  Factory? : Factory = new Factory();
  BomStage?: BomStage [] = []
}

export class BomItemOut {
	BomItemId: number = 0
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
	BomItemId: number = 0
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
	OrderNumber?: number
	Sequence?: boolean = false
  Description?: string
  BomItemOut?: BomItemOut[] =[]
  Stage?: Stage = new Stage();
}

export class Warehouse {
  WarehouseId: number = 0
  WarehouseCode: string
  WarehouseName: string
  FactoryId: number = null
  WarehouseType: number = 1
  WarehouseAddress: string
  WarehouseUserName: string
  WarehouseLength: number = 0
  WarehouseWidth: number = 0
  WarehouseHeight: number = 0
  CreateBy: string
  CreateDate: Date = null
  ModifyBy: string
  ModifyDate: Date = null
  Status: number = 1
  WarehouseFile: WarehouseFile[] = []
  WarehouseLocation: WarehouseLocation[] = []
}


export class WarehouseFile {
  WarehouseFileId: number = 0
  WarehouseId: number = 0
  FileId: number = 0
  File: Files = new Files()
}

export class WarehouseLocation {
  WarehouseLocationId: number = 0
  WarehouseId: number = 0
  WarehouseLocationCode: string = null
  WarehouseLocationName: string = null
  WarehouseLocationLength: number = 0
  WarehouseLocationWidth: number = 0
  WarehouseLocationHeight: number = 0
  Status: number = 1
}

export class Customer {
	CustomerId: number = 0
	CustomerName?: string
	FactoryId?: number
	CustomerAddress?: string
	ContactName?: string
	ContactEmail?: string
	ContactPhone?: string
	Description?: string
	CreateBy?: string
	CreateDate?: Date
	ModifyBy?: string
	ModifyDate?: Date
	Status?: number = 1
	IsIntergration?: boolean = false
  Contract : Contract[] = []
  CustomerFile: CustomerFile[] = []
}


export class CustomerFile {
  CustomerFileId: number = 0
  CustomerId: number = 0
  FileId: number = 0
  File: Files = new Files()
}



export class Contract {
	ContractId: number = 0
	CustomerId?: number = 0
	ContractNo?: string
	ContractCode?: string
	ContractType?: number = 1
	SignDate?: any
	EffectiveDate?: any
	EndDate?: any
	StandardType?: number = 1
	Ratio?: any
	Description?: string
  IsIntergration?: boolean = true
  ContractPrice : ContractPrice[] = []
  ContractBreach : ContractBreach[] = []
  ContractFile : ContractFile[] = []
}

export class ContractPrice {
	ContractPriceId: number = 0
	ContractId?: number = 0
	Ratio?: any = 0
	Currency?: string = '$'
	Price?: any = 0
	Tax?: any = 0
}

export class ContractBreach {
	ContractBreachId: number= 0
	ContractId?: number = 0
	BreachType: number
	ResolveType?: number
	Times?: number
}



export class ContractFile {
  ContractFileId: number = 0
  ContractId: number = 0
  FileId: number = 0
  Url: string = null
  File: Files = new Files()
}

//Monitor standard
export class MonitorStandard{
  MonitorStandardId: number
  FactoryId: number
  ValidateDateFrom:any
  ValidateDateTo: any
  MonitorStandardDesc: string
  TemperatureMin: number =0
  TemperatureMax: number =0
  PHmin: number =0
  PHmax: number =0
  Codmin: number =0
  Codmax: number =0
  Tssmin:number =0
  Tssmax: number =0
  ColorMin:number =0
  ColorMax:number =0
  Qmin: number =0
  Qmax:number =0
  AmoniMin:number =0
  AmoniMax: number =0
  CreateBy: string
  CreateDate: Date
  ModifyBy: string
  ModifyDate:Date
  Status: boolean
  FactoryName: string
  Factory: Factory =new Factory()
}

export class ChartModel {
  data: []
  label: string
}

export class ChartDemo
{
    data: Data [] =[]
    label : string;
}
export class Data
{
  x: number =0;
  y: number =0;
}



export class UI_CustomFile{
  EntityFileId : number = 0;
  EntityId: number =0;
  FileId: number = 0;
  ContractFileId: number = 0
  ContractId: number = 0
  CustomerFileId: number = 0
  CustomerId: number = 0
  WarehouseFileId: number = 0
  WarehouseId: number = 0
  FactoryFileId: number = 0
  FactoryId: number = 0
  Url: string = null

  File : Files = new Files()
}








