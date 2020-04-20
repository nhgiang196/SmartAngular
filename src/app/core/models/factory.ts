import { Files } from './file'

export class Factory {
    FactoryId?: number = 0
    FactoryCode?: string = ''
    FactoryName?: string = ''
    FactoryAddress?: string = ''
    FactoryContact?: string = ''
    FactoryContactPhone?: string = ''
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