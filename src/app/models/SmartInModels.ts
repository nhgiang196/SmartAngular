
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

export class DataTablePaginationParram {
  key: string = ''
  keyFields: string = ''
  page: number = 1
  pageSize: number = 50
  orderBy: string = null
  orderDir: string = 'asc'
  entity: string = null
  selectFields: string = null
}
export class Item {
  ItemId?: number = 0
  ItemTypeId?: number = 0
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
  StageID: number = 0
  StageName: string
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

