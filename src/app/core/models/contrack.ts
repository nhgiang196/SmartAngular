import { Files } from './file'

export class Contract {
	ContractId: number
	CustomerId: number
	ContractNo: string
	ContractCode: string
	ContractType: number
	ContractDescription?: string
	ContractSignDate?: Date
	ContractEffectiveDate?: Date
	ContractEndDate?: Date
	StandardType: number
	WasteWaterRatio: any
	CreateBy?: string
	CreateDate?: Date
	ModifyBy?: string
	ModifyDate?: Date
	IsIntergration?: boolean = true
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