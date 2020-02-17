
export class Factory {
  FactoryId?: number
  FactoryName?: string
  FactoryAddress?: string
  FactoryContact?: string
  ContactPhone?:   string
  FactoryBuiltDate?: Date
  FactoryStartDate?: Date
  FactoryEndDate?: Date
  FactoryType: number = 1
  Status: number = 1
  FactoryFile?: []
  FactoryTechnology?: []
}

export class FactoryTechnology {
  FactoryTechnologyId: number
  FactoryId: number
  TechnologyFromDate: Date
  TechnologyToDate: Date
  TechnologyDescription: string
  TechnologyName: string
  IsCurrent: boolean

}
export class FactoryFile {
  FactoryFileId: number
  FactoryId: number
  FileId: number
  File: File[]
}



export class File{
  FileId: number
  FileOriginalName: string
  FileName: string
  Path: string
  CreateBy: string
  CreateDate:Date
  Status: number
}