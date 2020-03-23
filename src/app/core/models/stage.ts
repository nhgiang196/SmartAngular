import { Files } from './file'

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