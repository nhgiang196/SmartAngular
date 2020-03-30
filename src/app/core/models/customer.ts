import { Contract } from './contrack'
import { Files } from './file'

export class Customer {
    CustomerId: number = 0
    FactoryId: number = 0
    CustomerCode: string
    CustomerName: string
    CustomerType: number = 1
    CustomerAddress?: string
    CustomerContact?: string
    CustomerContactEmail?: string
    CustomerContactPhone?: string
    CustomerDescription?: string
    CreateBy?: string
    CreateDate?: Date
    ModifyBy?: string
    ModifyDate?: Date
    Status: number = 1
    IsIntergration: boolean = true
    Contract : Contract[] = []
    CustomerFile: CustomerFile[] = []
  }
  
  
  export class CustomerFile {
    CustomerFileId: number = 0
    CustomerId: number = 0
    FileId: number = 0
    File: Files = new Files()
  }