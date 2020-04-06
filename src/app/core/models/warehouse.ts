import { Files } from './file'

export class Warehouse {
    WarehouseId: number = 0
    WarehouseCode: string
    WarehouseName: string 
    FactoryId: number = 0
    WarehouseType: number = 1
    WarehouseAddress: string = null
    WarehouseUserName: string = null
    WarehouseLength: number = 0
    WarehouseWidth: number = 0
    WarehouseHeight: number = 0
    CreateBy: string = null
    CreateDate: Date = null
    ModifyBy: string = null
    ModifyDate: Date = null
    Status: number = 1
    WarehouseFile: WarehouseFile[] = []
    WarehouseLocation: WarehouseLocation[] = []
    FactoryName: string = null;
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
  