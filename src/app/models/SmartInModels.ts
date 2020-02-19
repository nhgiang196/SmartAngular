
export class Factory {
  FactoryId?: number = 0
  FactoryCode?: string
  FactoryName?: string
  FactoryAddress?: string = null
  FactoryContact?: string = null
  ContactPhone?:   string = null  
  FactoryBuiltDate?:  Date = new Date()
  FactoryStartDate?:  Date = new Date()
  FactoryEndDate?: Date    = new Date()
  CreateDate?: Date = null
  ModifyDate?: Date = null
  CreateBy?:   string = null
  ModifyBy?:   string = null
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
  File: Files= new Files()
}



export class Files{
  FileId: number = 0
  FileOriginalName: string
  FileName: string 
  Path: string
  CreateBy: string = ''
  CreateDate:Date = new Date()
  Status: number = 1 //current
}

export class DataTablePaginationParram{
  key: string
  keyFields: string
  page: number
  pageSize :number
  orderBy: string
  orderDir: string
}