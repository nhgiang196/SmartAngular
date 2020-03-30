import { Factory } from './factory'
import { Files } from './file'
import { Unit } from './unit'

export class Item {
    ItemId?: number = 0
    ItemTypeId?: number = null
    ItemCode?: string
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
