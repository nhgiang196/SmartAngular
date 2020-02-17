
export class Factory {
  FactoryId?: number = 0
  FactoryName?: string
  FactoryAddress?: string
  FactoryContact?: string
  ContactPhone?:   string
  FactoryBuiltDate?: Date
  FactoryStartDate?: Date
  FactoryEndDate?: Date
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
  IsCurrent: boolean

}
export class FactoryFile {
  FactoryFileId: number = 0
  FactoryId: number = 0
  FileId: number = 0
  File: File[]
}



export class File{
  FileId: number = 0
  FileOriginalName: string
  FileName: string
  Path: string
  CreateBy: string
  CreateDate:Date
  Status: number = 1 //current
}