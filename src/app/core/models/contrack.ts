import { Files } from './file'

export class Contract {
	ContractId: number = 0
	CustomerId: number = 0
	ContractNo: string
	ContractCode: string
	ContractType: number = 1
	ContractDescription?: string = null
	ContractSignDate?: any= null
	ContractEffectiveDate?: any= null
	ContractEndDate?: any = null
	StandardType: number = 2
	WasteWaterRatio: any = 0
	CreateBy?: string = null
	ModifyBy?: string = null 
	CreateDate?: Date = null
	ModifyDate?: Date = null
	IsIntergration?: boolean = false
	ContractPrice : ContractPrice[] = []
	ContractBreach : ContractBreach[] = []
	ContractFile : ContractFile[] = []
}

export class ContractPrice {
	ContractPriceId: number = 0
	ContractId?: number = 0
	WaterFlow?: any = 0
	Currency?: string = null
	Price?: any = 0
	Tax?: any = 0
}

export class ContractBreach {
	ContractBreachId: number= 0
	ContractId?: number = 0
	BreachType: number
	ResolveType?: number
	Times?: number  = 1
}



export class ContractFile {
  ContractFileId: number = 0
  ContractId: number = 0
  FileId: number = 0
  Url: string = null
  File: Files = new Files()
}