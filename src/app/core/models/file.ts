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