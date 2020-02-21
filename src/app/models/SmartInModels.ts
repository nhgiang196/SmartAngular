
export class Factory {
  FactoryId?: number = 0 
  FactoryCode?: string
  FactoryName?: string
  FactoryAddress?: string = null
  FactoryContact?: string = null
  ContactPhone?:   string = null  
  FactoryBuiltDate?:  Date
  FactoryStartDate?:  Date
  FactoryEndDate?: Date    
  CreateDate?: Date = null
  ModifyDate?: Date = null
  CreateBy?: string = null
  ModifyBy?: string = null
  FactoryType: number  = 1 //type1
  Status: number  = 1 //working
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
  FileName: string
  Path: string
  CreateBy: string = ''
  CreateDate: Date = new Date()
  Status: number = 1 //current
}

export class File {
  FileId: number  = 0
  FileOriginalName: string
  FileName: string
  Path: string
  CreateBy: string
  CreateDate: Date
  Status: number = 1 //current
}

export class DataTablePaginationParram {
  key: string
  keyFields: string
  page: number = 0
  pageSize: number = 0
  orderBy: string
  orderDir: string
}

export class ServerSideParram {
  key: string = null
  keyFields: string = null
  page: number = 1
  pageSize: number  = 50
  orderBy: string = null
  orderDir: string = 'asc'
}
export class Item {
  ItemId?: number = 0
  ItemTypeId?: number = 0
  ItemNo?: string
  ItemName?: string
  ItemPrintName?: string
  ItemUnitId?: number = 0
  ItemModel?: string
  ItemSerial?: string
  ItemManufactureCountry?: string
  ItemManufactureYear?: number = 0
  ItemLength?: number = 0
  ItemWidth?: number = 0
  ItemHeight?: number = 0
  ItemWeight?: number = 0
  CreateBy?: string
  CreateDate?: Date
  ModifyBy?: string
  ModifyDate?: Date
  Status?: number = 0
}

export class ItemType {
  ItemTypeId?: number = 0
  ItemTypeName?: string
  CreateBy?: string
  CreateDate?: Date
  ModifyBy?: string
  ModifyDate?: Date
  Status?: number = 1
  ItemTypeProperty: ItemTypeProperty[] = []
}

export class ItemPackage {

  ItemPackageId: number = 0
  ItemId: number = 0
  ItemPackageUnitId?: number = 0
  ItemPackageCoefficient?: number = 0
  ItemPackageLength?: number = 0
  ItemPackageWidth?: number = 0
  ItemPackageHeight?: number = 0
  ItemPackageWeight?: 0
}

export class ItemProperty {
  ItemPropertyId?: number = 0
  ItemId?: number = 0
  ItemTypePropertyId?: number = 0
  ItemTypePropertyValue?: string
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

export class Unit
{
  UnitId: number = 0
  UnitName: string
  CreateBy: string
  CreateDate: Date = new Date()
  ModifyBy: string
  ModifyDate: Date 
  Status: number = 1
}