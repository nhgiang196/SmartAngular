import { Contract } from './contrack'
import { Files } from './file'

export class Customer {
    CustomerId: number = 0
    CustomerCode: string
      CustomerName?: string
      FactoryId?: number
      CustomerAddress?: string
      ContactName?: string
      ContactEmail?: string
      ContactPhone?: string
      Description?: string
      CreateBy?: string
      CreateDate?: Date
      ModifyBy?: string
      ModifyDate?: Date
      Status?: number = 1
      IsIntergration?: boolean = false
    Contract : Contract[] = []
    CustomerFile: CustomerFile[] = []
  }
  
  
  export class CustomerFile {
    CustomerFileId: number = 0
    CustomerId: number = 0
    FileId: number = 0
    File: Files = new Files()
  }