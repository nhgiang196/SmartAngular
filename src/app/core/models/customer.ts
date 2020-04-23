import { Contract } from './contrack'
import { Files } from './file'

export class Customer {
    CustomerId: number = 0
    FactoryId: number = 0
    FactoryName: string = null
    CustomerCode: string
    CustomerName: string
    CustomerType: number = 1
    CustomerAddress?: string = null
    CustomerContact?: string = null
    CustomerContactEmail?: string = null
    CustomerContactPhone?: string = null
    CustomerDescription?: string = null
    CreateBy?: string
    CreateDate?: Date
    ModifyBy?: string
    ModifyDate?: Date
    Status: number = 1
    IsIntergration: boolean = false
    Contract : Contract[] = []
    CustomerFile: CustomerFile[] = []
  }
  
  
  export class CustomerFile {
    CustomerFileId: number = 0
    CustomerId: number = 0
    FileId: number = 0
    File: Files = new Files()
  }